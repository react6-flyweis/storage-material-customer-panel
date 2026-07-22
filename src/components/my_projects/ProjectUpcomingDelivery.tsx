import { Eye, ChevronDown, Truck } from "lucide-react";

export interface DeliveryItem {
  id: string;
  deliveryId: string;
  material: string;
  truckNo: string;
  bundle: number | string;
  deliveryCompany: string;
  deliveryDate: string;
  status: "In Transit" | "Delayed" | "Delivered" | string;
}

const defaultDeliveries: DeliveryItem[] = [
  {
    id: "1",
    deliveryId: "DEL-001",
    material: "Primary Frame Steel",
    truckNo: "TX-7654",
    bundle: 6,
    deliveryCompany: "ABC Logistic",
    deliveryDate: "14/01/2024",
    status: "In Transit",
  },
  {
    id: "2",
    deliveryId: "DEL-002",
    material: "Primary Frame Steel",
    truckNo: "TX-7654",
    bundle: 7,
    deliveryCompany: "ABC Logistic",
    deliveryDate: "21/01/2024",
    status: "Delayed",
  },
  {
    id: "3",
    deliveryId: "DEL-003",
    material: "Primary Frame Steel",
    truckNo: "TX-7654",
    bundle: 8,
    deliveryCompany: "ABC Logistic",
    deliveryDate: "20/02/2024",
    status: "Delivered",
  },
];

interface ProjectUpcomingDeliveryProps {
  deliveries?: DeliveryItem[];
  onViewAll?: () => void;
  onViewDeliveryDetails?: (delivery: DeliveryItem) => void;
}

const getStatusBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("transit")) {
    return "bg-[#0084FF] text-white";
  }
  if (normalized.includes("delayed")) {
    return "bg-[#DC2626] text-white";
  }
  if (normalized.includes("delivered")) {
    return "bg-[#22C55E] text-white";
  }
  return "bg-gray-500 text-white";
};

const ProjectUpcomingDelivery = ({
  deliveries = defaultDeliveries,
  onViewAll,
  onViewDeliveryDetails,
}: ProjectUpcomingDeliveryProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-5 md:px-6 md:py-5">
        <div className="flex items-center gap-2.5">
          <Truck className="h-6 w-6 text-[#2563EB] fill-[#2563EB]/10" />
          <h2 className="text-xl font-bold text-[#101828]">Upcoming Delivery</h2>
        </div>
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
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Delivery ID</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Material</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Truck No.</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Bundle</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Delivery Company</th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  <span>Delivery Date</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#344054] stroke-[2.5]" />
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-semibold">Status</th>
              <th className="py-3.5 px-4 sm:px-6 w-12"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#EAECF0] bg-white text-sm">
            {deliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className="hover:bg-gray-50/60 transition-colors"
              >
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {delivery.deliveryId}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#101828] font-bold whitespace-nowrap">
                  {delivery.material}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {delivery.truckNo}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {delivery.bundle}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#475467] font-normal whitespace-nowrap">
                  {delivery.deliveryCompany}
                </td>
                <td className="py-5 px-4 sm:px-6 text-[#98A2B3] font-normal whitespace-nowrap">
                  {delivery.deliveryDate}
                </td>
                <td className="py-5 px-4 sm:px-6 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold ${getStatusBadgeStyle(
                      delivery.status
                    )}`}
                  >
                    <span className="text-[10px] leading-none">•</span>
                    {delivery.status}
                  </span>
                </td>
                <td className="py-5 px-4 sm:px-6 text-right whitespace-nowrap">
                  <button
                    onClick={() => onViewDeliveryDetails?.(delivery)}
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

export default ProjectUpcomingDelivery;
