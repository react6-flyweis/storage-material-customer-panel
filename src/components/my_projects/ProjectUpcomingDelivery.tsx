import { Eye, ChevronDown, Truck, Loader2 } from "lucide-react";
import { useGetDeliveriesQuery, type Delivery } from "@/redux/api/deliveriesApi";

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

interface ProjectUpcomingDeliveryProps {
  leadId?: string;
  deliveries?: DeliveryItem[];
  onViewAll?: () => void;
  onViewDeliveryDetails?: (delivery: DeliveryItem) => void;
}

const getStatusBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("transit") || normalized.includes("scheduled")) {
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

const mapApiDeliveryToItem = (item: Delivery): DeliveryItem => {
  return {
    id: item.deliveryId,
    deliveryId: item.deliveryNumber || item.deliveryId,
    material: item.packingListSummary?.material || item.description || "N/A",
    truckNo: item.loadAndBundle?.truckNumber || "N/A",
    bundle: item.loadAndBundle?.bundleCount ?? "-",
    deliveryCompany: item.deliveryCompany?.name || item.deliveryTeam?.company || "N/A",
    deliveryDate: item.deliveryDate
      ? new Date(item.deliveryDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A",
    status: item.status === "in_transit" ? "In Transit" : item.status === "scheduled" ? "Scheduled" : item.status || "N/A",
  };
};

const ProjectUpcomingDelivery = ({
  leadId,
  deliveries: propDeliveries,
  onViewAll,
  onViewDeliveryDetails,
}: ProjectUpcomingDeliveryProps) => {
  const { data, isLoading } = useGetDeliveriesQuery(
    { tab: "upcoming", project: leadId },
    { skip: !leadId }
  );

  const apiDeliveries = data?.deliveries?.map(mapApiDeliveryToItem);
  const displayDeliveries = propDeliveries || apiDeliveries || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-5 md:px-6 md:py-5">
        <div className="flex items-center gap-2.5">
          <Truck className="h-6 w-6 text-[#2563EB] fill-[#2563EB]/10" />
          <h2 className="text-xl font-bold text-[#101828]">Upcoming Delivery</h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="rounded-lg border border-[#D0D5DD] bg-white px-5 py-2 text-sm font-semibold text-[#101828] shadow-xs hover:bg-gray-50 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-[#2563EB]" />
            <span>Loading upcoming deliveries...</span>
          </div>
        ) : displayDeliveries.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No upcoming deliveries found.
          </div>
        ) : (
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
              {displayDeliveries.map((delivery) => (
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
        )}
      </div>
    </div>
  );
};

export default ProjectUpcomingDelivery;

