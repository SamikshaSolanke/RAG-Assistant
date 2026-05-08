import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import FormData from 'form-data';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'file parse error' });

    // `files.file` should contain the uploaded recording
    // Types will vary depending on formidable version
    // @ts-ignore
    const file = files.file;
    if (!file) return res.status(400).json({ error: 'no file uploaded' });

    try {
      // 1) Transcribe audio -> text
      const fd = new FormData();
      fd.append('file', fs.createReadStream(file.filepath));
      fd.append('model', 'gpt-4o-mini-transcribe'); // or 'gpt-4o-transcribe' for maximum quality
      if (fields.language) fd.append('language', fields.language as string);

      const transcriptionResp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...fd.getHeaders(),
        },
        body: fd as any,
      });

      const transcriptionJson = await transcriptionResp.json();
      const transcript = transcriptionJson.text || transcriptionJson?.data?.text || '';

      // 2) Send the transcript to the LLM to ask it to interpret the clause / explain risks.
      // Add a short system prompt telling the model to explain in plain language and include a legal-disclaimer.
      const systemPrompt = `You are a helpful assistant that explains legal document clauses in plain language. Do NOT provide legal advice — give general explanations, highlight potential risks and suggest what a user should ask a qualified lawyer to check.`;

      const responseResp = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          input: `${systemPrompt}\n\nUser audio transcription:\n${transcript}`,
        }),
      });

      const responseJson = await responseResp.json();
      // Response shape may vary. Try a few fields to be safe.
      const assistantText = responseJson.output_text || (responseJson.output && responseJson.output[0] && responseJson.output[0].content && responseJson.output[0].content[0] && responseJson.output[0].content[0].text) || '';

      // 3) Generate assistant audio (TTS)
      const ttsResp = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: 'alloy',
          input: assistantText,
        }),
      });

      const audioArrayBuffer = await ttsResp.arrayBuffer();
      const audioBuffer = Buffer.from(audioArrayBuffer);
      const audioBase64 = audioBuffer.toString('base64');

      // return transcript, assistant text and base64 audio to the client
      return res.status(200).json({ transcript, assistantText, audioBase64, audioContentType: 'audio/mpeg' });

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'processing error' });
    }
  });
}