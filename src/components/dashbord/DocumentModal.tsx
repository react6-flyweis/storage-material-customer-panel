import { Download, X } from "lucide-react";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
}

const documents = [
  {
    title: "Delivery Details PDF",
    size: "22 MB",
  },
  {
    title: "Packing List",
    size: "22 MB",
  },
  {
    title: "Instructions",
    size: "22 MB",
  },
];

export default function DocumentModal({
  open,
  onClose,
}: DocumentModalProps) {
  if (!open) return null;

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
              key={item.title}
              className="flex items-center justify-between rounded-xl border-2 border-[#BEDBFF] bg-[#EFF6FF] p-4"
            >
              <div>
                <p className="text-xs font-semibold text-[#193CB8]">
                  PDF
                </p>

                <p className="mt-1 text-base font-bold text-[#101828]">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-[#4A5565]">
                  {item.size}
                </p>
              </div>

              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A]">
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

          <button className="rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] py-3 text-sm font-medium text-white">
            Download All
          </button>
        </div>
      </div>
    </div>
  );
}