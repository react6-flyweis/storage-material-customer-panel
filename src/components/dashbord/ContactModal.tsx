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
  deliveryData: {
    title: string;
    deliveryId: string;
    status: string;
    deliveryInfo: {
      company: string;
      driver: string;
      driverPhone: string;
    };
    siteContact: {
      name: string;
      phone: string;
    };
    logistics: {
      company: string;
      driver: string;
      phone: string;
    };
  };
}

export default function ContactModal({
  open,
  type,
  onClose,
  deliveryData,
}: ContactModalProps) {
  if (!open || !deliveryData) return null;

  const isDriver = type === "driver";
  
  const statusLabel = deliveryData.status === "inTransit" 
    ? "In Transit" 
    : deliveryData.status.charAt(0).toUpperCase() + deliveryData.status.slice(1);

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
            {deliveryData.title}
          </p>

          <p className="mt-2 text-sm text-[#4A5565]">
            {deliveryData.deliveryId}
          </p>

          <p className="mt-2 text-sm font-semibold text-[#155DFC]">
            Status: {statusLabel}
          </p>
        </div>

        {isDriver ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <InfoCard
              icon={<User />}
              bg="bg-[#DDF5E5]"
              color="text-[#16A34A]"
              label="Driver Name"
              value={deliveryData.deliveryInfo.driver}
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Driver Phone"
              value={deliveryData.deliveryInfo.driverPhone}
            />

            <InfoCard
              icon={<Truck />}
              bg="bg-[#F1E2FF]"
              color="text-[#9333EA]"
              label="Delivery Company"
              value={deliveryData.deliveryInfo.company}
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Company Phone"
              value={deliveryData.logistics.phone}
            />

            <InfoCard
              icon={<User />}
              bg="bg-[#DDF5E5]"
              color="text-[#16A34A]"
              label="Site Contact"
              value={deliveryData.siteContact.name}
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Site Phone"
              value={deliveryData.siteContact.phone}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <InfoCard
              icon={<User />}
              bg="bg-[#DDF5E5]"
              color="text-[#16A34A]"
              label="Company Driver Name"
              value={deliveryData.deliveryInfo.driver}
            />

            <InfoCard
              icon={<Phone />}
              bg="bg-[#DCE8FF]"
              color="text-[#2563EB]"
              label="Driver Phone"
              value={deliveryData.deliveryInfo.driverPhone}
            />

            <InfoCard
              icon={<Truck />}
              bg="bg-[#F1E2FF]"
              color="text-[#9333EA]"
              label="Delivery Company"
              value={deliveryData.deliveryInfo.company}
            />
          </div>
        )}

        <div
          className={`mt-10 grid gap-4 ${
            isDriver ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {isDriver && (
            <a
              href={`tel:${deliveryData.logistics.phone}`}
              className="flex items-center justify-center rounded-lg bg-[#9E9E9E] py-3 text-sm font-medium text-white text-center"
            >
              Call Dispatcher
            </a>
          )}

          <a
            href={`tel:${isDriver ? deliveryData.deliveryInfo.driverPhone : deliveryData.logistics.phone}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] py-3 text-sm font-medium text-white text-center"
          >
            <Phone size={18} />
            {isDriver ? "Call Driver" : "Call Now"}
          </a>

          <a
            href={`sms:${isDriver ? deliveryData.deliveryInfo.driverPhone : deliveryData.logistics.phone}`}
            className="flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium text-center"
          >
            <MessageSquare size={18} />
            Send SMS
          </a>
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