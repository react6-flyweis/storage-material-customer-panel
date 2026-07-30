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
  Clock,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useGetProjectOrderDetailsQuery,
  type OrderDetailsRequestedItemApi,
  type OrderDetailsQuotationApi,
} from "@/redux/api/materialOrdersApi";
import NoQuotationModal from "@/components/modals/NoQuotationModal";
import {
  deriveOrderStage,
  getOrderStageBadgeConfig,
  getOrderStepperSteps,
} from "@/utils/orderStatusUtils";

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

  const [activeTab, setActiveTab] = useState<"Total" | "Delivered" | "Pending">("Total");
  const [showNoQuotationModal, setShowNoQuotationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  const quotationList: OrderDetailsQuotationApi[] = quotation ? [quotation] : [];

  const hasQuotations = quotationList.length > 0;

  const displayOrderId = order?.requestId || order?._id || orderId || "-";
  const buildingLabel = order?.buildingLabel || "-";
  const projectCode = order?.leadId || leadId || "-";
  const orderDate = formatDate(order?.requestDate || order?.createdAt);
  const requiredDate = formatDate(order?.requiredBy);
  const createdBy =
    order?.createdByName ||
    (order?.requestedByCustomer
      ? `${order.requestedByCustomer.firstName || ""} ${order.requestedByCustomer.lastName || ""}`.trim()
      : "") ||
    "-";
  const computedStage = deriveOrderStage(
    order?.status,
    order?.stage,
    quotation?.status,
    !!quotation
  );
  const badgeConfig = getOrderStageBadgeConfig(computedStage);
  const isCompletedStatus = computedStage === "completed";
  const isQuotationApproved =
    computedStage === "quotation_approved" ||
    computedStage === "order_confirmed" ||
    computedStage === "completed";

  const totalQuotationValue = quotation?.totalValue ?? order?.totalAmount ?? 0;

  const stepIcons: Record<string, React.ElementType> = {
    requested: Folder,
    quote_receive: FileText,
    quote_approve: Check,
    confirmed: ClipboardList,
    completed: Check,
  };

  const steps = getOrderStepperSteps(computedStage).map((step) => ({
    ...step,
    icon: stepIcons[step.id] || Folder,
  }));

  // Build items list
  const rawRequested = order?.requestedItems || [];
  const rawDelivered = order?.deliveredItems || rawRequested.filter((item) => item.deliveryStatus === "delivered");
  const rawPending = order?.pendingItems || rawRequested.filter((item) => item.deliveryStatus !== "delivered");

  const mapItemToTable = (item: OrderDetailsRequestedItemApi): DeliveryTableItem => ({
    coilType: item.name || "-",
    length: item.lengthFeet ? `${item.lengthFeet} ft` : item.quantity && item.unit ? `${item.quantity} ${item.unit}` : "-",
    quantity: item.quantity ?? 0,
    color: item.color || "-",
    sheetStatus: item.deliveryStatus === "delivered" ? "Completed" : "Production",
    orderStatus: item.deliveryStatus === "delivered" ? "Delivered" : "Pending",
    expectedDelivery: formatShortDate(item.deliveredAt || order?.requiredBy),
  });

  const deliveredItemsTable = rawDelivered.map(mapItemToTable);
  const pendingItemsTable = rawPending.map(mapItemToTable);
  const allItemsTable = rawRequested.map(mapItemToTable);

  const getFilteredItems = () => {
    if (activeTab === "Delivered") return deliveredItemsTable;
    if (activeTab === "Pending") return pendingItemsTable;
    return allItemsTable;
  };

  const handleViewQuotationClick = () => {
    if (quotation?._id) {
      navigate(`/order-quotation-details/${quotation._id}`);
    } else {
      setShowNoQuotationModal(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
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
              View Complete information about this coil order.
            </p>
          </div>
        </div>

        <button
          onClick={handleViewQuotationClick}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-xs cursor-pointer"
        >
          View Quotation
        </button>
      </div>

      {/* Header Info Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Order & Project Code */}
        <div className="space-y-1 pr-6 border-b lg:border-b-0 lg:border-r border-[#E4E7EC] pb-4 lg:pb-0 min-w-[200px]">
          <h2 className="text-xl font-bold text-[#101828]">{displayOrderId}</h2>
          <p className="text-base font-bold text-[#2563EB]">{buildingLabel}</p>
          <p className="text-sm font-medium text-[#667085]">{projectCode}</p>
        </div>

        {/* Middle Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 flex-1">
          {/* Order Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085] border border-gray-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Order Date</p>
              <p className="text-sm font-bold text-[#344054]">{orderDate}</p>
            </div>
          </div>

          {/* Required Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085] border border-gray-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Required Date</p>
              <p className="text-sm font-bold text-[#344054]">{requiredDate}</p>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085] border border-gray-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Created by</p>
              <p className="text-sm font-bold text-[#344054]">{createdBy}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#667085]">Order Status</p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${badgeConfig.badgeClass}`}
            >
              {badgeConfig.prefix ? (
                badgeConfig.prefix
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dotClass}`} />
              )}
              {badgeConfig.label}
            </span>
          </div>
        </div>

        {/* Right Section: Cancel Order for New Order stage / Quotation Value for other stages */}
        {computedStage === "new_order" ? (
          <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E4E7EC] lg:pl-6 flex items-center justify-end w-full lg:w-auto">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#dc2626] text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Cancel Order
            </button>
          </div>
        ) : (
          <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E4E7EC] lg:pl-6 flex items-center justify-end w-full lg:w-auto">
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center gap-3.5 min-w-[240px] justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2563EB]">
                    {isCompletedStatus ? "Order Value" : "Quotation Value"}
                  </p>
                  <p className="text-xl font-extrabold text-[#1E40AF]">
                    {totalQuotationValue ? formatCurrency(totalQuotationValue) : "-"}
                  </p>
                </div>
              </div>

              {isCompletedStatus && (
                <div className="text-right space-y-1">
                  <p className="text-[11px] font-semibold text-[#667085]">Payment Status</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#16A34A] text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Paid
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Stepper */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-8 shadow-xs">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto">
          {/* Connector Line */}
          <div className="absolute left-8 right-8 top-6 h-0.5 bg-[#E5E7EB] z-0" />

          {steps.map((step) => {
            const IconComponent = step.icon;
            const isBlueActive =
              step.active &&
              (computedStage === "new_order" || computedStage === "quotation_received");

            const circleBg =
              step.completed && !isBlueActive
                ? "bg-[#16A34A] text-white shadow-xs"
                : isBlueActive
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-[#E5E7EB] text-[#6B7280]";

            const textStyle = isBlueActive
              ? "text-[#2563EB]"
              : step.completed
                ? "text-[#4B5563]"
                : "text-[#6B7280]";

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${circleBg}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`mt-3 text-xs md:text-sm font-bold max-w-[100px] leading-tight ${textStyle}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Order & Delivery Tables Layout */}
      {!isQuotationApproved ? (
        /* Item List (Summary) Card for Orders before Quotation Approval */
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2563EB] text-white">
              <Folder className="w-4 h-4 fill-white" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">
              Item List (Summary)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold">
                  <th className="py-3.5 px-5 rounded-l-lg">Coil Type</th>
                  <th className="py-3.5 px-5">Length</th>
                  <th className="py-3.5 px-5">Quantity</th>
                  <th className="py-3.5 px-5 rounded-r-lg">Color</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {rawRequested.length > 0 ? (
                  rawRequested.map((item, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#101828]">
                        {item.name || "-"}
                      </td>
                      <td className="py-4 px-5 font-bold text-[#101828]">
                        {item.lengthFeet ? `${item.lengthFeet} ft` : item.quantity && item.unit ? `${item.quantity} ${item.unit}` : "-"}
                      </td>
                      <td className="py-4 px-5 font-bold text-[#101828]">
                        {item.quantity ?? 0}
                      </td>
                      <td className="py-4 px-5 font-bold text-[#101828]">
                        {item.color || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500 font-medium">
                      No items found in this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : isCompletedStatus ? (
        <div className="space-y-6">
          {/* Total Order Details Card */}
          <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#16A34A] text-white">
                  <Folder className="w-4 h-4 fill-white" />
                </div>
                <h3 className="text-base font-bold text-[#101828]">
                  Total Order Details
                </h3>
              </div>

              <button
                onClick={() => { }}
                className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1d4ed8] transition-colors cursor-pointer shadow-xs"
              >
                View Delivery Details
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold">
                    <th className="py-3 px-5 rounded-l-lg">Order ID</th>
                    <th className="py-3 px-5">Total Length</th>
                    <th className="py-3 px-5">Quantity</th>
                    <th className="py-3 px-5">Order Date ▾</th>
                    <th className="py-3 px-5 rounded-r-lg">Required Date ▾</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {displayOrderId}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {order?.totalLength ? `${order.totalLength} ft` : "-"}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {order?.totalQuantity ?? (rawRequested.reduce((acc, item) => acc + (item.quantity || 0), 0) || "-")}
                    </td>
                    <td className="py-4 px-5 font-semibold text-[#667085]">
                      {orderDate}
                    </td>
                    <td className="py-4 px-5 font-semibold text-[#667085]">
                      {requiredDate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Delivered Items Section */}
            <div className="pt-4 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#16A34A] text-white">
                  <Folder className="w-4 h-4 fill-white" />
                </div>
                <h3 className="text-base font-bold text-[#101828]">
                  Delivered Items
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold">
                      <th className="py-3 px-5 rounded-l-lg">Coil Type</th>
                      <th className="py-3 px-5">Length</th>
                      <th className="py-3 px-5">Quantity</th>
                      <th className="py-3 px-5">Color</th>
                      <th className="py-3 px-5">Delivery ID</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 rounded-r-lg">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                    {deliveredItemsTable.length > 0 ? (
                      deliveredItemsTable.map((row, idx) => (
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
                          <td className="py-4 px-5 font-bold text-[#101828]">
                            -
                          </td>
                          <td className="py-4 px-5 font-bold text-[#16A34A]">
                            Received
                          </td>
                          <td className="py-4 px-5 font-semibold text-[#101828]">
                            {row.expectedDelivery}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500 font-medium">
                          No delivered items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pending / Other Status Delivery View */
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
          {/* Tabs: Total, Delivered, Pending */}
          <div className="inline-flex p-1.5 rounded-2xl border border-[#E2E8F0] gap-2">
            <button
              onClick={() => setActiveTab("Total")}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "Total"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-transparent text-[#475467] hover:text-[#101828]"
                }`}
            >
              Total
            </button>
            <button
              onClick={() => setActiveTab("Delivered")}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "Delivered"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-transparent text-[#475467] hover:text-[#101828]"
                }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setActiveTab("Pending")}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "Pending"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-transparent text-[#475467] hover:text-[#101828]"
                }`}
            >
              Pending
            </button>
          </div>

          {/* Section Header */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#F59E0B] text-white">
              <Folder className="w-4 h-4 fill-white" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">
              Delivery Details
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
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
                {getFilteredItems().length > 0 ? (
                  getFilteredItems().map((row, idx) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500 font-medium">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quotation History Card (Rendered if any available) */}
      {hasQuotations && (
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2563EB] text-white">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">
              Quotation History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold">
                  <th className="py-3 px-5 rounded-l-lg">Quote ID</th>
                  <th className="py-3 px-5">Sent By</th>
                  <th className="py-3 px-5">Date & Time</th>
                  <th className="py-3 px-5">Total Amount</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Customer Remark</th>
                  <th className="py-3 px-5 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {quotationList.map((quote, idx: number) => (
                  <tr key={quote._id || idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {quote.quotationNumber || quote._id || "-"}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {quote.sellerName || "-"}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {formatDate(quote.createdAt || quote.updatedAt || quote.sentAt)}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#2563EB]">
                      {quote.totalValue ? formatCurrency(quote.totalValue) : "-"}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#16A34A]">
                      {quote.status || "-"}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {quote.customerRemark || "-"}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      <button
                        onClick={() => {
                          if (quote._id) {
                            navigate(`/order-quotation-details/${quote._id}`);
                          } else {
                            setShowNoQuotationModal(true);
                          }
                        }}
                        className="p-1 text-gray-600 hover:text-black transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Row: Special Instruction, Attachments & Order Value Summary */}
      <div className={`grid grid-cols-1 ${computedStage === "new_order" ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-6`}>
        {/* Special Instruction */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2563EB] text-white">
              <Folder className="w-4 h-4 fill-white" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">
              Special Instruction
            </h3>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed font-medium">
            {order?.specialInstructions || "-"}
          </p>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2563EB] text-white">
              <Folder className="w-4 h-4 fill-white" />
            </div>
            <h3 className="text-base font-bold text-[#101828]">Attachments</h3>
          </div>

          <div className="space-y-3">
            {order?.attachments && order.attachments.length > 0 ? (
              order.attachments.map((att, idx: number) => {
                const attObj = typeof att === "string" ? { name: att, url: att, size: "-" } : att;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#E4E7EC] bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 font-bold text-[10px] flex items-center justify-center border border-red-100">
                        PDF
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#101828]">{attObj.name || `Attachment ${idx + 1}`}</p>
                        <p className="text-[11px] text-[#667085]">{attObj.size || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#667085]">
                      {attObj.url && (
                        <a href={attObj.url} target="_blank" rel="noreferrer">
                          <Eye className="w-4 h-4 cursor-pointer" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#667085]">No attachments available.</p>
            )}
          </div>
        </div>

        {/* Order Value Summary (Hidden on New Order stage) */}
        {computedStage !== "new_order" && (
          <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#2563EB] text-white">
                  <Folder className="w-4 h-4 fill-white" />
                </div>
                <h3 className="text-base font-bold text-[#101828]">
                  Order Value Summary
                </h3>
              </div>

              <div className="space-y-3.5 pt-2 text-sm font-semibold">
                <div className="flex items-center justify-between text-[#344054]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#344054]">
                    {order?.subtotal !== undefined && order?.subtotal !== null ? formatCurrency(order.subtotal) : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#344054]">
                  <span>Tax</span>
                  <span className="font-bold text-[#344054]">
                    {order?.tax !== undefined && order?.tax !== null ? formatCurrency(order.tax) : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#344054]">
                  <span>Freight</span>
                  <span className="font-bold text-[#344054]">
                    {order?.freight !== undefined && order?.freight !== null ? formatCurrency(order.freight) : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <span className="text-base font-extrabold text-[#1E40AF]">
                Total Order Value
              </span>
              <span className="text-lg font-extrabold text-[#2563EB]">
                {totalQuotationValue ? formatCurrency(totalQuotationValue) : "-"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* No Quotation Received Modal */}
      <NoQuotationModal
        isOpen={showNoQuotationModal}
        onClose={() => setShowNoQuotationModal(false)}
      />

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#101828]">Cancel Order</h3>
            <p className="text-sm text-[#475467]">
              Are you sure you want to cancel order{" "}
              <span className="font-bold text-[#101828]">{displayOrderId}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl border border-[#D0D5DD] text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                No, keep order
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#EF4444] text-sm font-semibold text-white hover:bg-[#dc2626] transition-colors cursor-pointer"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;



