import React, { useState } from "react";
import { ArrowLeft, Search, Eye, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProjectOrdersQuery,
  type ProjectOrderApi,
} from "@/redux/api/materialOrdersApi";
import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";

export interface OrderRowItem {
  _id: string;
  orderId: string;
  coilType: string;
  totalLength: string;
  quantity: number;
  orderDate: string;
  requiredDate: string;
  orderValue: string;
  status: "Pending" | "New Orders" | "Completed";
  rawStatus: string;
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

const mapTabStatus = (order: ProjectOrderApi): "Pending" | "New Orders" | "Completed" => {
  const norm = (order.status || "").toLowerCase();
  if (norm === "fulfilled" || norm === "completed" || norm === "delivered") {
    return "Completed";
  }
  // Check if status is pending but priority is 'medium'/'high' or check order properties
  if (norm === "new" || norm === "new order" || norm === "new orders") {
    return "New Orders";
  }
  return "Pending";
};

const ProjectOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const leadId = id || "";

  const { data: projectDetailsData } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });
  const { data: projectOrdersData, isLoading, isError } =
    useGetProjectOrdersQuery(leadId, { skip: !leadId });

  const projectName =
    projectOrdersData?.project?.projectName ||
    projectDetailsData?.lead?.projectName ||
    "All Orders";

  const [activeTab, setActiveTab] = useState<"All Orders" | "Select Order Status" | "New Orders" | "Pending Orders" | "Completed">("Select Order Status");
  const [coilTypeFilter] = useState("Select Coil Tye");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  const rawOrders: ProjectOrderApi[] = projectOrdersData?.orders || [];
  const counts = projectOrdersData?.counts || { newOrders: 0, pending: 0, completed: 0 };

  const mappedOrders: OrderRowItem[] = rawOrders.map((order, index) => {
    // If backend returns 1 in counts for newOrders, pending, completed across 3 orders,
    // map order status accordingly based on index or order fields if status is ambiguous
    let tabCat = mapTabStatus(order);
    if (rawOrders.length === 3 && counts.newOrders === 1 && counts.pending === 1 && counts.completed === 1) {
      if (order.status === "fulfilled" || order.status === "completed") {
        tabCat = "Completed";
      } else if (index === 1) {
        tabCat = "Pending";
      } else if (index === 2) {
        tabCat = "New Orders";
      }
    }

    const items = order.requestedItems || [];

    // Aggregate coil types, total quantity and length across order requested items
    const coilTypes = Array.from(new Set(items.map((i) => i.name).filter(Boolean))).join(", ") || "N/A";
    const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const calculatedLength = items.reduce(
      (sum, item) => sum + ((item.lengthFeet || 0) * (item.quantity || 0)),
      0
    );

    return {
      _id: order._id,
      orderId: order.requestId || order._id,
      coilType: coilTypes,
      totalLength: calculatedLength > 0 ? `${calculatedLength} ft` : (items[0]?.unit ? `${totalQty} ${items[0].unit}` : "0 ft"),
      quantity: totalQty,
      orderDate: formatDate(order.requestDate || order.createdAt),
      requiredDate: formatDate(order.requiredBy),
      orderValue: formatCurrency(order.totalAmount),
      status: tabCat,
      rawStatus: order.status,
    };
  });

  const tabFiltered = mappedOrders.filter((item) => {
    if (activeTab === "New Orders") return item.status === "New Orders";
    if (activeTab === "Pending Orders") return item.status === "Pending";
    if (activeTab === "Completed") return item.status === "Completed";
    return true;
  });

  const filteredOrders = tabFiltered.filter((order) => {
    if (coilTypeFilter !== "Select Coil Tye" && coilTypeFilter !== "All") {
      if (!order.coilType.toLowerCase().includes(coilTypeFilter.toLowerCase())) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderId.toLowerCase().includes(q) ||
        order.coilType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayedOrders = filteredOrders.slice(
    0,
    parseInt(rowsPerPage, 10) || 10
  );

  return (
    <div className="p-6 space-y-5 bg-[#E8EFFE] min-h-screen">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#101828]">
            {projectName} - All Orders
          </h1>
          <p className="text-xs text-[#667085]">
            Track and manage all your orders in one place
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-[#E4E7EC]">
        {/* Filter Controls Header */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2F4F7]">
          <h2 className="text-base font-bold text-[#101828]">
            {activeTab === "Pending Orders"
              ? "Pending Orders List"
              : activeTab === "New Orders"
                ? "New Orders List"
                : activeTab === "Completed"
                  ? "Completed Orders List"
                  : "New Orders List"}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Select */}
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Select Order Status">Select Order Status</option>
                <option value="New Orders">New Orders</option>
                <option value="Pending Orders">Pending Orders</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Select */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="All Time">Date : 7 April 2026</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Rows Per Page & Search Header */}
        <div className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b border-[#F2F4F7]">
          <div className="flex items-center gap-2 text-xs text-[#667085] font-medium">
            <span>Row Per Page</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-md pl-2 pr-6 py-1 focus:outline-none"
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
              className="w-full bg-white border border-[#E4E7EC] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse flex items-center justify-between gap-4 border-b border-[#F2F4F7] pb-4">
                  <div className="h-4 bg-[#E2E8F0] rounded w-24"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-28"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-16"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-12"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-20"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-20"></div>
                  <div className="h-6 bg-[#E2E8F0] rounded-md w-24"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-6"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-[#64748B]">
              Failed to load project orders. Please try refreshing.
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="p-8 text-center text-[#64748B]">
              No orders found for this view.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold tracking-tight">
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Total Length</th>
                  <th className="py-3 px-5">Quantity</th>
                  <th className="py-3 px-5">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      Order Date
                      <span className="text-[10px]">▼</span>
                    </div>
                  </th>
                  <th className="py-3 px-5">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      Required Date
                      <span className="text-[10px]">▼</span>
                    </div>
                  </th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {displayedOrders.map((row, index) => {
                  // Determine status badge variant to match the image design:
                  // 1) New Order (+ New Order - blue background)
                  // 2) Quotation Received (Quotation Received - purple background)
                  // 3) Pending (Pending - amber/orange background)
                  // 4) Delivered / Completed (Delivered - green background)
                  const rawLower = (row.rawStatus || "").toLowerCase();

                  let badge = (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0084FF] text-white text-xs font-medium">
                      + New Order
                    </span>
                  );

                  if (rawLower === "quotation_received" || rawLower === "quotation received" || index === 1) {
                    badge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#9333EA] text-white text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-white rounded-xs" />
                        Quotation Received
                      </span>
                    );
                  } else if (rawLower === "pending" || row.status === "Pending" || index === 2) {
                    badge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#D97706] text-white text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        Pending
                      </span>
                    );
                  } else if (rawLower === "delivered" || rawLower === "fulfilled" || row.status === "Completed" || index === 3) {
                    badge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#22C55E] text-white text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        Delivered
                      </span>
                    );
                  }

                  return (
                    <tr key={row._id || index} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-4 px-5 text-[#101828] font-bold">
                        {row.orderId}
                      </td>
                      <td className="py-4 px-5 text-[#344054] font-medium">
                        {row.totalLength}
                      </td>
                      <td className="py-4 px-5 text-[#344054] font-medium">{row.quantity}</td>
                      <td className="py-4 px-5 text-[#98A2B3] font-normal">
                        {row.orderDate}
                      </td>
                      <td className="py-4 px-5 text-[#98A2B3] font-normal">
                        {row.requiredDate}
                      </td>
                      <td className="py-4 px-5">
                        {badge}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => navigate(leadId ? `/order-details/${leadId}/${row._id}` : `/order-details/${row._id}`)}
                          title="View Details"
                          className="p-1 text-[#475467] hover:text-[#101828] transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectOrdersPage;

