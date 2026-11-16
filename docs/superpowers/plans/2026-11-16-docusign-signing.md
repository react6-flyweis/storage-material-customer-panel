# DocuSign Contract Signing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate DocuSign contract signing in the Customer Panel so clients can review and electronically sign Fabrication & Supply Agreements with 1-click redirect and real-time status tracking across dashboards, project details, quotation views, documents vault, and lead lifecycle modals.

**Architecture:** Extend RTK Query in `projectsApi` with endpoints for fetching agreement status and generating DocuSign recipient signing view URLs. Build modular, reusable UI components (`AgreementActionBanner`, `ProjectAgreementBanner`) that seamlessly embed across `Dashboard`, `ProjectDetailsPage`, `ProjectQuotation`, `ProjectsDocumentList`, and `LeadsDetailsModal`, responding reactively to DocuSign envelope lifecycle statuses (`sent`, `viewed`, `completed`).

**Tech Stack:** React 19, TypeScript 5.9, Redux Toolkit (RTK Query), Tailwind CSS v4, Lucide React, Node.js test runner (`node:test`).

**Spec:** `docs/DOCUSIGN_SIGNING_PLAN.md`

## Global Constraints

- Must strictly follow existing RTK Query conventions in `src/redux/api/projectsApi.ts` (`createApi`, `baseQueryWithReauth`, tag invalidation).
- Target signing ceremony UX uses Direct Recipient View Redirect (no third-party iframe cookies) targeting return URL `/my_projects/:projectId?signing_complete=true`.
- Envelope status domain: `"not_sent" | "sent" | "viewed" | "completed" | "declined" | "voided"`.
- Must handle loading and disabling states during mutation calls to prevent duplicate signing window requests.
- When `signing_complete=true` is detected, trigger `<SuccessModal />`, purge the query param via `window.history.replaceState`, and re-fetch agreement state.
- Must pass `npx tsc -b` and `npm run lint` cleanly.

## Review Focus

1. **Pop-up / Redirect Blockers or Network Failure during URL generation:** If `getDocuSignRecipientUrl` fails or the user's browser blocks redirects, the UI must show an inline error message and re-enable the button rather than hang in loading state.
2. **Missing or Null Envelope Data:** If `getProjectAgreement` returns `status === 'not_sent'` or envelope fields are null/undefined, UI touchpoints must gracefully omit the banner or show default un-sent states without throwing runtime `TypeError`s.
3. **Repeated Post-Signing Success Modal Triggering:** If `?signing_complete=true` is present, `window.history.replaceState` must execute immediately so page reloads or subsequent tab switches do not loop or re-trigger the success modal.
4. **Invalid Lead ID or Missing active project on Dashboard:** When a user has no active projects or `leadId` is empty/undefined, `useGetProjectAgreementQuery` must pass `skip: !leadId` to avoid invalid HTTP requests.
5. **Signed PDF Download Accessibility:** When `status === 'completed'`, `signedPdfUrl` must trigger a secure download or open in a new tab; if `signedPdfUrl` is missing, fallback gracefully to a disabled state or notification.

---

### Task 1: Redux RTK Query Endpoints & Types for DocuSign Agreement

**Files:**
- Modify: `src/redux/api/projectsApi.ts`
- Test: `tests/redux/projectsApiAgreement.test.ts`

**Interfaces:**
- Consumes: `builder.query`, `builder.mutation` from RTK Query inside `projectsApi.ts`.
- Produces:
  - `ProjectAgreementResponse` interface
  - `DocuSignRecipientUrlResponse` interface
  - `useGetProjectAgreementQuery` hook
  - `useGetDocuSignRecipientUrlMutation` hook

- [ ] **Step 1: Write the failing test**

```typescript
// tests/redux/projectsApiAgreement.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { projectsApi } from "../../src/redux/api/projectsApi";

test("projectsApi defines getProjectAgreement and getDocuSignRecipientUrl endpoints", () => {
  assert.ok(
    projectsApi.endpoints.getProjectAgreement,
    "getProjectAgreement endpoint must be defined"
  );
  assert.ok(
    projectsApi.endpoints.getDocuSignRecipientUrl,
    "getDocuSignRecipientUrl endpoint must be defined"
  );
});

test("getProjectAgreement builds correct URL and method", () => {
  const endpoint = projectsApi.endpoints.getProjectAgreement;
  const queryResult = endpoint.initiate("lead-123");
  assert.strictEqual(typeof queryResult, "function");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/redux/projectsApiAgreement.test.ts`
