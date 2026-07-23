import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  // Download,
  Eye,
  Check,
  ClipboardList,
  DollarSign,
  Folder,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetProjectOrderDetailsQuery } from "@/redux/api/materialOrdersApi";

export interface DeliveryTableItem {
  coilType: string;
  length: string;
  quantity: number;
  color: string;
  sheetStatus: string;
  orderStatus: string;
  expectedDelivery: string;
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const formatShortDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "$0.00";
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ leadId?: string; orderId?: string }>();
  const [searchParams] = useSearchParams();

  const leadId = params.leadId || searchParams.get("leadId") || "";
  const orderId = params.orderId || searchParams.get("orderId") || "";

  const { data, isLoading } = useGetProjectOrderDetailsQuery(
    { leadId, orderId },
    { skip: !leadId || !orderId }
  );

  const [activeTab, setActiveTab] = useState<"Delivered" | "Pending">("Pending");

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded-xl" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-64 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
        </div>

        {/* Info Card Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs animate-pulse flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-3">
            <div className="h-6 w-36 bg-gray-200 rounded" />
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-20 w-56 bg-gray-200 rounded-2xl" />
        </div>

        {/* Stepper Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-8 shadow-xs animate-pulse">
          <div className="h-12 bg-gray-200 rounded-full max-w-3xl mx-auto" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs animate-pulse space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const order = data?.order;
  const quotation = data?.quotation;

  const displayOrderId = order?.requestId || order?._id || orderId || "CO-ORD-876";
  const buildingLabel = order?.buildingLabel || "Building";
  const projectCode = order?.leadId || leadId || "PRJ-2026-014";
  const orderDate = formatDate(order?.requestDate || order?.createdAt);
  const requiredDate = formatDate(order?.requiredBy);
  const createdBy =
    order?.createdByName ||
    (order?.requestedByCustomer
      ? `${order.requestedByCustomer.firstName} ${order.requestedByCustomer.lastName}`.trim()
      : "Customer");
  const orderStatus = order?.status || "Pending";
  const stage = order?.stage || "requested";

  const totalQuotationValue = quotation?.totalValue ?? order?.totalAmount ?? 0;

  // Determine stage progression
  const stageOrder = ["requested", "quote_receive", "quote_approve", "confirmed", "completed"];
  let currentStageIdx = stageOrder.indexOf((stage || "").toLowerCase());
  if (currentStageIdx === -1) {
    const statusNorm = (orderStatus || "").toLowerCase();
    if (statusNorm === "fulfilled" || statusNorm === "completed") {
      currentStageIdx = 4;
    } else {
      currentStageIdx = 0;
    }
  }

  const steps = [
    { id: "requested", label: "Requested", icon: FileText },
    { id: "quote_receive", label: "Quotation Receive", icon: FileText },
    { id: "quote_approve", label: "Quotation Approve", icon: Check },
    { id: "confirmed", label: "Order Confirmed", icon: ClipboardList },
    { id: "completed", label: "Completed", icon: Check },
  ].map((step, idx) => ({
    ...step,
    completed: idx <= currentStageIdx,
  }));

  // Build Delivered and Pending items list
  const rawRequested = order?.requestedItems || [];
  const rawDelivered = order?.deliveredItems || rawRequested.filter((item) => item.deliveryStatus === "delivered");
  const rawPending = order?.pendingItems || rawRequested.filter((item) => item.deliveryStatus !== "delivered");

  const mapItemToTable = (item: (typeof rawRequested)[0]): DeliveryTableItem => ({
    coilType: item.name || "Coil Material",
    length: item.lengthFeet ? `${item.lengthFeet} ft` : `${item.quantity} ${item.unit || "ft"}`,
    quantity: item.quantity,
    color: item.color || "-",
    sheetStatus: item.deliveryStatus === "delivered" ? "Completed" : "In Progress",
    orderStatus: item.deliveryStatus === "delivered" ? "Delivered" : "Pending",
    expectedDelivery: formatShortDate(item.deliveredAt || order?.requiredBy),
  });

  const deliveredItemsTable = rawDelivered.map(mapItemToTable);
  const pendingItemsTable = rawPending.map(mapItemToTable);

  const tableItems = activeTab === "Delivered" ? deliveredItemsTable : pendingItemsTable;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Top Bar with Back, Title & View Quotation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#101828]">Order Details</h1>
            <p className="text-xs text-[#667085] mt-0.5">
              View Complete information about this coil order
            </p>
          </div>
        </div>

        {quotation?._id && (
          <button
            onClick={() => navigate(`/order-quotation-details/${quotation._id}`)}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-xs cursor-pointer"
          >
            View Quotation
          </button>
        )}
      </div>

      {/* Header Info Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Order & Project Code */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#101828]">{displayOrderId}</h2>
          <p className="text-base font-bold text-[#2563EB]">{buildingLabel}</p>
          <p className="text-sm font-medium text-[#667085]">{projectCode}</p>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-16 bg-[#E4E7EC]" />

        {/* Middle Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {/* Order Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Order Date</p>
              <p className="text-sm font-bold text-[#101828]">{orderDate}</p>
            </div>
          </div>

          {/* Required Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Required Date</p>
              <p className="text-sm font-bold text-[#101828]">{requiredDate}</p>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Created by</p>
              <p className="text-sm font-bold text-[#101828]">{createdBy}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#667085]">Order Status</p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white capitalize ${orderStatus === "fulfilled" || orderStatus === "completed"
                ? "bg-[#22C55E]"
                : "bg-[#D97706]"
                }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {orderStatus}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-16 bg-[#E4E7EC]" />

        {/* Right Quotation Value Box */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center gap-3.5 min-w-[230px]">
          <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#2563EB]">Quotation Value</p>
            <p className="text-xl font-extrabold text-[#1E40AF]">
              {formatCurrency(totalQuotationValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Green Circle Progress Timeline Stepper */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-8 shadow-xs">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto">
          {/* Connector Line */}
          <div className="absolute left-8 right-8 top-6 h-0.5 bg-[#E5E7EB] z-0" />

          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${step.completed
                    ? "bg-[#16A34A] text-white shadow-sm"
                    : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`mt-3 text-xs md:text-sm font-bold max-w-25 leading-tight ${step.completed ? "text-[#101828]" : "text-[#6B7280]"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Delivery Table Section */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
        {/* Toggle Pills: Delivered / Pending */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
          <button
            onClick={() => setActiveTab("Delivered")}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "Delivered"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-transparent text-[#475467] hover:text-[#101828]"
              }`}
          >
            Delivered ({deliveredItemsTable.length})
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "Pending"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-transparent text-[#475467] hover:text-[#101828]"
              }`}
          >
            Pending ({pendingItemsTable.length})
          </button>
        </div>

        {/* Subheader Title */}
        <div className="flex items-center gap-2.5">
          <Folder className="w-5 h-5 text-[#D97706] fill-[#D97706]" />
          <h3 className="text-base font-bold text-[#101828]">
            {activeTab} Delivery
          </h3>
        </div>

        {/* Delivery Items Table */}
        <div className="overflow-x-auto">
          {tableItems.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#64748B]">
              No {activeTab.toLowerCase()} items found for this order.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold">
                  <th className="py-3 px-5 rounded-l-lg">Coil Type</th>
                  <th className="py-3 px-5">Length</th>
                  <th className="py-3 px-5">Quantity</th>
                  <th className="py-3 px-5">Color</th>
                  <th className="py-3 px-5">Sheet Status</th>
                  <th className="py-3 px-5">Order Status</th>
                  <th className="py-3 px-5 rounded-r-lg">Expected Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {tableItems.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {row.coilType}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {row.length}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {row.quantity}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {row.color}
                    </td>
                    <td className="py-4 px-5 font-semibold text-[#101828]">
                      {row.sheetStatus}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#D97706]">
                      {row.orderStatus}
                    </td>
                    <td className="py-4 px-5 font-semibold text-[#101828]">
                      {row.expectedDelivery}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bottom 3 Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Special Instruction */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2563EB] text-white">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">
              Special Instruction
            </h3>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed font-medium">
            {order?.specialInstructions ||
              "No special instructions provided for this order."}
          </p>
        </div>

        {/* Card 2: Attachments */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2563EB] text-white">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">Attachments</h3>
          </div>

          <div className="space-y-3">
            {(!order?.attachments || order.attachments.length === 0) ? (
              <p className="text-xs text-[#667085]">No attachments attached.</p>
            ) : (
              order.attachments.map((att, idx) => {
                const attName =
                  typeof att === "string" ? `Attachment ${idx + 1}` : att.name || `Attachment ${idx + 1}`;
                const attUrl = typeof att === "string" ? att : att.url || "#";
                const attSize = typeof att === "object" ? att.size || "PDF" : "PDF";

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E4E7EC] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 font-bold text-xs flex items-center justify-center">
                        PDF
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#101828]">{attName}</p>
                        <p className="text-[11px] text-[#667085]">{attSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#667085]">
                      {attUrl !== "#" && (
                        <a
                          href={attUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:text-[#101828] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 3: Order Value Summary */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#2563EB] text-white">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#101828]">
                Order Value Summary
              </h3>
            </div>

            <div className="space-y-3.5 pt-2 text-sm font-semibold">
              <div className="flex items-center justify-between text-[#667085]">
                <span>Subtotal</span>
                <span className="font-bold text-[#475467]">
                  {formatCurrency(quotation?.subtotal ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#667085]">
                <span>Tax</span>
                <span className="font-bold text-[#475467]">
                  {formatCurrency(quotation?.tax ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#667085]">
                <span>Freight</span>
                <span className="font-bold text-[#475467]">
                  {formatCurrency(quotation?.freight ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
            <span className="text-base font-extrabold text-[#1E40AF]">
              Total Order Value
            </span>
            <span className="text-lg font-extrabold text-[#2563EB]">
              {formatCurrency(quotation?.totalValue ?? order?.totalAmount ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
