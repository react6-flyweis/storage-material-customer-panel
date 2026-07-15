import { Download, X } from "lucide-react";
import {
  useLazyDownloadDeliveryDetailsQuery,
  useLazyDownloadPackingListQuery,
  useLazyDownloadInstructionsQuery,
} from "@/redux/api/deliveriesApi";

interface DocumentModalProps {
  open: boolean;
  deliveryData?: {
    deliveryId: string;
    title?: string;
  };
  onClose: () => void;
}

const documents = [
  {
    id: "details",
    title: "Delivery Details PDF",
    filename: "delivery-details.pdf",
  },
  {
    id: "packing-list",
    title: "Packing List",
    filename: "packing-list.pdf",
  },
  {
    id: "instructions",
    title: "Instructions",
    filename: "instructions.pdf",
  },
];

export default function DocumentModal({
  open,
  deliveryData,
  onClose,
}: DocumentModalProps) {
  const [triggerDownloadDetails] = useLazyDownloadDeliveryDetailsQuery();
  const [triggerDownloadPackingList] = useLazyDownloadPackingListQuery();
  const [triggerDownloadInstructions] = useLazyDownloadInstructionsQuery();

  if (!open) return null;

  const handleDownload = async (docId: string, filename: string) => {
    if (!deliveryData?.deliveryId) return;
    try {
      let resultBlob: Blob | undefined;
      if (docId === "details") {
        resultBlob = await triggerDownloadDetails(deliveryData.deliveryId).unwrap();
      } else if (docId === "packing-list") {
        resultBlob = await triggerDownloadPackingList(deliveryData.deliveryId).unwrap();
      } else if (docId === "instructions") {
        resultBlob = await triggerDownloadInstructions(deliveryData.deliveryId).unwrap();
      }
      if (resultBlob) {
        const url = window.URL.createObjectURL(resultBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error);
    }
  };

  const handleDownloadAll = async () => {
    for (const doc of documents) {
      await handleDownload(doc.id, doc.filename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[512px] rounded-lg bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FB923C]">
              <Download className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828] uppercase">
              Delivery Documents
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {documents.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border-2 border-[#BEDBFF] bg-[#EFF6FF] p-4"
            >
              <div>
                <p className="text-xs font-semibold text-[#193CB8]">
                  PDF
                </p>

                <p className="mt-1 text-base font-bold text-[#101828]">
                  {item.title}
                </p>
              </div>

              <button
                onClick={() => handleDownload(item.id, item.filename)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] transition-transform active:scale-95"
              >
                <Download className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border py-3 text-sm font-medium text-[#101828]"
          >
            Cancel
          </button>

          <button
            onClick={handleDownloadAll}
            className="rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] py-3 text-sm font-medium text-white transition-transform active:scale-95"
          >
            Download All
          </button>
        </div>
      </div>
    </div>
  );
}