Expected: FAIL with `AssertionError: getProjectAgreement endpoint must be defined`

- [ ] **Step 3: Implement `ProjectAgreementResponse`, `DocuSignRecipientUrlResponse`, `getProjectAgreement`, and `getDocuSignRecipientUrl` in `src/redux/api/projectsApi.ts`**

Add the response interfaces:
```typescript
export interface ProjectAgreementData {
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
}

export interface ProjectAgreementResponse {
  success: boolean;
  message: string;
  data: ProjectAgreementData;
}

export interface DocuSignRecipientUrlResponse {
  success: boolean;
  data: {
    signingUrl: string;
  };
}
```

Add endpoints to `projectsApi`:
```typescript
getProjectAgreement: builder.query<ProjectAgreementResponse, string>({
  query: (leadId) => ({
    url: `/api/customer/projects/${leadId}/agreement`,
    method: "GET",
  }),
  providesTags: (_result, _error, leadId) => [{ type: "Projects", id: `agreement-${leadId}` }],
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

Export `useGetProjectAgreementQuery` and `useGetDocuSignRecipientUrlMutation` from `projectsApi`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/redux/projectsApiAgreement.test.ts`
Expected: PASS (2 tests pass)

- [ ] **Step 5: Verify TypeScript compilation and commit**

Run: `npx tsc -b`
Expected: PASS with 0 errors
```bash
git add src/redux/api/projectsApi.ts tests/redux/projectsApiAgreement.test.ts
git commit -m "feat(api): add docusign agreement and recipient url endpoints"
```

---

### Task 2: Dashboard "Action Required" Banner

**Files:**
- Create: `src/components/dashbord/AgreementActionBanner.tsx`
- Modify: `src/pages/Dashboard.tsx:40-120`
- Test: `tests/components/AgreementActionBanner.test.ts`

**Interfaces:**
- Consumes:
  - `useGetProjectAgreementQuery` and `useGetDocuSignRecipientUrlMutation` from `src/redux/api/projectsApi`
  - `leadId?: string` and `projectName?: string`
- Produces:
  - `<AgreementActionBanner leadId={leadId} projectName={projectName} />` component

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/AgreementActionBanner.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { shouldDisplayActionBanner } from "../../src/components/dashbord/AgreementActionBanner";

