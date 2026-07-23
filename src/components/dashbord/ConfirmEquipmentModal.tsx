"use client";

import { useState } from "react";
import { X, User, Phone, ShieldAlert, Loader2 } from "lucide-react";
import { useConfirmEquipmentMutation } from "@/redux/api/deliveriesApi";
import SuccessModal from "@/components/common_components/SuccessModal";
import type { DeliveryCardData } from "./NextDeliveryCard";

interface ConfirmEquipmentModalProps {
  open: boolean;
  onClose: () => void;
  deliveryId?: string;
  deliveryData?: DeliveryCardData;
  onSuccess?: () => void;
}

const checklistItems = [
  "Forklift/lifting equipment is available",
  "Crane or other heavy machinery (if required)",
  "Storage area is ready for materials",
  "Required tools and accessories are on site",
];

export default function ConfirmEquipmentModal({
  open,
  onClose,
  deliveryId = "DEL-1001",
  deliveryData,
  onSuccess,
}: ConfirmEquipmentModalProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [confirmEquipment, { isLoading }] = useConfirmEquipmentMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("Equipment confirmed");

  if (!open) return null;

  const currentDeliveryId = deliveryData?.deliveryId || deliveryId || "-";
  const title = deliveryData?.title || "-";
  const status = deliveryData?.status || "-";
  const equipmentList = deliveryData?.deliveryInfo?.equipment || [];

  const companyName = deliveryData?.logistics?.company || deliveryData?.deliveryInfo?.company || "-";
  const companyPhone = deliveryData?.logistics?.phone || "-";
  const driverName = deliveryData?.logistics?.driver || deliveryData?.deliveryInfo?.driver || "-";

  const receiverName = deliveryData?.siteContact?.name || "-";
  const receiverPhone = deliveryData?.siteContact?.phone || "-";

  const handleToggle = (item: string) => {
    setError("");

    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const handleConfirm = async () => {
    if (checkedItems.length !== checklistItems.length) {
      setError("Please confirm all equipment availability requirements.");
      return;
    }

    try {
      const res = await confirmEquipment({
        deliveryId: currentDeliveryId,
        checklist: {
          forkliftAvailable: true,
          craneOrHeavyMachineryAvailable: true,
          storageAreaReady: true,
          toolsAndAccessoriesOnSite: true,
        },
      }).unwrap();
      if (res?.message) {
        setSuccessMsg(res.message);
      }
      setShowSuccess(true);
    } catch (err) {
      console.error("Failed to confirm equipment", err);
      // Demo fallback to success modal
      setShowSuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onSuccess?.();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-[900px] max-h-[85vh] overflow-y-auto rounded-lg bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#101828]">
              Confirm Equipment
            </h2>

            <button onClick={onClose}>
              <X className="h-6 w-6 text-[#98A2B3]" />
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="mt-8">
              <div className="rounded-lg border-2 border-[#BFDBFE] bg-[#EFF6FF] p-3">
                <p className="text-[14px] font-semibold text-[#1D4ED8]">
                  Delivery
                </p>

                <h3 className="mt-2 text-[20px] font-bold text-[#101828]">
                  {title}
                </h3>

                <p className="mt-2 text-[16px] text-[#667085]">{currentDeliveryId}</p>

                <p className="mt-2 text-[16px] font-semibold text-[#2563EB] capitalize">
                  Status: {status}
                </p>
              </div>

              <div className="mt-3 rounded-lg border-2 border-[#D8B4FE] bg-[#FAF5FF] p-3">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-[#6B21A8]" />

                  <h4 className="text-[16px] font-bold text-[#6B21A8]">
                    REQUIRED FOR DELIVERY:
                  </h4>
                </div>

                {equipmentList.length > 0 ? (
                  <ul className="mt-4 ml-10 list-disc space-y-1 text-[16px] text-[#6B21A8]">
                    {equipmentList.map((eq) => (
                      <li key={eq}>{eq}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-[16px] text-[#6B21A8]">-</p>
                )}
              </div>

              <h3 className="mt-5 mb-1 text-[16px] font-bold text-[#101828]">
                Equipment Availability Checklist:
              </h3>

              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#BFDBFE] p-3"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item)}
                      onChange={() => handleToggle(item)}
                      className="h-4 w-4 accent-[#22C55E]"
                    />

                    <span className="text-[14px] font-medium text-[#101828]">
                      {item}
                    </span>
                  </label>
                ))}
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              <div className="mt-3 grid grid-cols-2 gap-4">
                <button
                  disabled={isLoading}
                  onClick={handleConfirm}
                  className="h-[48px] flex items-center justify-center gap-2 rounded-lg bg-[#22C55E] text-[16px] font-medium text-white disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  Confirm Equipment
                </button>

                <button
                  onClick={onClose}
                  className="h-[48px] rounded-lg border border-[#D0D5DD] text-[16px] font-medium text-[#101828]"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-[18px] font-semibold text-[#667085]">
                Contact Information
              </h3>

              <div className="space-y-3">
                <ContactCard
                  title="Delivery Team"
                  label="Delivery Company"
                  name={companyName}
                  phone={companyPhone}
                  extra={driverName !== "-" ? `Driver: ${driverName}` : undefined}
                />

                <ContactCard
                  title="Receiving POC"
                  label="Receiver Name"
                  name={receiverName}
                  phone={receiverPhone}
                />

                <ContactCard
                  title="Site Contact"
                  label="Site Manager"
                  name={receiverName}
                  phone={receiverPhone}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Equipment Confirmed"
        subTitle={successMsg}
      />
    </>
  );
}

function ContactCard({
  title,
  label,
  name,
  phone,
  extra,
}: {
  title: string;
  label: string;
  name: string;
  phone: string;
  extra?: string;
}) {
  return (
    <div className="rounded-lg border-2 border-[#FED7AA] p-3">
      <h4 className="mb-6 text-[18px] font-bold text-[#101828]">{title}</h4>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DBEAFE]">
            <User className="h-7 w-7 text-[#2563EB]" />
          </div>

          <div>
            <p className="text-sm text-[#667085]">{label}</p>

            <p className="text-[16px] font-semibold text-[#101828]">{name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DCFCE7]">
            <Phone className="h-7 w-7 text-[#22C55E]" />
          </div>

          <div>
            <p className="text-sm text-[#667085]">Contact Phone</p>

            <p className="text-[16px] font-semibold text-[#101828]">{phone}</p>

            {extra && <p className="text-sm text-[#667085]">{extra}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
