export type AgreementStatus =
  | "not_sent"
  | "sent"
  | "viewed"
  | "completed"
  | "declined"
  | "voided";

export interface ProjectAgreementData {
  projectName: string;
  jobId: string;
  status: AgreementStatus;
  signedPdfUrl?: string;
  signedAt?: string;
  envelope?: {
    envelopeId: string;
    sentAt: string;
    signerEmail: string;
    lastViewedAt?: string;
  };
}

export const shouldDisplayActionBanner = (status?: string): boolean => {
  return status === "sent" || status === "viewed";
};

export const defaultMockAgreement: ProjectAgreementData = {
  projectName: "Commercial Steel Warehouse",
  jobId: "JOB-2026-884",
  status: "sent",
  signedAt: undefined,
  signedPdfUrl: "/sample-agreement.pdf",
  envelope: {
    envelopeId: "env_99384729184",
    sentAt: "2026-11-15T10:30:00Z",
    signerEmail: "client@thesteel.com",
    lastViewedAt: "2026-11-16T08:15:00Z",
  },
};
