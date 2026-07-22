import { Eye, ChevronDown } from "lucide-react";

export interface OrderItem {
  id: string;
  orderId: string;
  building: string;
  coilType: string;
  totalLength: string;
  quantity: number | string;
  orderDate: string;
  requiredDate: string;
  status: "New Order" | "Pending" | "Completed" | string;
}

const defaultOrders: OrderItem[] = [
  {
    id: "1",
    orderId: "CO-ORD-876",
    building: "Building A",
    coilType: "Black 26ga",
    totalLength: "200 ft",
    quantity: 250,
    orderDate: "14/01/2024",
    requiredDate: "15/01/2024",
    status: "New Order",
  },
  {
    id: "2",
    orderId: "CO-ORD-876",
    building: "Building B",
    coilType: "Galvanized 24ga",
    totalLength: "300 ft",
    quantity: 300,
    orderDate: "21/01/2024",
    requiredDate: "25/01/2024",
    status: "Pending",
  },
  {
    id: "3",
    orderId: "CO-ORD-876",
    building: "Building C",
    coilType: "Black 26ga",
    totalLength: "400 ft",
    quantity: 250,
    orderDate: "20/02/2024",
    requiredDate: "22/02/2024",
    status: "Completed",
  },
];

interface ProjectOrdersListProps {
  orders?: OrderItem[];
  onViewAll?: () => void;
  onViewOrderDetails?: (order: OrderItem) => void;
}

const getStatusBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("new")) {
    return "bg-[#0084FF] text-white";
  }
  if (normalized.includes("pending")) {
    return "bg-[#D97706] text-white";
  }
  if (normalized.includes("completed")) {
    return "bg-[#22C55E] text-white";
  }
  return "bg-gray-500 text-white";
};

const ProjectOrdersList = ({
  orders = defaultOrders,
  onViewAll,
  onViewOrderDetails,
}: ProjectOrdersListProps) => {

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-5 md:px-6 md:py-5">
        <h2 className="text-xl font-bold text-[#101828]">Orders List</h2>
        <button
          onClick={onViewAll}
          className="rounded-lg border border-[#D0D5DD] bg-white px-5 py-2 text-sm font-semibold text-[#101828] shadow-xs hover:bg-gray-50 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-175">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#E9ECF0] text-[#344054] text-xs font-bold sm:text-sm">
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Order ID</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Building</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Coil Type</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Total Length</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Quantity</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  <span>Order Date</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#344054] stroke-[2.5]" />
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  <span>Required Date</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#344054] stroke-[2.5]" />
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Status</th>
              <th className="py-3.5 px-4 sm:px-6 w-12"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#EAECF0] bg-white text-sm">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/60 transition-colors"
              >
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {order.orderId}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#101828] font-bold whitespace-nowrap">
                  {order.building}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#101828] font-bold whitespace-nowrap">
                  {order.coilType}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {order.totalLength}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {order.quantity}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#98A2B3] font-normal whitespace-nowrap">
                  {order.orderDate}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#98A2B3] font-normal whitespace-nowrap">
                  {order.requiredDate}
                </td>
                <td className="py-5 px-4 sm:px-6 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeStyle(
                      order.status
                    )}`}
                  >
                    <span className="text-[10px] leading-none">•</span>
                    {order.status}
                  </span>
                </td>
                <td className="py-5 px-4 sm:px-6 text-right whitespace-nowrap">
                  <button
                    onClick={() => onViewOrderDetails?.(order)}
                    className="p-1 text-[#101828] hover:text-[#2563EB] transition-colors rounded-md"
                    title="View details"
                  >
                    <Eye className="h-5 w-5 stroke-[1.75]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectOrdersList;
