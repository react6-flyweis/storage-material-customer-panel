import { useNavigate, useSearchParams } from "react-router-dom";
import { MoveLeft, Loader2, AlertTriangle, ChevronDown } from "lucide-react";
import SuccessModal from "../common_components/SuccessModal";
import { useState, useEffect } from "react";
import {
  useGetBundleDetailsQuery,
} from "@/redux/api/deliveriesApi";
import BundleContactSupportModal from "./BundleContactSupportModal";
import BundleReportIssueModal from "./BundleReportIssueModal";

interface ItemRow {
  itemCode: string;
  name: string;
  quantity: number;
  color: string;
  receivedQty: number;
  status: "Received" | "Partially Received" | "Not Received";
}

const ScannedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bundleIdParam = searchParams.get("bundleId") || "";

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const { data: scannedResult, isLoading, error } = useGetBundleDetailsQuery(bundleIdParam, {
    skip: !bundleIdParam,
  });

  const errData = error as { data?: { message?: string }; message?: string } | undefined;
  const apiErrorMsg = errData?.data?.message || errData?.message || (error ? "Bundle not found" : null);

  const bundle = scannedResult?.bundle;

  // Local state for items received status
  const [items, setItems] = useState<ItemRow[]>([]);

  useEffect(() => {
    if (bundle?.items && bundle.items.length > 0) {
      const mapped = bundle.items.map((item, idx) => {
        const itemCode = item.markIds?.[0] || item.sourceLineSnapshot?.pieceMark || item.partCode || `ITEM-${idx + 1}`;
        const name = item.description || item.partCode || "Material Item";
        const quantity = item.qty ?? item.sourceLineSnapshot?.qty ?? 0;
        const color = item.color || item.sourceLineSnapshot?.color || "-";
        return {
          itemCode,
          name,
          quantity,
          color,
          receivedQty: quantity,
          status: "Received" as const,
        };
      });
      setItems(mapped);
    } else {
      setItems([]);
    }
  }, [bundle]);

  const handleMarkAllReceived = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        receivedQty: item.quantity,
        status: "Received",
      }))
    );
  };

  const handleQtyChange = (index: number, val: string) => {
    const num = parseInt(val, 10);
    const newQty = isNaN(num) ? 0 : num;
    setItems((prev) => {
      const next = [...prev];
      const target = next[index];
      const validQty = Math.max(0, Math.min(target.quantity, newQty));
      let newStatus: "Received" | "Partially Received" | "Not Received" = "Not Received";
      if (validQty === target.quantity) {
        newStatus = "Received";
      } else if (validQty > 0) {
        newStatus = "Partially Received";
      }
      next[index] = {
        ...target,
        receivedQty: validQty,
        status: newStatus,
      };
      return next;
    });
  };

  const handleStatusToggle = (index: number) => {
    setItems((prev) => {
      const next = [...prev];
      const target = next[index];
      let nextStatus: "Received" | "Partially Received" | "Not Received" = "Received";
      let nextQty = target.quantity;

      if (target.status === "Received") {
        nextStatus = "Partially Received";
        nextQty = Math.max(1, target.quantity - 2);
      } else if (target.status === "Partially Received") {
        nextStatus = "Not Received";
        nextQty = 0;
      } else {
        nextStatus = "Received";
        nextQty = target.quantity;
      }

      next[index] = {
        ...target,
        receivedQty: nextQty,
        status: nextStatus,
      };
      return next;
    });
  };

  const handleSave = () => {
    setModalTitle("Order Details Saved Successfully");
    setIsSuccessModalOpen(true);
  };

  const handleDownloadItemList = () => {
    setModalTitle("Item List Downloaded Successfully");
    setIsSuccessModalOpen(true);
  };

  // Details data extraction without mock data defaults
  const projectName = bundle?.project?.projectName || "-";
  const bundleNo = bundle?.bundleNo || bundleIdParam || "-";
  const loadId = bundle?.truck?.packingListNo || "-";
  const truckNo = bundle?.truck?.truck || "-";
  const orderId = bundle?.deliveryReference?.deliveryNumber || "-";

  const totalQuantity = bundle?.totalQty ?? items.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalWeight = bundle?.totalWeight != null ? `${bundle.totalWeight.toLocaleString()} lbs` : "-";
  const totalLength = bundle?.maxLengthFeet != null ? `${bundle.maxLengthFeet.toFixed(0)} ft` : "-";

  const deliveryId = bundle?.deliveryReference?.deliveryNumber || "-";
  const deliveryDate = "-";
  const destination = bundle?.deliveryReference?.destination || "-";
  const status = bundle?.deliveryReference?.status || bundle?.status || "-";

  return (
    <div className="p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 text-gray-700 hover:text-black transition-colors"
          >
            <MoveLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#101828]">Order Details</h1>
            <p className="text-sm text-gray-500">Delivered order details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllReceived}
            className="px-4 py-2 bg-[#00A859] hover:bg-[#00914d] text-white text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
          >
            ✓ Mark All Received
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#1D5BD8] hover:bg-[#1646a8] text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-8">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#1D5BD8]" />
            <p className="text-sm font-medium text-gray-600">Loading order details...</p>
          </div>
        ) : apiErrorMsg ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-6 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-bold text-red-700">Error Loading Order</h3>
            <p className="text-sm text-red-600 mt-1">{apiErrorMsg}</p>
          </div>
        ) : (
          <>
            {/* Top Bundle Details Grey Banner */}
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#101828] mb-4">
                Bundle Details — {bundleNo}
              </h2>
              <div className="space-y-1.5 text-sm font-medium text-[#101828]">
                <p><span className="font-bold text-[#101828]">Project:</span> {projectName}</p>
                <p><span className="font-bold text-[#101828]">Bundle ID:</span> {bundleNo}</p>
                <p><span className="font-bold text-[#101828]">Load ID:</span> {loadId}</p>
                <p><span className="font-bold text-[#101828]">Truck:</span> {truckNo}</p>
                <p><span className="font-bold text-[#101828]">Order ID:</span> {orderId}</p>
              </div>
            </div>

            {/* Material Details & Delivery Reference grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              {/* Material Details */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-[#101828] mb-4">
                  <span>📦</span> Material Details
                </h3>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Total Quantity</span>
                    <span className="font-bold text-[#101828]">{totalQuantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Total Weight</span>
                    <span className="font-bold text-[#101828]">{totalWeight}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Total Length</span>
                    <span className="font-bold text-[#101828]">{totalLength}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Reference */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-[#101828] mb-4">
                  <span>🚚</span> Delivery Reference
                </h3>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Delivery ID</span>
                    <span className="font-bold text-[#101828]">{deliveryId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Date</span>
                    <span className="font-bold text-[#101828]">{deliveryDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Destination</span>
                    <span className="font-bold text-[#101828]">{destination}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#101828]">Status</span>
                    <span className="font-semibold text-[#00A859]">{status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4 pt-2">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#101828]">
                <span>📋</span> Items
              </h3>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#EAECF0] text-[#344054] font-semibold">
                      <th className="py-3 px-4">Item Code</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Color</th>
                      <th className="py-3 px-4">Enter Received Quintity</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-medium text-[#344054]">
                          {item.itemCode}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#155EEF] cursor-pointer hover:underline">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#344054]">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#344054]">
                          {item.color}
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            value={item.receivedQty}
                            onChange={(e) => handleQtyChange(idx, e.target.value)}
                            className="w-24 px-3 py-1.5 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5BD8] font-medium text-[#101828]"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleStatusToggle(idx)}
                            className={`w-40 py-2 px-3 rounded-lg text-white font-medium text-sm flex items-center justify-between transition-colors ${item.status === "Received"
                                ? "bg-[#00A859] hover:bg-[#00914d]"
                                : item.status === "Partially Received"
                                  ? "bg-[#EAAA08] hover:bg-[#d49900]"
                                  : "bg-[#F04438] hover:bg-[#d9382c]"
                              }`}
                          >
                            <span>{item.status}</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleDownloadItemList}
                  className="px-4 py-2.5 bg-[#667085] hover:bg-[#535c6e] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Download Item List
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Support & Issue Modals */}
      <BundleContactSupportModal
        open={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        bundleId={bundleNo}
        onSuccess={(title) => {
          setModalTitle(title);
          setIsSuccessModalOpen(true);
        }}
      />

      <BundleReportIssueModal
        open={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        bundleId={bundleNo}
        onSuccess={(title) => {
          setModalTitle(title);
          setIsSuccessModalOpen(true);
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default ScannedPage;
