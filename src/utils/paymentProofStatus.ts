interface PaymentWithProof {
  status?: string;
  paymentProof?: { status?: string } | null;
}

/** Review status of a payment's proof, falling back to the invoice's own status. */
export function getProofStatus(item: PaymentWithProof): string {
  const proofStatus = item.paymentProof?.status;
  const status = proofStatus && proofStatus !== "none" ? proofStatus : item.status;
  return (status || "pending_review").toLowerCase();
}
