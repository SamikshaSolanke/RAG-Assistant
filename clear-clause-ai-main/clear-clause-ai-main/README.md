

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## API Integration

This project includes a production-grade API integration layer for communicating with the FastAPI backend.

### Backend Connection

The frontend connects to a FastAPI backend running on **port 8000** using a session-based architecture:

1. User uploads a document → Backend creates a session with unique `session_id`
2. Session ID is stored in client state (SessionContext)
3. All subsequent operations (query, summarize, compare, analyze) use the session ID

**Available Backend Endpoints:**
- `POST /api/upload` - Upload document and create session
- `POST /api/query` - Ask questions about the document
- `POST /api/summarize` - Generate document summary
- `POST /api/compare` - Compare clause with document
- `POST /api/analyze` - Perform risk analysis
- `GET /api/health` - Check backend health status

### Environment Configuration

1. **Copy `.env.example` to `.env.local`:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure required variables:**
   - `VITE_API_BASE_URL=http://localhost:8000` - Backend API URL
   - `VITE_API_TIMEOUT=60000` - Request timeout (60 seconds)
   - `VITE_ENABLE_API_LOGGING=true` - Enable API logging (development only)
   - `VITE_MAX_UPLOAD_SIZE_MB=10` - Client-side file size limit

3. **CORS Configuration (Important):**
   - Frontend runs on **port 8080** (Vite dev server)
   - Ensure backend `.env` includes: `CORS_ORIGINS=http://localhost:8080`
   - Without this, you'll get CORS errors in the browser console

### Service Layer Architecture

The API integration uses a modular architecture with automatic retry logic and error handling:

**Core Components:**

- **`src/services/apiClient.ts`** - Axios client with production features:
  - Automatic retry with exponential backoff (3 attempts)
  - Request ID tracking for debugging (`X-Request-ID` header)
  - Timeout handling (60 seconds default)
  - Consistent error transformation to `ApiError`

- **`src/services/api.ts`** - High-level service functions:
  - `uploadDocument(file, onUploadProgress?, signal?)` - Upload with progress tracking
  - `queryDocument(sessionId, query, signal?)` - Query document
  - `summarizeDocument(sessionId, signal?)` - Generate summary
  - `compareClause(sessionId, clause, signal?)` - Compare clause
  - `analyzeRisks(sessionId, analysisType?, signal?)` - Perform analysis
  - `healthCheck(signal?)` - Check backend health

- **`src/contexts/SessionContext.tsx`** - React Context for session state:
  - Stores `sessionId`, `filename`, `chunkCount`
  - Persists to `sessionStorage` for page refresh resilience
  - `useSession()` hook for component access

- **`src/hooks/useApiMutations.ts`** - React Query mutation hooks:
  - `useUploadDocument()` - Upload file and create session
  - `useQueryDocument()` - Ask questions (requires sessionId)
  - `useSummarizeDocument()` - Generate summary (requires sessionId)
  - `useCompareClause()` - Compare clause (requires sessionId)
  - `useAnalyzeRisks()` - Analyze risks (requires sessionId)

- **`src/hooks/useApiQueries.ts`** - React Query query hooks:
  - `useHealthCheck()` - Monitor backend (refetches every 30s)
  - `useSessionStatus()` - Check session validity (optional)

### TypeScript Types

All API types are defined in `src/types/api.ts`, mirroring the backend Pydantic models:

```typescript
// Request types
interface UploadRequest {}
interface QueryRequest { session_id: string; query: string; }
interface SummarizeRequest { session_id: string; }
interface CompareRequest { session_id: string; clause: string; }
interface AnalyzeRequest { session_id: string; analysis_type?: string; }

// Response types
interface UploadResponse { session_id: string; filename: string; chunk_count: number; }
interface QueryResponse { answer: string; retrieved_chunks: RetrievedChunk[]; }
interface SummarizeResponse { summary: string; }
interface CompareResponse { analysis: string; }
interface AnalyzeResponse { risks: string[]; summary: string; }
interface HealthCheckResponse { status: string; timestamp: string; }

// Error type
class ApiError extends Error {
  constructor(message: string, status: number, detail?: string) {}
}
```

