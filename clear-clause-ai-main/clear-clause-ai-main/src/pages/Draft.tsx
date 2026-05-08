import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";

type Template = {
  id: string;
  title: string;
  filename: string; // file placed in public/templates/
  description: string;
  requiredFields: { name: string; label: string; placeholder?: string }[];
};

const templates: Template[] = [
  {
    id: "legal",
    title: "Legal Agreement",
    filename: "Legal.pdf",
    description: "General legal agreement boilerplate to start from.",
    requiredFields: [
      { name: "partyA", label: "Party A (Name)" },
      { name: "partyB", label: "Party B (Name)" },
      { name: "effectiveDate", label: "Effective Date", placeholder: "YYYY-MM-DD" },
    ],
  },
  {
    id: "vendor",
    title: "Vendor Agreement",
    filename: "Vendor.pdf",
    description: "Template for vendor / supplier agreements.",
    requiredFields: [
      { name: "vendorName", label: "Vendor Name" },
      { name: "clientName", label: "Client Name" },
      { name: "serviceDescription", label: "Service Description" },
    ],
  },
  {
    id: "residence",
    title: "Residence Agreement",
    filename: "Residence.pdf",
    description: "Rental / residence agreement template.",
    // Expanded fields: the full form shown when user clicks Create Now for Residence only
    requiredFields: [
      { name: "tenantName", label: "Tenant Name", placeholder: "Full name as in ID" },
      { name: "tenantAge", label: "Tenant Age", placeholder: "e.g. 30" },
      { name: "tenantPAN", label: "Tenant PAN (optional)" },

      { name: "landlordName", label: "Landlord Name", placeholder: "Full name as in ID" },
      { name: "landlordAge", label: "Landlord Age", placeholder: "e.g. 55" },
      { name: "landlordPAN", label: "Landlord PAN (optional)" },

      // Property address broken down (helps fill forms & map into boilerplate)
      { name: "flatNo", label: "Flat / Apartment No.", placeholder: "e.g. A-101" },
      { name: "buildingName", label: "Building / Society Name", placeholder: "e.g. Green Meadows" },
      { name: "street", label: "Street / Road", placeholder: "e.g. MG Road" },
      { name: "area", label: "Area / Locality", placeholder: "e.g. Kothrud" },
      { name: "city", label: "City", placeholder: "e.g. Pune" },
      { name: "state", label: "State", placeholder: "e.g. Maharashtra" },
      { name: "pinCode", label: "PIN Code", placeholder: "e.g. 411038" },

      // Agreement terms
      { name: "commencementDate", label: "Commencement Date", placeholder: "DD/MM/YYYY" },
      { name: "termMonths", label: "Term (months)", placeholder: "e.g. 11" },
      { name: "endDate", label: "End Date (if fixed)", placeholder: "DD/MM/YYYY or leave blank" },

      // Financials
      { name: "monthlyRent", label: "Monthly Rent / License Fee (INR)", placeholder: "e.g. 15000" },
      { name: "securityDeposit", label: "Security Deposit (INR)", placeholder: "e.g. 45000" },
      { name: "paymentDueDate", label: "Rent Due Date (e.g. 5th of each month)" },

      // Use / restrictions
      { name: "permittedUse", label: "Permitted Use (e.g. Residential only)", placeholder: "Residential / Commercial etc." },
      { name: "sublettingAllowed", label: "Is Subletting Allowed?", placeholder: "Yes / No" },

      // Notice and termination
      { name: "noticePeriodDays", label: "Notice Period (days)", placeholder: "e.g. 30" },

      // Additional clauses / schedule notes
      { name: "otherClauses", label: "Other Clauses / Notes (optional)", placeholder: "Any specific clauses to include" },

      // Signatures / witnesses (optional)
      { name: "witness1", label: "Witness 1 (Name & Address, optional)" },
      { name: "witness2", label: "Witness 2 (Name & Address, optional)" },
    ],
  },
  {
    id: "employment",
    title: "Employment Contract",
    filename: "Employment.pdf",
    description: "Employment offer & contract template.",
    requiredFields: [
      { name: "employeeName", label: "Employee Name" },
      { name: "employerName", label: "Employer / Company Name" },
      { name: "salary", label: "Salary / Compensation" },
    ],
  },
  {
    id: "service",
    title: "Service Agreement",
    filename: "Service.pdf",
    description: "Service-level agreement and scope of work.",
    requiredFields: [
      { name: "provider", label: "Service Provider" },
      { name: "client", label: "Client" },
      { name: "scope", label: "Scope of Work" },
    ],
  },
  {
    id: "construction",
    title: "Construction Contract",
    filename: "Construction.pdf",
    description: "Construction / works contract template.",
    requiredFields: [
      { name: "contractor", label: "Contractor" },
      { name: "owner", label: "Owner" },
      { name: "startDate", label: "Start Date" },
    ],
  },
];

