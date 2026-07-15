import {
  CheckCircle2,
  Mail,
  X,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useSendConfirmationEmailMutation } from "@/redux/api/deliveriesApi";

interface EmailConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  deliveryData: {
    title: string;
    deliveryId: string;
    status: string;
    deliveryInfo: {
      date: string;
      timeWindow: string;
      company: string;
      driver: string;
      driverPhone: string;
    };
    siteContact: {
      name: string;
      phone: string;
      email?: string;
    };
    logistics: {
      company: string;
      driver: string;
      phone: string;
    };
  };
}

export default function EmailConfirmationModal({
  open,
  onClose,
  deliveryData,
}: EmailConfirmationModalProps) {
  const loggedInEmail = useAppSelector((state) => state.auth.user?.email);
  const [sendConfirmationEmail, { isLoading }] = useSendConfirmationEmailMutation();

  if (!open || !deliveryData) return null;

  const handleSendEmail = async () => {
    try {
      await sendConfirmationEmail(deliveryData.deliveryId).unwrap();
      alert("Email confirmation sent successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to send email confirmation:", error);
      alert("Failed to send email confirmation. Please try again.");
    }
  };

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

            <h4 className="text-[20px] font-bold text-[#101828] truncate">
              {deliveryData.siteContact.name}
            </h4>

            <p className="mt-1 text-[14px] text-[#667085]">
              {deliveryData.siteContact.phone}
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#B2CCFF] bg-[#F8FBFF] p-3">
            <p className="mb-2 text-[14px] font-semibold text-[#1D4ED8]">
              Delivery Company Contact
            </p>

            <h4 className="text-[20px] font-bold text-[#101828] truncate">
              {deliveryData.deliveryInfo.company}
            </h4>

            <p className="mt-1 text-[14px] text-[#667085]">
              {deliveryData.logistics.phone}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            {
              label: "Delivery ID:",
              value: deliveryData.deliveryId,
            },
            {
              label: "Item:",
              value: deliveryData.title,
            },
            {
              label: "Date:",
              value: deliveryData.deliveryInfo.date,
            },
            {
              label: "Time:",
              value: deliveryData.deliveryInfo.timeWindow,
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

            <div className="min-w-0 flex-1">
              <p className="text-[14px] text-[#667085]">
                Send to
              </p>

              <p className="text-[16px] font-bold text-[#101828] truncate">
                {loggedInEmail || deliveryData.siteContact.email || "austin.mcclume@abclogistics.com"}
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

          <button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="h-[56px] flex-1 rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-[16px] font-medium text-white disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-3">
              <Mail size={20} />
              {isLoading ? "Sending..." : "Send Email"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}