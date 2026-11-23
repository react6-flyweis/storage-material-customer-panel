import type { TourDefinition } from "../tour.types";
import { paymentProofForm, paymentProofModal, unpaidInvoices, paidInvoices } from "./panels";
import { anchor, anchorWithStatus, click, modal, onPage } from "./tour-helpers";

const PREVIEW = "/invoice_preview";
const UPLOAD = "Shown while a payment has no proof yet.";
const HISTORY = anchor("payments-history");
const NO_INVOICE = "You'll see this once you have an unpaid invoice.";

const pendingProof = paymentProofModal("pending_review", "Pending Review");
const approvedProof = paymentProofModal("approved", "Approved");
const rejectedProof = paymentProofModal("rejected", "Rejected");

const remarkModal = modal(
  "invoice-remark-modal",
  click(anchor("invoice-remark"), "Submit a Remark", "<b>Submit Remark</b> opens a short form."),
);

const invoiceProofForm = modal(
  "payment-proof-form",
  click(anchor("invoice-proof"), "Submit Proof", "<b>Submit Proof</b> opens the payment proof form."),
);

/** A payment from upload to review, and the invoices behind it. */
export const paymentsGuideTour: TourDefinition = {
  id: "payments-guide",
  name: "Payments Guide",
  description: "Submit a payment's proof and follow its review.",
  estimatedMinutes: 4,
  steps: [
    ...onPage({ route: "/payments" }, [
      {
        id: "pg-upcoming",
        element: anchor("payments-upcoming"),
        title: "1 · What's Due",
        description: "Payments coming up. Overdue ones are listed below in red.",
        speechText: "Payments coming up are listed here, and overdue ones below.",
        side: "top",
      },
      {
        id: "pg-upload",
        element: anchorWithStatus("payment-upload", "open"),
        title: "2 · Before You Send Proof",
        description: "After paying by bank transfer, press <b>Upload</b> on the payment.",
        side: "left",
        whenMissing: UPLOAD,
        fallback: anchor("payments-upcoming"),
      },
      {
        id: "pg-form",
        element: anchor("payment-proof-form"),
        panels: [paymentProofForm],
        title: "2 · Payment Proof",
        description: "Enter the transaction ID, date and amount, and add a note if you like.",
        whenMissing: UPLOAD,
        fallback: anchor("payments-upcoming"),
      },
      {
        id: "pg-form-files",
        element: anchor("payment-proof-files"),
        panels: [paymentProofForm],
        title: "2 · Attach the Receipt",
        description: "Drop your receipt here. It's required.",
        side: "top",
        whenMissing: UPLOAD,
        fallback: anchor("payments-upcoming"),
      },
      {
        id: "pg-form-submit",
        element: anchor("payment-proof-submit"),
        panels: [paymentProofForm],
        title: "2 · Submit Proof",
        description: "Enabled once there's a transaction ID and a receipt. Finance verifies it within 24 hours.",
        side: "top",
        whenMissing: UPLOAD,
        fallback: anchor("payments-upcoming"),
      },
      {
        id: "pg-uploaded",
        element: anchorWithStatus("payment-upload", "uploaded"),
        title: "3 · After You Send It",
        description: "The button changes to <b>Uploaded</b>, with an <b>eye</b> to see what you sent.",
        side: "left",
        whenMissing: "Shown on payments you've already sent proof for.",
        fallback: anchor("payments-upcoming"),
      },
      {
        id: "pg-pending",
        element: anchorWithStatus("payment-proof-modal", "pending_review"),
        panels: [pendingProof],
        title: "3 · While It's Reviewed",
        description: "<b>Pending Review</b> means finance is checking it.",
        whenMissing: "Shown while a proof is being reviewed.",
        fallback: HISTORY,
      },
      {
        id: "pg-receipts",
        element: anchor("payment-proof-receipts"),
        panels: [pendingProof],
        title: "3 · Your Receipts",
        description: "Open or download the files you attached.",
        side: "top",
        whenMissing: "Shown inside a proof you've sent.",
        fallback: HISTORY,
      },
      {
        id: "pg-approved",
        element: anchorWithStatus("payment-proof-modal", "approved"),
        panels: [approvedProof],
        title: "4 · After Approval",
        description: "<b>Approved</b> means the payment is confirmed. It stays in your payment history.",
        whenMissing: "Shown once a proof is approved.",
        fallback: HISTORY,
      },
      {
        id: "pg-rejected",
        element: anchorWithStatus("payment-proof-modal", "rejected"),
        panels: [rejectedProof],
        title: "4 · If It's Rejected",
        description: "A <b>Rejected</b> proof shows finance's review notes, so you know what went wrong.",
        whenMissing: "Shown when a proof is rejected.",
        fallback: HISTORY,
      },
      {
        id: "pg-history",
        element: HISTORY,
        title: "4 · Payment History",
        description: "Every payment with its date, amount, tax, mode and status.",
        side: "top",
      },
    ]),

    // ── Invoices ────────────────────────────────────────────────────────
    {
      id: "pg-invoices",
      route: "/invoices",
      element: anchor("invoice-list"),
      panels: [unpaidInvoices],
      title: "5 · Unpaid Invoices",
      description: "You can also start from the invoice itself.",
      side: "top",
    },
    {
      id: "pg-preview",
      route: PREVIEW,
      element: anchor("invoice-preview-download"),
      title: "5 · The Invoice",
      description: "The full invoice with its items and payment stages. <b>Download</b> saves it.",
      side: "left",
      via: {
        fromRoute: "/invoices",
        panels: [unpaidInvoices],
        ...click(anchor("invoice-view"), "View an Invoice", "Click <b>View</b> on an unpaid invoice."),
      },
      whenMissing: NO_INVOICE,
      fallback: anchor("invoice-list"),
    },
    ...onPage({ route: PREVIEW, whenMissing: NO_INVOICE, fallback: anchor("invoice-list") }, [
      {
        id: "pg-remark",
        element: anchor("invoice-remark-modal"),
        panels: [remarkModal],
        title: "5 · Submit a Remark",
        description: "Something isn't right? Write it here to ask for a revision of the invoice.",
      },
      {
        id: "pg-proof",
        element: anchor("payment-proof-form"),
        panels: [invoiceProofForm],
        title: "5 · Submit Proof From Here",
        description: "The same payment proof form, for this invoice.",
      },
      {
        id: "pg-paid-badge",
        element: anchor("invoice-paid"),
        title: "5 · Once It's Paid",
        description: "A paid invoice shows <b>Paid</b>, and the remark and proof buttons are gone. You can still download it.",
        side: "left",
        whenMissing: "Shown on invoices that are paid.",
        fallback: anchor("invoice-preview-download"),
      },
    ]),
    {
      id: "pg-paid-list",
      route: "/invoices",
      element: anchor("invoice-list"),
      panels: [paidInvoices],
      title: "5 · Paid Invoices",
      description: "Settled invoices are kept here.",
      side: "top",
      via: {
        fromRoute: PREVIEW,
        openAnyway: true,
        ...click(anchor("invoice-back"), "Back to Invoices", "Click <b>Back</b> to return to your invoices."),
      },
    },
  ],
};