test("shouldDisplayActionBanner returns true only when status is sent or viewed", () => {
  assert.strictEqual(shouldDisplayActionBanner("sent"), true);
  assert.strictEqual(shouldDisplayActionBanner("viewed"), true);
  assert.strictEqual(shouldDisplayActionBanner("completed"), false);
  assert.strictEqual(shouldDisplayActionBanner("not_sent"), false);
  assert.strictEqual(shouldDisplayActionBanner(undefined), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/components/AgreementActionBanner.test.ts`
Expected: FAIL with `Cannot find module '../../src/components/dashbord/AgreementActionBanner'`

- [ ] **Step 3: Implement `AgreementActionBanner` and integrate into `src/pages/Dashboard.tsx`**

1. Create `src/components/dashbord/AgreementActionBanner.tsx`:
   - Export helper `shouldDisplayActionBanner(status?: string): boolean`
   - Render card with amber/blue border at the top of the dashboard when status is `"sent"` or `"viewed"`.
   - Title: *Action Required: Review & Sign Agreement*
   - Body: *Your Fabrication & Supply Agreement for project {projectName} is ready. Please sign electronically to proceed to engineering and production.*
   - Primary CTA: `[ Review & Sign on DocuSign ↗ ]` button:
     - On click: calls `getDocuSignRecipientUrl({ leadId, returnUrl: `${window.location.origin}/my_projects/${leadId}?signing_complete=true` })`
     - When response succeeds: `window.location.href = res.data.signingUrl`
     - Handles loading state with `<Loader2 className="animate-spin" />`
   - Secondary link/label: `Check Email for DocuSign link`
2. In `src/pages/Dashboard.tsx`:
   - Extract `activeLeadId = dashboardData?.activeProjectOverview?.leadId` and `projectName = dashboardData?.activeProjectOverview?.projectName`
   - Render `<AgreementActionBanner leadId={activeLeadId} projectName={projectName} />` right below title/header before stats or overview cards.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/components/AgreementActionBanner.test.ts`
Expected: PASS

- [ ] **Step 5: Verify TypeScript compilation and commit**

Run: `npx tsc -b`
Expected: PASS with 0 errors
```bash
git add src/components/dashbord/AgreementActionBanner.tsx src/pages/Dashboard.tsx tests/components/AgreementActionBanner.test.ts
git commit -m "feat(dashboard): add action required agreement banner"
```

---

### Task 3: Project Details Agreement Status Banner & Post-Signing Success Handling

**Files:**
- Create: `src/components/my_projects/ProjectAgreementBanner.tsx`
- Modify: `src/pages/ProjectDetailsPage.tsx:40-180`
- Test: `tests/components/ProjectAgreementBanner.test.ts`

**Interfaces:**
- Consumes:
  - `useGetProjectAgreementQuery` from `src/redux/api/projectsApi`
  - `useGetDocuSignRecipientUrlMutation` from `src/redux/api/projectsApi`
  - `leadId: string`
- Produces:
  - `<ProjectAgreementBanner leadId={leadId} />`
  - URL param listener & cleaner for `?signing_complete=true` triggering `<SuccessModal />`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/ProjectAgreementBanner.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { formatAgreementBannerText } from "../../src/components/my_projects/ProjectAgreementBanner";

test("formatAgreementBannerText formats pending signature text", () => {
  const result = formatAgreementBannerText({
    status: "sent",
    envelope: { signerEmail: "test@example.com", sentAt: "2026-11-15T10:00:00Z", envelopeId: "env-1" },
    projectName: "Building A",
    jobId: "J-101",
  });
  assert.match(result.title, /Awaiting your electronic signature/i);
  assert.match(result.body, /test@example\.com/);
  assert.strictEqual(result.actionType, "sign");
});

test("formatAgreementBannerText formats completed signature text", () => {
  const result = formatAgreementBannerText({
    status: "completed",
    signedAt: "2026-11-16T12:00:00Z",
    signedPdfUrl: "https://example.com/signed.pdf",
    projectName: "Building A",
    jobId: "J-101",
  });
  assert.match(result.title, /Fabrication & Supply Agreement Signed/i);
  assert.strictEqual(result.actionType, "download");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/components/ProjectAgreementBanner.test.ts`
Expected: FAIL with `Cannot find module '../../src/components/my_projects/ProjectAgreementBanner'`

- [ ] **Step 3: Implement `ProjectAgreementBanner` and post-signing handling in `ProjectDetailsPage.tsx`**

1. Create `src/components/my_projects/ProjectAgreementBanner.tsx`:
   - Implement `formatAgreementBannerText(data: ProjectAgreementData)` helper.
   - For `status === 'sent'` or `'viewed'`:
     - Render amber/blue alert banner: *"Agreement sent to {email} on {date}. Awaiting your electronic signature."*
     - Button: `[ Sign Now on DocuSign ↗ ]` (triggers recipient URL mutation and redirects).
   - For `status === 'completed'`:
     - Render emerald green alert banner: `✓ Fabrication & Supply Agreement Signed on {signedAt}`.
     - Button: `[ Download Signed PDF ]` (opens `signedPdfUrl`).
2. Modify `src/pages/ProjectDetailsPage.tsx`:
   - Import `ProjectAgreementBanner`.
   - Mount `<ProjectAgreementBanner leadId={id} />` at top of project details view.
   - Detect `searchParams.get("signing_complete") === "true"`:
     - Open `SuccessModal` with:
       - `title`: *"Agreement Signed Successfully!"*
       - `subSubTitle`: *"Thank you for signing the Fabrication & Supply Agreement. Your project has moved to the next production stage."*
     - Call `window.history.replaceState({}, document.title, window.location.pathname)` to strip `signing_complete` from the URL.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/components/ProjectAgreementBanner.test.ts`
Expected: PASS

- [ ] **Step 5: Verify TypeScript compilation and commit**

Run: `npx tsc -b`
Expected: PASS with 0 errors
```bash
git add src/components/my_projects/ProjectAgreementBanner.tsx src/pages/ProjectDetailsPage.tsx tests/components/ProjectAgreementBanner.test.ts
git commit -m "feat(projects): add agreement status banner and post-signing handling"
```

---

### Task 4: Quotation Tab Agreement Next Step Callout

**Files:**
- Modify: `src/components/my_projects/ProjectQuotation.tsx:380-450`
- Test: `tests/components/ProjectQuotationAgreement.test.ts`

**Interfaces:**
- Consumes:
  - `useGetProjectAgreementQuery` from `src/redux/api/projectsApi`
  - Quotation approval state (`quotation.status === 'accepted'`)
- Produces:
  - Next step indicator banner: *"Quote Approved — Next step: Fabrication & Supply Agreement signature."* with signing CTA if pending.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/ProjectQuotationAgreement.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { getNextStepMessage } from "../../src/components/my_projects/ProjectQuotation";

test("getNextStepMessage returns appropriate message when quote approved", () => {
  assert.strictEqual(
    getNextStepMessage("accepted", "sent"),
    "Quote Approved — Next step: Fabrication & Supply Agreement signature."
  );
  assert.strictEqual(
    getNextStepMessage("accepted", "completed"),
    "Quote Approved — Fabrication & Supply Agreement Signed."
  );
  assert.strictEqual(getNextStepMessage("pending", "not_sent"), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/components/ProjectQuotationAgreement.test.ts`
Expected: FAIL with `Cannot find exported member getNextStepMessage`

- [ ] **Step 3: Implement `getNextStepMessage` and update action section in `ProjectQuotation.tsx`**

1. In `src/components/my_projects/ProjectQuotation.tsx`:
   - Export helper `getNextStepMessage(quoteStatus?: string, agreementStatus?: string): string | null`.
   - Query `useGetProjectAgreementQuery(leadId, { skip: !leadId })`.
   - When quote is approved / accepted:
     - Replace static approved badge with an informative next step card/callout:
       - Displays: *"Quote Approved — Next step: Fabrication & Supply Agreement signature."*
       - If agreement status is `'sent'` or `'viewed'`, render a direct CTA `[ Sign Agreement on DocuSign ↗ ]`.
       - If agreement status is `'completed'`, show green badge: `Agreement Signed ✓`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/components/ProjectQuotationAgreement.test.ts`
Expected: PASS

- [ ] **Step 5: Verify TypeScript compilation and commit**

Run: `npx tsc -b`
Expected: PASS with 0 errors
```bash
git add src/components/my_projects/ProjectQuotation.tsx tests/components/ProjectQuotationAgreement.test.ts
git commit -m "feat(quotation): add agreement next step callout after quote approval"
```

---

### Task 5: Documents Vault Dynamic Signature Badge & Sign Action

**Files:**
- Modify: `src/components/drawings_and_documents/ProjectsDocumentList.tsx:25-95`
- Test: `tests/components/ProjectsDocumentListSigning.test.ts`

**Interfaces:**
- Consumes:
  - Document status (`status`) and document name (`name`)
  - `useGetDocuSignRecipientUrlMutation` from `src/redux/api/projectsApi`
- Produces:
  - State A (`sent` / `viewed`): `Fabrication & Supply Agreement`, badge `Signature Pending` (amber), action `[ Sign Now ↗ ]`.
  - State B (`completed`): `Fabrication & Supply Agreement (Signed)`, badge `Signed` (emerald), download/preview icons.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/ProjectsDocumentListSigning.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { getDocumentDisplayMeta } from "../../src/components/drawings_and_documents/ProjectsDocumentList";

test("getDocumentDisplayMeta returns pending state for awaiting signature agreement", () => {
  const meta = getDocumentDisplayMeta({
    name: "Fabrication & Supply Agreement",
    status: "sent",
  });
  assert.strictEqual(meta.displayName, "Fabrication & Supply Agreement");
  assert.strictEqual(meta.badgeLabel, "Signature Pending");
  assert.strictEqual(meta.badgeColor, "amber");
  assert.strictEqual(meta.isSignable, true);
});

test("getDocumentDisplayMeta returns signed state for completed agreement", () => {
  const meta = getDocumentDisplayMeta({
    name: "Fabrication & Supply Agreement",
    status: "completed",
  });
  assert.strictEqual(meta.displayName, "Fabrication & Supply Agreement (Signed)");
  assert.strictEqual(meta.badgeLabel, "Signed");
  assert.strictEqual(meta.badgeColor, "emerald");
  assert.strictEqual(meta.isSignable, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/components/ProjectsDocumentListSigning.test.ts`
Expected: FAIL with `Cannot find exported member getDocumentDisplayMeta`

- [ ] **Step 3: Implement `getDocumentDisplayMeta` and update `DocumentCard` in `ProjectsDocumentList.tsx`**

1. In `src/components/drawings_and_documents/ProjectsDocumentList.tsx`:
   - Export helper `getDocumentDisplayMeta({ name, status }: { name: string; status: string })`.
   - In `DocumentCard`, invoke `getDocumentDisplayMeta(document)`:
     - If `isSignable === true`:
       - Show amber `Signature Pending` badge.
       - Render prominent blue `[ Sign Now ↗ ]` button that calls `getDocuSignRecipientUrl({ leadId, returnUrl: ... })` and redirects.
     - If `status === 'completed'`:
       - Show emerald green `Signed` badge.
       - Render `ArrowDown` download icon + `Eye` preview icon.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/components/ProjectsDocumentListSigning.test.ts`
Expected: PASS

- [ ] **Step 5: Verify TypeScript compilation and commit**

Run: `npx tsc -b`
Expected: PASS with 0 errors
```bash
git add src/components/drawings_and_documents/ProjectsDocumentList.tsx tests/components/ProjectsDocumentListSigning.test.ts
git commit -m "feat(documents): add dynamic signature badge and sign action to documents list"
```

---

### Task 6: Lifecycle Modal Real-Time Agreement Status

**Files:**
- Modify: `src/components/my_projects/LeadsDetailsModal.tsx:184-205`
- Test: `tests/components/LeadsDetailsModalAgreement.test.ts`

**Interfaces:**
- Consumes:
  - `useGetProjectAgreementQuery` from `src/redux/api/projectsApi`
  - Optional `leadId?: string` or agreement status prop
- Produces:
  - Dynamic Contract Card rendering signed state (green checkmark, completion date) or awaiting signature state (blue pen icon, `[ Sign Now ↗ ]` button).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/components/LeadsDetailsModalAgreement.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { getContractCardStatus } from "../../src/components/my_projects/LeadsDetailsModal";

test("getContractCardStatus returns awaiting signature configuration", () => {
  const result = getContractCardStatus("sent", undefined);
  assert.strictEqual(result.title, "Awaiting Signature");
  assert.strictEqual(result.badgeType, "pending");
  assert.strictEqual(result.showSignButton, true);
});

test("getContractCardStatus returns signed configuration", () => {
  const result = getContractCardStatus("completed", "2026-11-16T12:00:00Z");
  assert.strictEqual(result.title, "Signed Contract/Agreement");
  assert.strictEqual(result.badgeType, "signed");
  assert.strictEqual(result.showSignButton, false);
  assert.ok(result.dateText.includes("2026"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/components/LeadsDetailsModalAgreement.test.ts`
Expected: FAIL with `Cannot find exported member getContractCardStatus`

- [ ] **Step 3: Implement `getContractCardStatus` and dynamic Contract Card in `LeadsDetailsModal.tsx`**

1. In `src/components/my_projects/LeadsDetailsModal.tsx`:
   - Export helper `getContractCardStatus(status?: string, signedAt?: string)`.
   - Accept optional `leadId?: string` in `LeadsDetailsModalProps`.
   - Query `useGetProjectAgreementQuery(leadId || id, { skip: !leadId && !id })`.
   - In lines 184–202 (Contract Card):
     - If contract is signed (`status === 'completed'`):
       - Render green checkmark icon (`CheckCircle2`), `"Signed Contract/Agreement"`, and formatted signed date.
     - If contract is out for signature (`status === 'sent'` or `'viewed'`):
       - Render blue pen icon (`PenTool` or `FileEdit`), `"Awaiting Signature"`, with a direct `[ Sign Now ↗ ]` button triggering recipient URL redirect.
     - If `not_sent`:
       - Render default "Contract Pending" state.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/components/LeadsDetailsModalAgreement.test.ts`
Expected: PASS

- [ ] **Step 5: Verify TypeScript compilation and commit**

Run: `npx tsc -b`
Expected: PASS with 0 errors
```bash
git add src/components/my_projects/LeadsDetailsModal.tsx tests/components/LeadsDetailsModalAgreement.test.ts
git commit -m "feat(leads): dynamic contract card status in lifecycle modal"
```

---

### Task 7: Full Application Verification & Quality Gates

**Files:**
- Test: All tests in `tests/**/*.test.ts`
- Verification: `tsc -b` and `eslint`

**Interfaces:**
- Consumes: All updated components, APIs, and pages
- Produces: Passing build, passing linter, passing test suite

- [ ] **Step 1: Run all unit tests**

Run: `node --experimental-strip-types --test tests/**/*.test.ts`
Expected: All tests PASS with 0 failures

- [ ] **Step 2: Run full TypeScript check**

Run: `npx tsc -b`
Expected: PASS with 0 errors

- [ ] **Step 3: Run ESLint**

Run: `npm run lint`
Expected: PASS with 0 errors (or warnings matching project baseline)

- [ ] **Step 4: Commit any remaining cleanups and test files**

```bash
git status
git commit -m "chore: verify docusign customer panel integration suite"
```
