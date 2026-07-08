import {
  CheckCircle2,
  Mail,
  X,
} from "lucide-react";

interface EmailConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EmailConfirmationModal({
  open,
  onClose,
}: EmailConfirmationModalProps) {
  if (!open) return null;

  const details = [
    "Delivery date and time",
    "Driver contact information",
    "Site instructions",
    "Special notes",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[512px] max-h-[90vh] rounded-lg bg-white p-5 overflow-auto">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#3B5FB8]">
              <Mail
                size={24}
                className="text-white"
              />
            </div>

            <h2 className="text-[20px] font-bold text-[#101828]">
              Email Confirmation
            </h2>
          </div>

          <button onClick={onClose}>
            <X
              size={24}
              className="text-[#98A2B3]"
            />
          </button>
        </div>

        <div className="rounded-lg border-2 border-[#B2CCFF] bg-[#EEF4FF] p-3">
          <p className="mb-5 text-[16px] leading-8 text-[#1E429F]">
            A detailed delivery confirmation will be sent to your
            registered email address.
          </p>

          <div className="space-y-3">
            {details.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={22}
                  className="text-[#2563EB]"
                />

                <span className="text-[14px] text-[#1E429F]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border-2 border-[#B2CCFF] bg-[#F8FBFF] p-3">
            <p className="mb-2 text-[14px] font-semibold text-[#1D4ED8]">
              Site Contact
            </p>

            <h4 className="text-[20px] font-bold text-[#101828]">
              John Doe
            </h4>

            <p className="mt-1 text-[14px] text-[#667085]">
              0987654321
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#B2CCFF] bg-[#F8FBFF] p-3">
            <p className="mb-2 text-[14px] font-semibold text-[#1D4ED8]">
              Delivery Company Contact
            </p>

            <h4 className="text-[20px] font-bold text-[#101828]">
              Willum Manager
            </h4>

            <p className="mt-1 text-[14px] text-[#667085]">
              0987654321
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            {
              label: "Delivery ID:",
              value: "DEL-1001",
            },
            {
              label: "Item:",
              value: "Primary Frame Steel",
            },
            {
              label: "Date:",
              value: "Mar 25, 2026",
            },
            {
              label: "Time:",
              value: "08:00 - 12:00",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <span className="text-[14px] text-[#667085]">
                {item.label}
              </span>

              <span className="text-[14px] font-semibold text-[#101828]">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-[#F8FAFC] p-3">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[#DCEBFF]">
              <Mail
                size={24}
                className="text-[#2563EB]"
              />
            </div>

            <div>
              <p className="text-[14px] text-[#667085]">
                Send to
              </p>

              <p className="text-[16px] font-bold text-[#101828]">
                austin.mcclume@abclogistics.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-4">
          <button
            onClick={onClose}
            className="h-[56px] flex-1 rounded-lg border border-[#D0D5DD] text-[16px] font-medium text-[#101828]"
          >
            Cancel
          </button>

          <button className="h-[56px] flex-1 rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-[16px] font-medium text-white">
            <div className="flex items-center justify-center gap-3">
              <Mail size={20} />
              Send Email
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}