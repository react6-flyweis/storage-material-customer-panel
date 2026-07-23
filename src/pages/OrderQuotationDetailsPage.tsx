import React, { useState } from "react";
import { ArrowLeft, Box } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOrderQuotationDetailsQuery,
  useApproveOrderQuotationMutation,
  useRejectOrderQuotationMutation,
} from "@/redux/api/quotationsApi";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "$0.00";
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatStatusLabel = (statusStr?: string) => {
  if (!statusStr) return "Pending Approval";
  const normalized = statusStr.toLowerCase();
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "Pending Approval";
};

const QuotationDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xs border border-[#E2E8F0] space-y-8 animate-pulse">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-4 h-16 bg-slate-200 rounded-sm" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 rounded-md" />
            <div className="h-4 w-64 bg-slate-200 rounded-md" />
            <div className="h-4 w-36 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="h-6 w-44 bg-slate-200 rounded-md" />
      </div>

      {/* Ribbon */}
      <div className="flex justify-end">
        <div className="h-12 w-64 bg-slate-200 rounded-lg" />
      </div>

      {/* Table Card */}
      <div className="border border-[#E2E8F0] rounded-2xl p-4 md:p-6 space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded-md" />
        <div className="space-y-3 pt-2">
          <div className="h-10 bg-slate-200 rounded-md" />
          <div className="h-8 bg-slate-100 rounded-md" />
          <div className="h-8 bg-slate-100 rounded-md" />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
        <div className="space-y-8">
          <div className="h-10 w-72 bg-slate-200 rounded-lg" />
          <div className="space-y-3">
            <div className="h-5 w-32 bg-slate-200 rounded-md" />
            <div className="h-6 w-56 bg-slate-200 rounded-md" />
            <div className="h-4 w-40 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="border border-[#E2E8F0] rounded-2xl p-5 md:p-6 space-y-4">
          <div className="h-6 w-36 bg-slate-200 rounded-md" />
          <div className="space-y-3 pt-2">
            <div className="h-4 bg-slate-200 rounded-md" />
            <div className="h-4 bg-slate-200 rounded-md" />
            <div className="h-4 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderQuotationDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const quotationId = id || "";

  const { data, isLoading, isError } = useGetOrderQuotationDetailsQuery(
    quotationId,
    { skip: !quotationId }
  );

  const [approveOrderQuotation, { isLoading: isApproving }] =
    useApproveOrderQuotationMutation();
  const [rejectOrderQuotation, { isLoading: isRejecting }] =
    useRejectOrderQuotationMutation();

  const isUpdating = isApproving || isRejecting;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const quotation = data?.quotation;

  const leadInfo =
    typeof quotation?.leadId === "object" && quotation?.leadId !== null
      ? quotation.leadId
      : null;

  const orderInfo =
    typeof quotation?.orderId === "object" && quotation?.orderId !== null
      ? quotation.orderId
      : null;

  const currentStatus = formatStatusLabel(quotation?.status);

  const handleApprove = async () => {
    if (!quotationId) return;
    try {
      await approveOrderQuotation(quotationId).unwrap();
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to approve quotation:", err);
    }
  };

  const handleRejectSubmit = async () => {
    if (!quotationId) return;
    try {
      await rejectOrderQuotation({
        quotationId,
        reason: rejectionReasonInput.trim() || undefined,
      }).unwrap();
      setRejectModalOpen(false);
    } catch (err) {
      console.error("Failed to reject quotation:", err);
    }
  };

  const lineItems = quotation?.lineItems || [];
  const paymentMethodsText = quotation?.paymentMethods?.length
    ? quotation.paymentMethods.join(", ")
    : "PayPal, Visa, Mastercard";

  // Calculate summary counts if not present in api summary object
  const totalCoilTypes =
    quotation?.summary?.totalCoilTypes ?? lineItems.length;
  const totalQuantity =
    quotation?.summary?.totalQuantity ??
    lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalLength =
    quotation?.summary?.totalLength ??
    lineItems.reduce(
      (acc, item) => acc + (item.lengthFeet || 0) * (item.quantity || 0),
      0
    );

  return (
    <div className="p-5">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#101828]">
              Quotation Details
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              View and manage all your order quotations approve, reject, and more.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-32 bg-slate-200 rounded-lg animate-pulse" />
          ) : currentStatus === "Approved" ? (
            <span className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-[#059669] text-white text-sm font-semibold shadow-xs">
              Approved
            </span>
          ) : currentStatus === "Rejected" ? (
            <span className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-[#EF4444] text-white text-sm font-semibold shadow-xs">
              Rejected
            </span>
          ) : (
            <>
              <Button
                disabled={isUpdating}
                onClick={() => setRejectModalOpen(true)}
                className="bg-[#EF4444] text-white hover:bg-[#dc2626]"
              >
                Reject
              </Button>
              <Button
                disabled={isUpdating}
                onClick={handleApprove}
                className="bg-[#10B981] text-white hover:bg-[#059669]"
              >
                {isUpdating ? "Approving..." : "Approve"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Quotation Document Card */}
      {isLoading ? (
        <QuotationDetailsSkeleton />
      ) : isError || !quotation ? (
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-10 shadow-xs border border-[#E2E8F0] text-center text-[#64748B]">
          Failed to load quotation details. Please try again.
        </div>
      ) : (
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xs border border-[#E2E8F0] relative space-y-8">
          {/* Header Information Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Company Brand Logo & Address */}
            <div className="flex items-start gap-4">
              <div className="w-4 h-16 bg-[#003B73] rounded-sm" />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1E293B] tracking-wide">
                  {quotation.sellerName || "STORAGE MATERIAL"}
                </h2>
                <p className="text-sm text-[#64748B] font-medium mt-0.5">
                  {quotation.sellerAddress || "San Francisco SA 65798, United States"}
                </p>
                <p className="text-sm text-[#64748B] font-medium">
                  {quotation.sellerEmail || "info@company.com"}
                </p>
              </div>
            </div>

            {/* Quotation Number */}
            <div className="text-left md:text-right">
              <p className="text-lg font-bold text-[#334155]">
                QUOTATION{" "}
                <span className="text-[#003B73] font-black">
                  {quotation.quotationNumber}
                </span>
              </p>
              {orderInfo?.requestId && (
                <p className="text-xs text-[#64748B] mt-1">
                  Request ID: <span className="font-semibold">{orderInfo.requestId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Total Value Ribbon / Banner */}
          <div className="relative flex justify-end">
            <div
              className="relative bg-[#1D4ED8] text-white pl-10 pr-6 py-3 flex items-center gap-3 text-xl md:text-2xl font-bold"
              style={{ clipPath: "polygon(36px 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <span>Total Value: {formatCurrency(quotation.totalValue)}</span>
            </div>
          </div>

          {/* Order List (Summary) Card */}
          <div className="border border-[#E2E8F0] rounded-2xl p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#003B73]">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#1E293B]">
                Order List (Summary)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#E2E8F0] text-[#334155] text-xs font-bold">
                    <th className="py-3 px-4 rounded-l-md">Coil Type</th>
                    <th className="py-3 px-4">Length</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4 rounded-r-md">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#334155]">
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        No line items found in this quotation.
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-bold">{item.coilType}</td>
                        <td className="py-3.5 px-4 font-bold">
                          {item.lengthFeet} ft
                        </td>
                        <td className="py-3.5 px-4 font-bold">{item.quantity}</td>
                        <td className="py-3.5 px-4 font-bold">{item.color}</td>
                        <td className="py-3.5 px-4 font-bold">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Method & Order Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
            {/* Left Column: Payment Method & Customer Details */}
            <div className="flex flex-col justify-between h-full min-h-70">
              <div className="inline-block self-start bg-[#E2E8F0] text-[#334155] px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold">
                Payment Method: {paymentMethodsText}
              </div>

              <div className="space-y-2 pt-8">
                <p className="text-base font-bold text-[#64748B]">
                  Building: {quotation.buildingLabel || "Building C"}
                </p>
                <p className="text-sm font-black text-[#334155] tracking-wide">
                  {leadInfo?.projectName
                    ? leadInfo.projectName.toUpperCase()
                    : "WAREHOUSE - TEXAS"}
                </p>
                <p className="text-xs text-[#64748B] font-medium pt-2">
                  Thank you for your Order!
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="border border-[#E2E8F0] rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#003B73]">
                <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-3.5 text-xs md:text-sm font-semibold text-[#475569] pt-1">
                <div className="flex items-center justify-between">
                  <span>Total Coil Type</span>
                  <span className="font-bold text-[#1E293B]">{totalCoilTypes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Length</span>
                  <span className="font-bold text-[#1E293B]">{totalLength} ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Quantity</span>
                  <span className="font-bold text-[#1E293B]">{totalQuantity}</span>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3 text-xs md:text-sm font-semibold text-[#475569]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#64748B]">
                    {formatCurrency(quotation.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="font-bold text-[#64748B]">
                    {formatCurrency(quotation.tax)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Freight</span>
                  <span className="font-bold text-[#64748B]">
                    {formatCurrency(quotation.freight)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold text-[#003B73]">
                  Total Order Value
                </span>
                <span className="text-sm md:text-base font-extrabold text-[#2563EB]">
                  {formatCurrency(quotation.totalValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Reject Order Quotation
            </h3>
            <p className="text-xs text-gray-600">
              Please provide a reason for rejecting this quotation (optional):
            </p>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setRejectModalOpen(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                disabled={isUpdating}
                onClick={handleRejectSubmit}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isUpdating ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Approval Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] p-8 md:p-10 max-w-md w-full text-center shadow-2xl space-y-6 transform transition-all animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#101828] leading-tight tracking-tight">
                Quotation Approved<br />Submitted Successfully
              </h2>
              <p className="text-sm md:text-base text-[#667085] font-semibold pt-1">
                Production Will start soon
              </p>
            </div>

            {/* 3D Green Checkmark Icon */}
            <div className="flex justify-center py-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg
                  className="w-24 h-24 drop-shadow-md"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="60" cy="62" r="48" fill="#15803D" opacity="0.2" />
                  <circle cx="60" cy="60" r="48" fill="url(#circleGradient)" />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    stroke="white"
                    strokeOpacity="0.4"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M40 60L54 74L82 46"
                    stroke="#166534"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 58L54 72L82 44"
                    stroke="#22C55E"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 56L54 70L82 42"
                    stroke="#86EFAC"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="circleGradient"
                      x1="20"
                      y1="12"
                      x2="100"
                      y2="108"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#A3E635" />
                      <stop offset="0.4" stopColor="#4ADE80" />
                      <stop offset="1" stopColor="#16A34A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Ok Button */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-52"
              >
                Ok
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderQuotationDetailsPage;
