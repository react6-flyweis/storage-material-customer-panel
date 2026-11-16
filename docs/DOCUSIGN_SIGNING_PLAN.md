# DocuSign Contract Signing — Customer Panel Implementation Plan & UX Guide

**Target Application:** Customer Panel (`storage-material-customer-panel`)  
**Audience:** Frontend Engineers, Product Managers, UI/UX Designers  
**Status:** Product & Technical Specification  
**Document Date:** November 2026  

---

## 1. Overview & Purpose

DocuSign contract signing replaces offline manual paper contract uploads with secure, legally compliant e-signatures. In this ecosystem:
* The document being signed is the **Fabrication & Supply Agreement** (generated from the approved estimate and project scope).
* The **Sales Panel** triggers the contract envelope and tracks real-time progress.
* The **Customer Panel** provides the client-facing touchpoints: notifying the customer, offering a 1-click signing link, and storing the completed signed PDF in the customer document vault.

---

## 2. Signing UX Strategy (v1: Direct Recipient View Redirect)

DocuSign supports email signing and embedded signing. For the Customer Panel v1, we implement **Smart Redirect Signing (Recipient View URL)**:

```
Customer sees "Action Required" in Customer Panel
                     │
                     ▼
Customer clicks [ Review & Sign on DocuSign ↗ ]
                     │
                     ▼
Frontend requests DocuSign Recipient View URL from Backend
                     │
                     ▼
Secure DocuSign signing ceremony opens in new tab (or redirect)
                     │
Customer reviews contract & completes electronic signature
                     │
                     ▼
DocuSign auto-redirects back to Customer Panel:
/my_projects/:projectId?signing_complete=true
                     │
                     ▼
Customer Panel displays Success Modal + updates status to "Signed"
```

### Why this approach is optimal:
1. **Zero iframe session or cookie bugs:** Avoids third-party cookie blocking in Safari, Chrome, and iOS WebKit.
2. **Full Mobile Optimization:** DocuSign's responsive signing UI works seamlessly on smartphones and tablets.
3. **Legal Compliance:** Eliminates the legal risks and maintenance overhead of drawing custom signature pads.

---

## 3. Customer Panel UI Touchpoints

### Touchpoint 1: Dashboard "Action Required" Banner
* **Files:** `src/pages/Dashboard.tsx` & `src/components/dashbord/ActiveProjectsOverview.tsx`
* **Trigger:** When any active project has an envelope with `status === 'sent'` or `'viewed'`.
* **Visual Specification:**
  * High-visibility card with amber/blue border placed at the top of the dashboard.
  * **Title:** *Action Required: Review & Sign Agreement*
  * **Body:** *Your Fabrication & Supply Agreement for project [Project Name] is ready. Please sign electronically to proceed to engineering and production.*
  * **Primary CTA:** `[ Review & Sign on DocuSign ↗ ]` (Primary blue button).
  * **Secondary Link:** `Check Email for DocuSign link`.

---

### Touchpoint 2: Project Details Page (`src/pages/ProjectDetailsPage.tsx`)
* **Header / Top Notification Banner:**
  * When `status === 'sent'` or `'viewed'`:
    * Persistent banner: *"Agreement sent to [email] on [Date]. Awaiting your electronic signature."*
    * Quick action: `[ Sign Now on DocuSign ↗ ]`.
* **Quotation Tab (`src/components/my_projects/ProjectQuotation.tsx`):**
  * When quote is approved: Update the bottom action section from "Approved" to indicate: *"Quote Approved — Next step: Fabrication & Supply Agreement signature."*
* **When Contract is Signed (`status === 'completed'`):**
  * Banner turns green: `✓ Fabrication & Supply Agreement Signed on [Date]`.
  * Action: `[ Download Signed PDF ]`.

---

