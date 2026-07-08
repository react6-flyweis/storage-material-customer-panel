import {
  Phone,
  User,
  Truck,
  MessageSquare,
  X,
} from "lucide-react";

interface ContactModalProps {
  open: boolean;
  type: "driver" | "company";
  onClose: () => void;
}

export default function ContactModal({
  open,
  type,
  onClose,
}: ContactModalProps) {
  if (!open) return null;

  const isDriver = type === "driver";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[512px] rounded-lg bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A]">
              <Phone className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              {isDriver
                ? "Contact Driver"
                : "Contact Delivery Company"}
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border-2 border-[#BEDBFF] bg-[#EFF6FF] p-5">
          <p className="text-xs font-semibold text-[#193CB8]">
            Delivery
          </p>

          <p className="mt-1 text-base font-bold text-[#101828]">
            Primary Frame Steel
          </p>

          <p className="mt-2 text-sm text-[#4A5565]">
            DEL-1001
          </p>

          <p className="mt-2 text-sm font-semibold text-[#155DFC]">
            Status: Scheduled
          </p>
        </div>

        {isDriver ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <InfoCard
              icon={<User />}
              bg="bg-[#DDF5E5]"
              color="text-[#16A34A]"
              label="Driver Name"
              value="John Driver"
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Driver Phone"
              value="(555) 999-8888"
            />

            <InfoCard
              icon={<Truck />}
              bg="bg-[#F1E2FF]"
              color="text-[#9333EA]"
              label="Delivery Company"
              value="FastFreight Logistics"
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Company Phone"
              value="(555) 7677-654"
            />

            <InfoCard
              icon={<User />}
              bg="bg-[#DDF5E5]"
              color="text-[#16A34A]"
              label="Site Contact"
              value="Mike Roberts"
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Site Contact"
              value="(555) 999-8888"
            />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <InfoCard
              icon={<User />}
              bg="bg-[#DDF5E5]"
              color="text-[#16A34A]"
              label="Company Manager Name"
              value="John Doe"
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Manager Phone"
              value="(555) 999-8888"
            />

            <InfoCard
              icon={<Truck />}
              bg="bg-[#F1E2FF]"
              color="text-[#9333EA]"
              label="Delivery Company"
              value="FastFreight Logistics"
            />
          </div>
        )}

        <div
          className={`mt-10 grid gap-4 ${
            isDriver ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {isDriver && (
            <button className="rounded-lg bg-[#9E9E9E] py-3 text-sm font-medium text-white">
              Call Dispatcher
            </button>
          )}

          <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] py-3 text-sm font-medium text-white">
            <Phone size={18} />
            {isDriver ? "Call Driver" : "Call Now"}
          </button>

          <button className="flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium">
            <MessageSquare size={18} />
            Send SMS
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  bg,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${bg} ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-[#4A5565]">{label}</p>
        <p className="text-base font-semibold text-[#101828]">
          {value}
        </p>
      </div>
    </div>
  );
}