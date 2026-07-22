import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Download,
  Eye,
  Check,
  ClipboardList,
  DollarSign,
  Folder,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export interface DeliveryTableItem {
  coilType: string;
  length: string;
  quantity: number;
  color: string;
  sheetStatus: string;
  orderStatus: string;
  expectedDelivery: string;
}

const deliveredItems: DeliveryTableItem[] = [
  {
    coilType: "Black 26 ga",
    length: "24 ft",
    quantity: 30,
    color: "Black",
    sheetStatus: "Completed",
    orderStatus: "Delivered",
    expectedDelivery: "18 May 2026",
  },
  {
    coilType: "Black 26 ga",
    length: "16 ft",
    quantity: 22,
    color: "Black",
    sheetStatus: "Completed",
    orderStatus: "Delivered",
    expectedDelivery: "18 May 2026",
  },
];

const pendingItems: DeliveryTableItem[] = [
  {
    coilType: "Black 26 ga",
    length: "12 ft",
    quantity: 10,
    color: "Black",
    sheetStatus: "Production",
    orderStatus: "Pending",
    expectedDelivery: "22 May 2026",
  },
  {
    coilType: "Black 26 ga",
    length: "8 ft",
    quantity: 4,
    color: "Black",
    sheetStatus: "Dispatch",
    orderStatus: "Pending",
    expectedDelivery: "22 May 2026",
  },
];

const steps = [
  { id: "requested", label: "Requested", icon: FileText, completed: true },
  { id: "quote_receive", label: "Quotation Receive", icon: FileText, completed: true },
  { id: "quote_approve", label: "Quotation Approve", icon: Check, completed: true },
  { id: "confirmed", label: "Order Confirmed", icon: ClipboardList, completed: true },
  { id: "completed", label: "Completed", icon: Check, completed: false },
];

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [activeTab, setActiveTab] = useState<"Delivered" | "Pending">("Pending");

  const displayOrderId = orderId || "CO-ORD-876";
  const tableItems = activeTab === "Delivered" ? deliveredItems : pendingItems;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Top Bar with Back, Title & View Quotation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors"
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

        <button
          onClick={() => {
            // Action to view quotation document
          }}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-xs"
        >
          View Quotation
        </button>
      </div>

      {/* Header Info Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Order & Project Code */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#101828]">{displayOrderId}</h2>
          <p className="text-base font-bold text-[#2563EB]">
            ABC Logistics Warehouse
          </p>
          <p className="text-sm font-medium text-[#667085]">PRJ-2026-014</p>
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
              <p className="text-sm font-bold text-[#101828]">
                15 May 2026, 10:30 AM
              </p>
            </div>
          </div>

          {/* Required Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Required Date</p>
              <p className="text-sm font-bold text-[#101828]">
                25 May 2026, 10:30 AM
              </p>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-[#667085]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#667085]">Created by</p>
              <p className="text-sm font-bold text-[#101828]">John Doe</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#667085]">Order Status</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D97706] text-white text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Pending
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
            <p className="text-xl font-extrabold text-[#1E40AF]">$18,750.00</p>
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
                className="relative z-10 flex flex-col items-center text-center cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step.completed
                      ? "bg-[#16A34A] text-white shadow-sm"
                      : "bg-[#F3F4F6] text-[#9CA3AF]"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`mt-3 text-xs md:text-sm font-bold max-w-25 leading-tight ${
                    step.completed ? "text-[#101828]" : "text-[#6B7280]"
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
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "Delivered"
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-transparent text-[#475467] hover:text-[#101828]"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "Pending"
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-transparent text-[#475467] hover:text-[#101828]"
            }`}
          >
            Pending
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
            Please ensure the coils are packed with edge protectors and waterproof
            wrapping label each coil with heat number and project code.
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
            {/* File 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E4E7EC] hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 font-bold text-xs flex items-center justify-center">
                  PDF
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101828]">
                    Purchase Order
                  </p>
                  <p className="text-[11px] text-[#667085]">15.2 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#667085]">
                <button className="p-1 hover:text-[#101828] transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1 hover:text-[#101828] transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* File 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E4E7EC] hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 font-bold text-xs flex items-center justify-center">
                  PDF
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101828]">
                    Coil Specification
                  </p>
                  <p className="text-[11px] text-[#667085]">15.2 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#667085]">
                <button className="p-1 hover:text-[#101828] transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1 hover:text-[#101828] transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
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
                <span className="font-bold text-[#475467]">$16,800.00</span>
              </div>
              <div className="flex items-center justify-between text-[#667085]">
                <span>Tax</span>
                <span className="font-bold text-[#475467]">$1,680.00</span>
              </div>
              <div className="flex items-center justify-between text-[#667085]">
                <span>Freight</span>
                <span className="font-bold text-[#475467]">$270.00</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
            <span className="text-base font-extrabold text-[#1E40AF]">
              Total Order Value
            </span>
            <span className="text-lg font-extrabold text-[#2563EB]">
              $18,750,00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
