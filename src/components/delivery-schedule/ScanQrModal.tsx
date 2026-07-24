import { Camera, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useScanBundleMutation } from "@/redux/api/deliveriesApi";

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
  const [scanBundle, { isLoading }] = useScanBundleMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleScan = async () => {
    const trimmedId = bundleId.trim();
    if (!trimmedId) {
      setErrorMsg("Please enter a Bundle ID");
      return;
    }

    setErrorMsg(null);
    try {
      await scanBundle({ bundleId: trimmedId }).unwrap();
      onClose();
      navigate(`/scanned-page?bundleId=${encodeURIComponent(trimmedId)}`);
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Bundle not found";
      setErrorMsg(message);
    }
  };

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
            onChange={(e) => {
              setBundleId(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            className="h-[55px] w-full rounded-xl border border-[#D0D5DD] px-4 text-xl font-medium outline-none"
          />
          {errorMsg && (
            <p className="mt-2 text-sm font-medium text-red-600">{errorMsg}</p>
          )}
        </div>

        <div className="mx-auto mt-16 grid max-w-[660px] grid-cols-2 gap-6">
          <button
            onClick={() => {
              setErrorMsg(null);
              onClose();
            }}
            className="h-[55px] rounded-lg bg-[#D4D4D4] text-[24px] font-semibold text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleScan}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 h-[55px] rounded-lg bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_100%)] text-[24px] font-semibold text-white disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
            Scan
          </button>
        </div>
      </div>
    </div>
  );
}