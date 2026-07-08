import {
  Mail,
  Phone,
  User,
  Square,
  AlertTriangle,
  X,
  CheckSquare2,
} from "lucide-react";

interface SiteConfirmedModalProps {
  open: boolean;
  onClose: () => void;
  confirmed: boolean;
}

export default function SiteConfirmedModal({
  open,
  onClose,
  confirmed,
}: SiteConfirmedModalProps) {
  if (!open) return null;

  const checklist = [
    "Site area cleared and accessible",
    "Access route to delivery location is available",
    "Safety measures are in place",
    "Personnel are ready to receive delivery",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[992px] rounded-lg max-h-[90vh] overflow-y-auto scroll-hide bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#101828]">
              {confirmed ? "Site Confirmed" : "Confirm Site Ready"}
            </h2>
            <p className="mt-1 text-base text-[#4A5565]">
              Confirmed at: March 25, 10:30 AM
            </p>
          </div>
          <button onClick={onClose}>
            <X className="h-7 w-7 text-[#98A2B3]" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-3 grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="mt-7">
            {/* Delivery Info */}
            <div className="rounded-lg border-2 border-[#BEDBFF] bg-[#EFF6FF] p-5">
              <p className="text-xs font-semibold text-[#193CB8]">Delivery</p>
              <p className="mt-2 text-base font-bold text-[#101828]">
                Primary Frame Steel
              </p>
              <p className="mt-2 text-sm text-[#4A5565]">DEL-1001</p>
              {!confirmed && (
                <p className="mt-2 text-sm font-semibold text-[#193CB8]">
                  Status: Scheduled
                </p>
              )}
            </div>

            {/* Required for Delivery — only in confirmed view */}
            {confirmed && (
              <div className="mt-4 rounded-lg border-2 border-[#DCC5FF] bg-[#FAF5FF] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 text-[#6B21A8]" />
                  <div>
                    <p className="text-sm font-semibold text-[#6B21A8]">
                      REQUIRED FOR DELIVERY:
                    </p>
                    <p className="mt-2 text-sm text-[#6B21A8]">
                      ✔ 5000 lb Forklift, ✔ Crane, ✔ Safety Gear
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-[#BEDBFF] p-3"
                >
                  {confirmed ? (
                    <CheckSquare2 size={18} className="text-[#6B4FA3]" />
                  ) : (
                    <Square size={18} className="text-[#98A2B3]" />
                  )}
                  <span className="text-base font-medium text-[#333333]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border-2 border-[#BEDBFF] bg-[#EFF6FF] p-5">
              <p className="text-xs font-semibold text-[#193CB8]">
                {confirmed ? "Confirmed By" : "Who is confirming?"}
              </p>
              <p className="mt-2 text-base font-bold text-[#101828]">
                Customer Name
              </p>
              <p className="mt-2 text-sm text-[#4A5565]">Auto-filled user</p>
            </div>

            {/* Action Buttons — only in unconfirmed view */}
            {!confirmed && (
              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-lg bg-[#16A34A] py-3 text-base font-semibold text-white hover:bg-[#15803D] transition-colors">
                  Confirm Site Ready
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-[#D0D5DD] py-3 text-base font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Right Column — Contact Information */}
          <div>
            <h3 className="text-[20px] font-bold text-[#667085]">
              Contact Information
            </h3>

            <div className="space-y-3">
              <InfoSection
                title="Receiving POC"
                rows={[
                  {
                    icon: <User className="h-5 w-5 text-[#155DFC]" />,
                    bg: "#DCE8FF",
                    label: "Receiver Name",
                    value: "Mike Roberts",
                  },
                  {
                    icon: <Phone className="h-5 w-5 text-[#16A34A]" />,
                    bg: "#DDF5E5",
                    label: "Contact Phone",
                    value: "(555) 123-4567",
                  },
                  {
                    icon: <Mail className="h-5 w-5 text-[#16A34A]" />,
                    bg: "#DDF5E5",
                    label: "Contact Mail",
                    value: "mike@company.com",
                  },
                ]}
              />

              <InfoSection
                title="Delivery Team"
                rows={[
                  {
                    icon: <User className="h-5 w-5 text-[#155DFC]" />,
                    bg: "#DCE8FF",
                    label: "Delivery Company",
                    value: "FastFreight Logistics",
                  },
                  {
                    icon: <Phone className="h-5 w-5 text-[#16A34A]" />,
                    bg: "#DDF5E5",
                    label: "Contact Phone",
                    value: "(555) 123-4567",
                    subValue: "Driver: John Driver",
                  },
                ]}
              />

              <InfoSection
                title="Site Contact"
                rows={[
                  {
                    icon: <User className="h-5 w-5 text-[#155DFC]" />,
                    bg: "#DCE8FF",
                    label: "Site Manager",
                    value: "Riya Sharma",
                  },
                  {
                    icon: <Phone className="h-5 w-5 text-[#16A34A]" />,
                    bg: "#DDF5E5",
                    label: "Contact Phone",
                    value: "(555) 123-4567",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  title,
  rows,
}: {
  title: string;
  rows: {
    icon: React.ReactNode;
    bg: string;
    label: string;
    value: string;
    subValue?: string;
  }[];
}) {
  return (
    <div className="rounded-lg border border-[#F3CC97] p-4">
      <h4 className="mb-3 text-[20px] font-bold text-[#101828]">{title}</h4>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: row.bg }}
            >
              {row.icon}
            </div>
            <div>
              <p className="text-sm text-[#4A5565]">{row.label}</p>
              <p className="text-base font-semibold text-[#101828]">
                {row.value}
              </p>
              {row.subValue && (
                <p className="text-sm text-[#4A5565]">{row.subValue}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}