import React, { useState } from "react";
import { ArrowLeft, Search, Eye, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface OrderItem {
  orderId: string;
  coilType: string;
  totalLength: string;
  quantity: number;
  orderDate: string;
  requiredDate: string;
  orderValue: string;
  status: "Pending" | "New Orders" | "Completed";
}

const mockOrders: OrderItem[] = [
  {
    orderId: "CO-ORD-876",
    coilType: "Black 26ga",
    totalLength: "200 ft",
    quantity: 250,
    orderDate: "14/01/2024",
    requiredDate: "15/01/2024",
    orderValue: "$98765",
    status: "Pending",
  },
  {
    orderId: "CO-ORD-876",
    coilType: "Galvanized 24ga",
    totalLength: "300 ft",
    quantity: 300,
    orderDate: "21/01/2024",
    requiredDate: "25/01/2024",
    orderValue: "$98765",
    status: "Pending",
  },
  {
    orderId: "CO-ORD-876",
    coilType: "Black 26ga",
    totalLength: "400 ft",
    quantity: 250,
    orderDate: "20/02/2024",
    requiredDate: "22/02/2024",
    orderValue: "$98765",
    status: "Pending",
  },
];

const ProjectOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"New Orders" | "Pending Orders" | "Completed">("Pending Orders");
  const [coilTypeFilter, setCoilTypeFilter] = useState("Select Coil Tye");
  const [dateFilter, setDateFilter] = useState("Date : 7 April 2026");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter((order) => {
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

  return (
    <div className="min-h-screen bg-[#EBF2FE] p-6 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#101828]">
            ABC Logistic Warehouse - All Orders
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Track and manage all your orders in one place
          </p>
        </div>
      </div>

      {/* Tabs Pill Section */}
      <div className="inline-flex items-center bg-white p-1.5 rounded-2xl shadow-xs gap-2">
        <button
          onClick={() => setActiveTab("New Orders")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "New Orders"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "text-[#344054] hover:text-[#101828]"
          }`}
        >
          New Orders - 3
        </button>
        <button
          onClick={() => setActiveTab("Pending Orders")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "Pending Orders"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "text-[#344054] hover:text-[#101828]"
          }`}
        >
          Pending Orders - 8
        </button>
        <button
          onClick={() => setActiveTab("Completed")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "Completed"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "text-[#344054] hover:text-[#101828]"
          }`}
        >
          Completed - 36
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-[#E4E7EC]">
        {/* Filter Controls Header */}
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2F4F7]">
          <h2 className="text-base font-bold text-[#101828]">
            {activeTab === "Pending Orders" ? "Pending Orders List" : activeTab === "New Orders" ? "New Orders List" : "Completed Orders List"}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Coil Type Select */}
            <div className="relative">
              <select
                value={coilTypeFilter}
                onChange={(e) => setCoilTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Select Coil Tye">Select Coil Tye</option>
                <option value="All">All Coil Types</option>
                <option value="Black 26ga">Black 26ga</option>
                <option value="Galvanized 24ga">Galvanized 24ga</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Select */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D5DD] text-[#344054] text-xs font-medium rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Date : 7 April 2026">Date : 7 April 2026</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E5E7EB] text-[#374151] text-xs font-bold tracking-tight">
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Coil Type</th>
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
              {filteredOrders.map((row, index) => (
                <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5 text-[#344054] font-medium">
                    {row.orderId}
                  </td>
                  <td className="py-4 px-5 font-bold text-[#101828]">
                    {row.coilType}
                  </td>
                  <td className="py-4 px-5 text-[#344054] font-medium">{row.totalLength}</td>
                  <td className="py-4 px-5 text-[#344054] font-medium">{row.quantity}</td>
                  <td className="py-4 px-5 text-[#98A2B3] font-normal">
                    {row.orderDate}
                  </td>
                  <td className="py-4 px-5 text-[#98A2B3] font-normal">
                    {row.requiredDate}
                  </td>
                  <td className="py-4 px-5 text-[#0052CC] font-bold">
                    {row.orderValue}
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EAAA08] text-white text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => navigate(`/order-details/${row.orderId}`)}
                      title="View Details"
                      className="p-1 text-[#475467] hover:text-[#101828] transition-colors"
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
    </div>
  );
};

export default ProjectOrdersPage;