export default function Draft({ currentLanguage }: { currentLanguage?: string }) {
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<string>("");

  function openPdf(template: Template) {
    // PDFs placed inside public/templates/filename -> available at /templates/filename
    window.open(`/templates/${template.filename}`, "_blank");
  }

  function openCreateModal(template: Template) {
    const initialValues: Record<string, string> = {};
    template.requiredFields.forEach((f) => (initialValues[f.name] = ""));
    setFormValues(initialValues);
    setActiveTemplate(template);
    setGeneratedDoc("");
    setIsModalOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!activeTemplate) return;

    // NOTE: For now we create a simple text-based filled document by replacing placeholders.
    // When you provide hardcoded content for each template, replace `sampleTemplateContent`
    // with that content and run replacements like below using the keys in requiredFields.

    // Use a template that references some common keys; for Residence you will later replace with full boilerplate.
    const sampleTemplateContent = `\n--- ${activeTemplate.title} (DRAFT) ---\n\nThis is a generated draft of the ${activeTemplate.title}.\n\n${activeTemplate.requiredFields
      .map((f) => `${f.label}: {{${f.name}}}`)
      .join("\n")}\n\n(Replace this text with the official boilerplate that will be provided later.)\n`;

    let filled = sampleTemplateContent;
    Object.entries(formValues).forEach(([k, v]) => {
      const re = new RegExp(`{{${k}}}`, "g");
      filled = filled.replace(re, v || `<<${k}>>`);
    });

    setGeneratedDoc(filled);
  }

  function downloadTxt() {
    const blob = new Blob([generatedDoc || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTemplate?.id || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Draft Templates</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">Pick a template to preview the PDF or start creating a draft from a boilerplate.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <Card key={t.id} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{t.title}</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">{t.filename}</div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{t.description}</CardDescription>

              <div className="flex gap-3">
                <Button onClick={() => openPdf(t)}>
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
                <Button onClick={() => openCreateModal(t)}>
                  <Download className="w-4 h-4 mr-2" /> Create Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal (simple) */}
      {isModalOpen && activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-2xl overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold">Create: {activeTemplate.title}</h2>
              <div>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>

            <form onSubmit={(e) => { handleSubmit(e); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/*
                  For Residence we already expanded requiredFields substantially.
                  Other templates keep their smaller lists — this modal uses the template's requiredFields.
                */}
                {activeTemplate.requiredFields.map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium mb-1">{f.label}</label>
                    {f.name === "otherClauses" || f.name === "witness1" || f.name === "witness2" ? (
                      <textarea
                        name={f.name}
                        value={formValues[f.name] || ""}
                        onChange={handleChange}
                        placeholder={f.placeholder || `Enter ${f.label}`}
                        className="w-full border rounded-md px-3 py-2 h-24"
                      />
                    ) : (
                      <input
                        name={f.name}
                        value={formValues[f.name] || ""}
                        onChange={handleChange}
                        placeholder={f.placeholder || `Enter ${f.label}`}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    )}
                  </div>
                ))}

                {/* Extra freeform notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Additional Notes (optional)</label>
                  <textarea name="notes" value={formValues["notes"] || ""} onChange={handleChange} className="w-full border rounded-md px-3 py-2 h-24" />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button type="submit" onClick={() => handleSubmit()}>
                  Generate Draft Preview
                </Button>
                <Button variant="secondary" onClick={() => { setFormValues({}); setGeneratedDoc(""); }}>
                  Reset
                </Button>
              </div>
            </form>

            {/* Preview + Download area */}
            {generatedDoc && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Generated Draft Preview</h3>
                <textarea readOnly value={generatedDoc} className="w-full h-48 border rounded-md p-3 font-mono text-sm" />

                <div className="flex gap-3 mt-3">
                  <Button onClick={downloadTxt}>Download .txt</Button>
                  <Button onClick={() => {
                   window.open("/templates/LEAVE AND LICENSE AGREEMENT.pdf", "_blank");
                  }}
                   >
  Download PDF
</Button>


                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
