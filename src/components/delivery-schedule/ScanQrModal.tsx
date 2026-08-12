import { Camera, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrContainerId = "reader";

  const extractIdFromScannedText = (text: string): string => {
    let trimmed = text.trim();
    if (!trimmed) return "";
    try {
      // Add scheme if missing but formatted as URL (e.g. domain.com/bundle/123)
      if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        if (trimmed.includes("/")) {
          trimmed = "https://" + trimmed;
        }
      }

      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const parsedUrl = new URL(trimmed);

        // 1. Check search parameters
        const bundleIdParam = parsedUrl.searchParams.get("bundleId") || parsedUrl.searchParams.get("id");
        if (bundleIdParam) {
          return bundleIdParam;
        }

        // 2. Check pattern domain.com/bundle/:bundleId or /bundle-details/:id
        const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
        const bundleIdx = pathSegments.findIndex(
          (seg) => seg.toLowerCase() === "bundle" || seg.toLowerCase() === "bundles"
        );

        if (bundleIdx !== -1 && bundleIdx + 1 < pathSegments.length) {
          return decodeURIComponent(pathSegments[bundleIdx + 1]);
        }

        // 3. Fallback to last path segment if present
        if (pathSegments.length > 0) {
          return decodeURIComponent(pathSegments[pathSegments.length - 1]);
        }
      }
    } catch {
      // Fall back to original text if URL parsing fails
    }
    return text.trim();
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping camera:", err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      stopCamera();
      setErrorMsg(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    const extractedId = extractIdFromScannedText(decodedText);
    if (extractedId) {
      setBundleId(extractedId);
      await stopCamera();
      processBundleScan(extractedId);
    }
  };

  const startCamera = async () => {
    setErrorMsg(null);
    setIsScanning(true);

    setTimeout(async () => {
      try {
        if (scannerRef.current) {
          await stopCamera();
        }
        const html5QrCode = new Html5Qrcode(qrContainerId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          () => {
            // Ignore scan errors per frame
          }
        );
      } catch (err: any) {
        console.error("Camera access failed:", err);
        setErrorMsg(
          typeof err === "string"
            ? err
            : err?.message || "Failed to access camera. Please allow camera permissions."
        );
        setIsScanning(false);
      }
    }, 100);
  };

  const processBundleScan = async (idToScan: string) => {
    const trimmedId = idToScan.trim();
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

  const handleManualScan = () => {
    const extractedId = extractIdFromScannedText(bundleId);
    setBundleId(extractedId);
    processBundleScan(extractedId);
  };

  const handleClose = async () => {
    await stopCamera();
    setErrorMsg(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[620px] rounded-2xl bg-white p-8 shadow-xl">
        <div className="relative flex flex-col items-center text-center">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 text-gray-400 hover:text-black"
          >
            <X size={24} />
          </button>
          <h2 className="text-[28px] font-bold text-black">
            Scan Delivery QR
          </h2>
          <p className="mt-2 max-w-[460px] text-center text-[15px] leading-relaxed text-[#475467]">
            Scan the QR code attached to the delivery challan or shipment label to verify the delivered materials.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center">
          {isScanning ? (
            <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-gray-300">
              <div id={qrContainerId} className="w-full" />
              <button
                onClick={stopCamera}
                className="w-full bg-red-600 py-3 text-center text-base font-semibold text-white hover:bg-red-700"
              >
                Stop Camera
              </button>
            </div>
          ) : (
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_100%)] px-6 py-3.5 text-[18px] font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
            >
              <Camera size={22} />
              Camera Scan
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-5 rounded-xl bg-[#E8F5E9] px-6 py-3.5 text-center">
          <p className="text-[13px] leading-relaxed text-[#2E7D32]">
            Point your camera toward the QR code. The system will automatically identify your delivery.
          </p>
        </div>

        {/* OR Divider */}
        <div className="my-6 flex items-center justify-center gap-4">
          <div className="h-[1px] flex-1 bg-[#333333]" />
          <span className="text-[14px] font-semibold tracking-wide text-[#333333]">
            OR
          </span>
          <div className="h-[1px] flex-1 bg-[#333333]" />
        </div>

        {/* Manual Input */}
        <div>
          <label className="mb-2 block text-[15px] font-semibold text-[#101828]">
            Enter Bundle ID
          </label>

          <input
            value={bundleId}
            onChange={(e) => {
              const val = e.target.value;
              setBundleId(val);
              if (errorMsg) setErrorMsg(null);
            }}
            // placeholder="BND-001"
            className="h-[48px] w-full rounded-lg border border-[#EAECF0] px-4 text-[16px] font-medium text-[#101828] placeholder-[#667085] outline-none focus:border-[#2563EB]"
          />
          {errorMsg && (
            <p className="mt-2 text-sm font-medium text-red-600">{errorMsg}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={handleClose}
            className="h-[48px] rounded-xl bg-[#CCCCCC] text-[18px] font-semibold text-white hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleManualScan}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 h-[48px] rounded-xl bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_100%)] text-[18px] font-semibold text-white disabled:opacity-60 hover:opacity-95 transition-opacity"
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            Scan
          </button>
        </div>
      </div>
    </div>
  );
}