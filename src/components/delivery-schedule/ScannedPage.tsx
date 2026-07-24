import TitleSubtitle from "../common_components/TitleSubtitle";
import { Button } from "../ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Package,
  Truck,
  ClipboardList,
  MoveLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import SuccessModal from "../common_components/SuccessModal";
import { useState } from "react";
import {
  useGetBundleDetailsQuery,
  useLazyDownloadBundleDetailsQuery,
  useLazyDownloadBundlePackingListQuery,
} from "@/redux/api/deliveriesApi";
import BundleContactSupportModal from "./BundleContactSupportModal";
import BundleReportIssueModal from "./BundleReportIssueModal";

const ScannedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bundleIdParam = searchParams.get("bundleId") || "";

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Modal states
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const { data: scannedResult, isLoading, error } = useGetBundleDetailsQuery(bundleIdParam, {
    skip: !bundleIdParam,
  });

  const [downloadBundleDetails, { isLoading: isDownloadingDetails }] = useLazyDownloadBundleDetailsQuery();
  const [downloadPackingList, { isLoading: isDownloadingPackingList }] = useLazyDownloadBundlePackingListQuery();

  const errData = error as { data?: { message?: string }; message?: string } | undefined;
  const apiErrorMsg = errData?.data?.message || errData?.message || (error ? "Bundle not found" : null);

  const bundleDetails = scannedResult ? {
    project: scannedResult.project || "-",
    bundleId: scannedResult.bundleId || bundleIdParam,
    loadId: scannedResult.loadId || "-",
    truck: scannedResult.truck || "-",
    partNumbers: scannedResult.materialDetails?.partNumbers?.join(", ") || "-",
    totalQuantity: scannedResult.materialDetails?.totalQuantity ?? "-",
    totalWeight: scannedResult.materialDetails?.totalWeight || "-",
    length: scannedResult.materialDetails?.length || "-",
    deliveryId: scannedResult.deliveryId || "-",
    destination: scannedResult.destination || "-",
    status: scannedResult.status || "-",
    parts: (scannedResult.parts || []).map((p, idx) => ({
      id: p.id ?? idx + 1,
      part: p.part,
      qty: p.qty,
      length: p.length,
      weight: p.weight,
    })),
  } : null;

  const currentBundleId = bundleDetails?.bundleId || bundleIdParam;

  const handleModalSuccess = (title: string) => {
    setModalTitle(title);
    setIsSuccessModalOpen(true);
  };

  const handleDownloadBundleDetails = async () => {
    if (!currentBundleId) return;
    try {
      const blob = await downloadBundleDetails(currentBundleId).unwrap();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bundle-${currentBundleId}-details.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
      handleModalSuccess("Downloaded Successfully");
    } catch (err: unknown) {
      console.error("Failed to download bundle details:", err);
    }
  };

  const handleDownloadPackingList = async () => {
    if (!currentBundleId) return;
    try {
      const blob = await downloadPackingList(currentBundleId).unwrap();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bundle-${currentBundleId}-packing-list.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
      handleModalSuccess("Downloaded Successfully");
    } catch (err: unknown) {
      console.error("Failed to download packing list:", err);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <Button
          className="bg-[#2563EB] hover:bg-blue-700 text-white min-w-[100px] gap-2 px-6 h-10 rounded-md shadow-sm"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center justify-between gap-4">
          <button
            disabled={!currentBundleId}
            onClick={() => setIsSupportModalOpen(true)}
            className="ml-auto flex w-fit min-w-[128px] items-center justify-center gap-2 rounded-md bg-(--button-bg-primary-color) px-4 py-2.5 text-sm font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-50 lg:mt-2"
          >
            Contact Support
          </button>
          <button
            disabled={!currentBundleId}
            onClick={() => setIsIssueModalOpen(true)}
            className="ml-auto flex w-fit min-w-[128px] items-center justify-center gap-2 rounded-md bg-[#FD8D5B] px-4 py-2.5 text-sm font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-50 lg:mt-2"
          >
            Report Issue
          </button>
        </div>
      </div>
      <TitleSubtitle
        title="QR Label Scanned"
        subtitle={bundleIdParam ? `Bundle Details — ${bundleIdParam}` : "Bundle Details"}
      />
      <div className="rounded-lg bg-white p-5">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
            <p className="text-sm font-medium text-gray-600">Loading bundle details...</p>
          </div>
        ) : apiErrorMsg ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-6 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-bold text-red-700">Error Loading Bundle</h3>
            <p className="text-sm text-red-600 mt-1">{apiErrorMsg}</p>
          </div>
        ) : bundleDetails ? (
          <>
            <div className="rounded-lg bg-[#F8FAFC] p-6">
              <h2 className="text-[24px] font-medium text-[#101828]">
                Bundle Details — {bundleDetails.bundleId}
              </h2>

              <div className="mt-4 space-y-2 text-base text-[#101828]">
                <p>
                  <span className="font-semibold">Project:</span> {bundleDetails.project}
                </p>

                <p>
                  <span className="font-semibold">Bundle ID:</span> {bundleDetails.bundleId}
                </p>

                <p>
                  <span className="font-semibold">Load ID:</span> {bundleDetails.loadId}
                </p>

                <p>
                  <span className="font-semibold">Truck:</span> {bundleDetails.truck}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="mb-5 flex items-center gap-2 text-[20px] font-medium text-[#101828]">
                  <Package size={20} />
                  Material Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">Part Numbers</span>

                    <span className="font-semibold text-[#101828]">
                      {bundleDetails.partNumbers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">
                      Total Quantity
                    </span>

                    <span className="font-semibold text-[#101828]">{bundleDetails.totalQuantity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">Total Weight</span>

                    <span className="font-semibold text-[#101828]">{bundleDetails.totalWeight}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">Length</span>

                    <span className="font-semibold text-[#101828]">{bundleDetails.length}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-5 flex items-center gap-2 text-[20px] font-medium text-[#101828]">
                  <Truck size={20} />
                  Delivery Reference
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">Delivery ID</span>

                    <span className="font-semibold text-[#101828]">{bundleDetails.deliveryId}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">Destination</span>

                    <span className="font-semibold text-[#101828]">
                      {bundleDetails.destination}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#101828]">Status</span>

                    <span className="font-semibold text-[#101828]">{bundleDetails.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 flex items-center gap-2 text-[20px] font-medium text-[#101828]">
                <ClipboardList size={20} />
                Parts
              </h3>

              <div className="overflow-hidden rounded-lg border border-[#E4E7EC]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#222222] text-left text-sm text-white">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Part</th>
                      <th className="px-6 py-4">Qty</th>
                      <th className="px-6 py-4">Length</th>
                      <th className="px-6 py-4">Weight</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bundleDetails.parts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-5 text-center text-[#4A5565]">
                          No parts listed for this bundle.
                        </td>
                      </tr>
                    ) : (
                      bundleDetails.parts.map((item) => (
                        <tr key={item.id} className="border-t border-[#E4E7EC]">
                          <td className="px-6 py-5 text-[#4A5565]">{item.id}</td>

                          <td className="px-6 py-5 text-[#4A5565]">{item.part}</td>

                          <td className="px-6 py-5 text-[#4A5565]">{item.qty}</td>

                          <td className="px-6 py-5 text-[#4A5565]">{item.length}</td>

                          <td className="px-6 py-5 text-[#4A5565]">{item.weight}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-[#D0D5DD] px-6 py-3 text-sm font-medium text-[#101828]"
          >
            Cancel
          </button>

          <button
            disabled={!bundleDetails || isDownloadingDetails}
            onClick={handleDownloadBundleDetails}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#9333EA] to-[#7C3AED] px-6 py-3 text-sm font-medium text-[#ffffff] disabled:opacity-50"
          >
            {isDownloadingDetails && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            Download Bundle contents
          </button>

          <button
            disabled={!bundleDetails || isDownloadingPackingList}
            onClick={handleDownloadPackingList}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#9333EA] to-[#7C3AED] px-6 py-3 text-sm font-medium text-[#ffffff] disabled:opacity-50"
          >
            {isDownloadingPackingList && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            Download Packing List
          </button>
        </div>

        <BundleContactSupportModal
          open={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          bundleId={currentBundleId}
          onSuccess={handleModalSuccess}
        />

        <BundleReportIssueModal
          open={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          bundleId={currentBundleId}
          onSuccess={handleModalSuccess}
        />

        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title={modalTitle}
        />
      </div>
    </div>
  );
};

export default ScannedPage;
