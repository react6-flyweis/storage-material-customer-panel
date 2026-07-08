import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScanQrModalProps {
  open: boolean;
  bundleId: string;
  setBundleId: (value: string) => void;
  onClose: () => void;
}

export default function ScanQrModal({
  open,
  bundleId,
  setBundleId,
  onClose,
}: ScanQrModalProps) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[634px] rounded-[28px] bg-white p-5 shadow-xl">
        <div className="relative">
          <h2 className="text-center text-[36px] font-bold text-black">
            Scan QR Code
          </h2>
        </div>

        <div className="mt-16 flex justify-center">
          <button className="flex items-center gap-4 rounded-lg bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_100%)] px-10 py-5 text-[24px] font-semibold text-white">
            <Camera size={32} />
            Camera Scan
          </button>
        </div>

        <div className="mx-auto mt-16 max-w-[540px]">
          <label className="mb-3 block text-[16px] font-semibold text-[#101828]">
            Enter Bundle ID
          </label>

          <input
            value={bundleId}
            onChange={(e) => setBundleId(e.target.value)}
            className="h-[55px] w-full rounded-xl border border-[#D0D5DD] px-4 text-xl font-medium outline-none"
          />
        </div>

        <div className="mx-auto mt-16 grid max-w-[660px] grid-cols-2 gap-6">
          <button
            onClick={onClose}
            className="h-[55px] rounded-lg bg-[#D4D4D4] text-[24px] font-semibold text-white"
          >
            Cancel
          </button>

          <button onClick={() => navigate("/scanned-page")} className="h-[55px] rounded-lg bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_100%)] text-[24px] font-semibold text-white">
            Scan
          </button>
        </div>
      </div>
    </div>
  );
}