### Touchpoint 3: Documents Vault (`src/components/drawings_and_documents/ProjectsDocumentList.tsx`)
* Under the **Agreement & Contract** category (`/documents`):
  * **State A: Awaiting Signature (`sent` / `viewed`):**
    * Document Name: `Fabrication & Supply Agreement`
    * Status Badge: `Signature Pending` (Amber badge).
    * Action Button: Replace generic eye icon with prominent `[ Sign Now ↗ ]` button.
  * **State B: Signed (`completed`):**
    * Document Name: `Fabrication & Supply Agreement (Signed)`
    * Status Badge: `Signed` (Emerald green badge).
    * Action Button: Standard Download icon (`ArrowDown`) + Preview icon (`Eye`).

---

### Touchpoint 4: Lifecycle Modal (`src/components/my_projects/LeadsDetailsModal.tsx`)
Update lines 184–202 from hardcoded text to dynamic status:
* If contract is signed: Display green checkmark icon, `"Signed Contract/Agreement"`, and completion date.
* If contract is out for signature: Display blue pen icon, `"Awaiting Signature"`, with a direct `[ Sign Now ↗ ]` button.

---

## 4. Redux & API Integration Layer (`src/redux/api/projectsApi.ts`)

Add the following RTK Query endpoints to `projectsApi.ts`:

```typescript
export interface ProjectAgreementResponse {
  success: boolean;
  message: string;
  data: {
    projectName: string;
    jobId: string;
    status: "not_sent" | "sent" | "viewed" | "completed" | "declined" | "voided";
    signedPdfUrl?: string;
    signedAt?: string;
    envelope?: {
      envelopeId: string;
      sentAt: string;
      signerEmail: string;
      lastViewedAt?: string;
    };
  };
}

export interface DocuSignRecipientUrlResponse {
  success: boolean;
  data: {
    signingUrl: string;
  };
}

// Add to projectsApi endpoints:
getProjectAgreement: builder.query<ProjectAgreementResponse, string>({
  query: (leadId) => `/api/customer/projects/${leadId}/agreement`,
  providesTags: (result, error, leadId) => [{ type: "Projects", id: `agreement-${leadId}` }],
}),

getDocuSignRecipientUrl: builder.mutation<
  DocuSignRecipientUrlResponse,
  { leadId: string; returnUrl: string }
>({
  query: ({ leadId, returnUrl }) => ({
    url: `/api/customer/projects/${leadId}/docusign/recipient-url`,
    method: "POST",
    body: { returnUrl },
  }),
}),
```

---

## 5. Post-Signing Redirect & Success Dialog

1. When the customer finishes signing on DocuSign, DocuSign redirects to:
   ```
   https://customer.thesteel.com/my_projects/:projectId?signing_complete=true
   ```
2. In `ProjectDetailsPage.tsx`:
   * Check for `signing_complete=true` in the URL search params.
   * Trigger the existing `<SuccessModal />`:
     * **Title:** *"Agreement Signed Successfully!"*
     * **Subtitle:** *"Thank you for signing the Fabrication & Supply Agreement. Your project has moved to the next production stage."*
   * Clean the URL parameter with `window.history.replaceState`.
   * Automatically invalidate `getProjectAgreement` and project detail queries so the UI reflects the signed status immediately.

---

## 6. Implementation Checklist & Timeline

| Step | Component / Location | Description |
| :--- | :--- | :--- |
| **Step 1** | `src/redux/api/projectsApi.ts` | Add agreement query and recipient URL mutation. |
| **Step 2** | `src/pages/Dashboard.tsx` | Render the "Action Required" Hero Banner when signature is pending. |
| **Step 3** | `src/pages/ProjectDetailsPage.tsx` | Add status banner and handle `?signing_complete=true` success dialog. |
| **Step 4** | `src/components/drawings_and_documents/ProjectsDocumentList.tsx` | Show dynamic "Signature Pending" badge and "Sign Now" CTA in document list. |
| **Step 5** | `src/components/my_projects/LeadsDetailsModal.tsx` | Make the contract card reflect real-time signature status. |
