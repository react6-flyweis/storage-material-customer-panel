"use client";

import { useState } from "react";
import { X, User, Phone, ShieldAlert } from "lucide-react";

interface ConfirmEquipmentModalProps {
  open: boolean;
  onClose: () => void;
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
}: ConfirmEquipmentModalProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleToggle = (item: string) => {
    setError("");

    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const handleConfirm = () => {
    if (checkedItems.length !== checklistItems.length) {
      setError("Please confirm all equipment availability requirements.");
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[900px] rounded-lg bg-white p-5">
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
                Primary Frame Steel
              </h3>

              <p className="mt-2 text-[16px] text-[#667085]">DEL-1001</p>

              <p className="mt-2 text-[16px] font-semibold text-[#2563EB]">
                Status: Scheduled
              </p>
            </div>

            <div className="mt-3 rounded-lg border-2 border-[#D8B4FE] bg-[#FAF5FF] p-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-[#6B21A8]" />

                <h4 className="text-[16px] font-bold text-[#6B21A8]">
                  REQUIRED FOR DELIVERY:
                </h4>
              </div>

              <ul className="mt-4 ml-10 list-disc space-y-1 text-[16px] text-[#6B21A8]">
                <li>5000 lb Forklift</li>
                <li>Crane</li>
                <li>Safety Gear</li>
              </ul>
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
                onClick={handleConfirm}
                className="h-[48px] rounded-lg bg-[#22C55E] text-[16px] font-medium text-white"
              >
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
                name="FastFreight Logistics"
                phone="(555) 123-4567"
                extra="Driver: John Driver"
              />

              <ContactCard
                title="Receiving POC"
                label="Receiver Name"
                name="John Doe"
                phone="(555) 123-4567"
              />

              <ContactCard
                title="Site Contact"
                label="Site Manager"
                name="Riya Sharma"
                phone="(555) 123-4567"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
