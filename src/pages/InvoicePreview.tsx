

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, MoveLeft, Wallet, FileText } from "lucide-react";
import invoicePlaceholder from "../assets/Invoice_placeholder.png";
import PaymentModal from "./payments_and_invoices/PaymentModal";
import SendRemarksModal from "./payments_and_invoices/SendRemarksModal";
import { useState } from "react";
import { useGetInvoiceDetailQuery } from "@/redux/api/paymentsApi";
import InvoiceTemplate from "@/components/invoice/InvoiceTemplate";

export default function InvoicePreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);

  // Extract ID from query params or navigation state
  const searchParams = new URLSearchParams(location.search);
  const invoiceId = searchParams.get("id") || location.state?.id;

  // Retrieve single invoice details from API
  const { data: invoiceDetail, isLoading, isError } = useGetInvoiceDetailQuery(
    invoiceId || "",
    { skip: !invoiceId }
  );

  const apiInvoice = invoiceDetail?.invoice;
  const apiPaymentSchedule = invoiceDetail?.paymentSchedule;

  if (isLoading) {
    return (
      <div className="space-y-6 px-2 pb-10 pt-3 md:px-5 md:pt-5">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            className="min-w-[120px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white border-0"
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm font-medium">
          Loading invoice details...
        </div>
      </div>
    );
  }

  if (isError || !apiInvoice) {
    return (
      <div className="space-y-6 px-2 pb-10 pt-3 md:px-5 md:pt-5">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            className="min-w-[120px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white border-0"
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm font-medium">
          Failed to load invoice details.
        </div>
      </div>
    );
  }

  const resolvedInvoice = {
    invoiceNumber: apiInvoice.invoiceNumber,
    date: apiInvoice.date,
    daysToPay: apiInvoice.daysToPay,
    subtotal: apiInvoice.subtotal,
    taxAmount: apiInvoice.lineItems?.reduce((acc, curr) => acc + (curr.tax || 0), 0) || 0,
    total: apiInvoice.totalAmount,
    discount: apiInvoice.discount,
    depositAmount: apiInvoice.depositAmount,
    items: apiInvoice.lineItems?.map((li) => ({
      id: li._id,
      description: li.items?.join(", ") || "Project Item",
      rate: li.rate || 0,
      quantity: li.quantity || 1,
      images: li.images,
      total: li.total,
    })) || [],
    stages: apiPaymentSchedule?.stages || [],
  };

  const isPaid = apiInvoice.status?.toLowerCase() === "paid";

  return (
    <div className="space-y-6 px-2 pb-10 pt-3 md:px-5 md:pt-5">
      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="outline"
          className="min-w-[120px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white border-0"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-3">
          {isPaid ? (
            <Button
              className="bg-emerald-600 hover:bg-emerald-600 text-white cursor-default"
            >
              Paid
            </Button>
          ) : null}

          <Button
            asChild
            className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          >
            <a href={invoicePlaceholder} download>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>

          {!isPaid && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRemarkModalOpen(true)}
              >
                <FileText className="h-4 w-4" />
                Submit Remark
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                <Wallet className="h-4 w-4" />
                Payments
              </Button>
            </>
          )}
        </div>
      </div>

      <SendRemarksModal
        isOpen={isRemarkModalOpen}
        onClose={() => setIsRemarkModalOpen(false)}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <InvoiceTemplate
        invoiceNumber={resolvedInvoice.invoiceNumber}
        date={resolvedInvoice.date}
        daysToPay={resolvedInvoice.daysToPay}
        subtotal={resolvedInvoice.subtotal}
        taxAmount={resolvedInvoice.taxAmount}
        total={resolvedInvoice.total}
        discount={resolvedInvoice.discount}
        depositAmount={resolvedInvoice.depositAmount}
        items={resolvedInvoice.items}
        stages={resolvedInvoice.stages}
      />
    </div>
  );
}