### Error Handling

The API layer provides comprehensive error handling:

```typescript
import { useQueryDocument, ApiError } from '@/services';

const MyComponent = () => {
  const { mutate, isLoading, error, data } = useQueryDocument();

  const handleQuery = (query: string) => {
    mutate({ sessionId: 'abc123', query });
  };

  if (error instanceof ApiError) {
    return <div>Error: {error.message} (Status: {error.status})</div>;
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data && <p>Answer: {data.answer}</p>}
    </div>
  );
};
```

**Error Types:**
- **4xx Client Errors** - Invalid input, missing session, etc. (no retry)
- **5xx Server Errors** - Backend errors (auto-retry with backoff)
- **Network Errors** - Connection timeout, no internet (auto-retry)

### Using React Query Hooks

React Query is pre-configured for optimal DX with automatic loading/error/caching:

**Upload Example:**
```typescript
import { useUploadDocument } from '@/services';

const DocumentUpload = () => {
  const { mutate, isLoading, error, data } = useUploadDocument();

  const handleUpload = (file: File) => {
    mutate(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
      {isLoading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}
      {data && <p className="text-green-500">Upload complete! Session: {data.session_id}</p>}
    </div>
  );
};
```

**Query Example:**
```typescript
import { useQueryDocument, useSession } from '@/services';

const QuerySection = () => {
  const { sessionId } = useSession();
  const { mutate, isLoading, data } = useQueryDocument();

  const handleQuery = (query: string) => {
    mutate({ sessionId: sessionId!, query });
  };

  return (
    <div>
      <input placeholder="Ask a question..." onKeyPress={(e) => {
        if (e.key === 'Enter') handleQuery(e.currentTarget.value);
      }} />
      {isLoading && <p>Thinking...</p>}
      {data && <div>{data.answer}</div>}
    </div>
  );
};
```

### Session Management

Sessions are managed globally using React Context:

```typescript
import { useSession } from '@/services';

const MyComponent = () => {
  const { sessionId, filename, chunkCount, clearSession, isSessionActive } = useSession();

  if (!isSessionActive) {
    return <p>No document uploaded. Please upload first.</p>;
  }

  return (
    <div>
      <p>File: {filename} ({chunkCount} chunks)</p>
      <button onClick={clearSession}>Clear Session</button>
    </div>
  );
};
```

**Session Storage:**
- Sessions persist in `sessionStorage` (clears on tab close)
- Loaded automatically on page refresh
- Cleared on explicit logout/error

### Testing API Integration

1. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check frontend environment:**
   ```bash
   cat .env.local
   # Should show VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Check browser console:**
   - Look for CORS errors (red messages)
   - Check Network tab for API requests
   - Enable `VITE_ENABLE_API_LOGGING=true` for detailed logs

4. **Common Issues:**
   - **CORS Error:** Update backend `CORS_ORIGINS` to include `http://localhost:8080`
   - **Connection Refused:** Ensure backend is running on port 8000
   - **Timeout:** Increase `VITE_API_TIMEOUT` in `.env.local`

### Request Features

All API requests include production-grade features:

- **Request ID:** Every request gets a unique `X-Request-ID` for tracing
- **Retry Logic:** Network errors auto-retry 3 times with exponential backoff
- **Timeout:** Configurable timeout (default 60 seconds)
- **Progress Tracking:** File uploads report progress via callback
- **Cancellation:** Support for `AbortSignal` to cancel requests
- **Logging:** Development mode logs request/response details




## How can I deploy this project?

Simply open (https://lovable.dev/projects/b340cfc6-9ccd-4412-9bae-fb41138a7d53) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
