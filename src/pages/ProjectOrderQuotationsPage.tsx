import React, { useState } from "react";
import { ArrowLeft, Search, Eye, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProjectOrderQuotationsQuery,
  type OrderQuotationItemApi,
} from "@/redux/api/quotationsApi";
import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";

export interface QuotationItem {
  orderId: string;
  quotationId: string;
  quotationRecordId: string;
  building: string;
  orderDate: string;
  quotationReceived: string;
  orderValue: string;
  status: string;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "$0";
  return `$${amount.toLocaleString()}`;
};

const formatStatusLabel = (statusStr: string) => {
  const normalized = statusStr?.toLowerCase();
  if (normalized === "approved") return "Approved";
  if (normalized === "sent" || normalized === "pending" || normalized === "pending approval") {
    return "Pending Approval";
  }
  if (normalized === "rejected") return "Rejected";
  return statusStr || "Pending Approval";
};

const ProjectOrderQuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const leadId = id || "";

  const { data: projectDetailsData } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });
  const { data: quotationsData, isLoading, isError } =
    useGetProjectOrderQuotationsQuery(leadId, { skip: !leadId });

  const projectName =
    quotationsData?.project?.projectName ||
    projectDetailsData?.lead?.projectName ||
    "Project Quotations";

  const [buildingFilter, setBuildingFilter] = useState("Select Building");
  const [statusFilter, setStatusFilter] = useState("Select Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  const rawQuotations: OrderQuotationItemApi[] = quotationsData?.quotations || [];

  const items: QuotationItem[] = rawQuotations.map((q) => ({
    orderId: q.orderId || "-",
    quotationId: q.quotationId || "-",
    quotationRecordId: q.quotationRecordId,
    building: q.buildingLabel || "Building",
    orderDate: formatDate(q.orderDate),
    quotationReceived: formatDate(q.quotationReceived),
    orderValue: formatCurrency(q.orderValue),
    status: formatStatusLabel(q.status),
  }));

  const buildingOptions = Array.from(
    new Set(items.map((i) => i.building).filter(Boolean))
  );

  const filteredQuotations = items.filter((item) => {
    if (
      buildingFilter !== "Select Building" &&
      buildingFilter !== "All" &&
      item.building !== buildingFilter
    ) {
      return false;
    }

    if (
      statusFilter !== "Select Status" &&
      statusFilter !== "All" &&
      item.status !== statusFilter
    ) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.orderId.toLowerCase().includes(q) ||
        item.quotationId.toLowerCase().includes(q) ||
        item.building.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayedQuotations = filteredQuotations.slice(
    0,
    parseInt(rowsPerPage, 10) || 10
  );

  return (
    <div className="min-h-screen bg-[#E5ECFF] p-6 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#101828]">
            {projectName} - All Quotations
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            View and manage all your order quotations approve, reject, and more.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-[#E4E7EC]">
        {/* Filter Controls Header */}
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2F4F7]">
          <h2 className="text-base font-bold text-[#101828]">New Orders List</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Building Select */}
            <div className="relative">
              <select
                value={buildingFilter}
                onChange={(e) => setBuildingFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Select Building">Select Building</option>
                <option value="All">All Buildings</option>
                {buildingOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Select Status">Select Status</option>
                <option value="All">All Statuses</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Select */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="All Time">All Time</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Rows Per Page & Search Header */}
        <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b border-[#F2F4F7]">
          <div className="flex items-center gap-2 text-xs text-[#667085] font-medium">
            <span>Row Per Page</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-md pl-2 pr-6 py-0.5 focus:outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#667085] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span>Entries</span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D0D5DD] rounded-md pl-8 pr-3 py-1 text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {isLoading ? (
            <div className="p-8 text-center text-[#64748B]">Loading quotations...</div>
          ) : isError ? (
            <div className="p-8 text-center text-[#64748B]">
              Failed to load order quotations. Please try refreshing.
            </div>
          ) : displayedQuotations.length === 0 ? (
            <div className="p-8 text-center text-[#64748B]">
              No quotations found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold tracking-tight">
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Quotation ID</th>
                  <th className="py-3 px-5">Building</th>
                  <th className="py-3 px-5">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      Order Date
                      <span className="text-[10px]">▼</span>
                    </div>
                  </th>
                  <th className="py-3 px-5">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      Quotation Received
                      <span className="text-[10px]">▼</span>
                    </div>
                  </th>
                  <th className="py-3 px-5">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      Order Value
                      <span className="text-[10px]">▼</span>
                    </div>
                  </th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {displayedQuotations.map((row, index) => (
                  <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-4 px-5 text-[#344054] font-semibold">
                      {row.orderId}
                    </td>
                    <td className="py-4 px-5 text-[#344054] font-semibold">
                      {row.quotationId}
                    </td>
                    <td className="py-4 px-5 font-bold text-[#101828]">
                      {row.building}
                    </td>
                    <td className="py-4 px-5 text-[#98A2B3] font-normal">
                      {row.orderDate}
                    </td>
                    <td className="py-4 px-5 text-[#98A2B3] font-normal">
                      {row.quotationReceived}
                    </td>
                    <td className="py-4 px-5 text-[#0052CC] font-bold">
                      {row.orderValue}
                    </td>
                    <td className="py-4 px-5">
                      {row.status === "Pending Approval" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EAAA08] text-white text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          Pending Approval
                        </span>
                      ) : row.status === "Approved" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#22C55E] text-white text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EF4444] text-white text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() =>
                          navigate(`/order-quotation-details/${row.quotationRecordId}`, {
                            state: { status: row.status, quotation: row, leadId },
                          })
                        }
                        title="View Quotation Details"
                        className="p-1 text-[#475467] hover:text-[#101828] transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectOrderQuotationsPage;
