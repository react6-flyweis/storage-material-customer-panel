import { useState } from "react";
import TitleSubtitle from "../common_components/TitleSubtitle";
import { QrCode } from "lucide-react";
import NextDeliveryCard from "../dashbord/NextDeliveryCard";
import ScanQrModal from "./ScanQrModal";
import CustomSelect from "../common_components/CustomSelect";

const deliveries = [
  {
    className:
      "border border-lime-300 bg-[#F8FBF0] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
    deliveryId: "DEL-1001",
    title: "Primary Frame Steel",
    description: "Main structural steel beams for warehouse frame",
    status: "inTransit",
    deliveryInfo: {
      date: "Wednesday, March 25, 2026",
      trackingStatus: "Out for Delivery",
      eta: "Arriving in 45 mins",
      timeWindow: "08:00 - 12:00",
      company: "FastFreight Logistics",
      driver: "John Driver",
      driverPhone: "(555) 999-8888",
      estimatedWeight: "45,000 lbs",
      equipment: ["5,000 lb Forklift required", "Crane needed"],
    },
    siteContact: {
      name: "Mike Roberts",
      phone: "(555) 123-4567",
      email: "mike@test.com",
      address: "Warehouse A",
      instructions: "Keep materials dry, covered storage area",
      specialNotes: "Weather protection required",
    },
    logistics: {
      company: "ABC Logistics",
      driver: "John Doe",
      phone: "(555) 123-4567",
      communications: [
        "Confirmation sent ✔",
        "48hr reminder ✔",
        "24hr reminder ✔",
        "Reschedule notification ⚠",
      ],
    },
      loadSummary: {
    loadId: "LOAD-001",
    bundleCount: 6,
    truckNumber: "TX-4582",
    totalWeight: "36,000 lbs",
  },
  },

  {
    isSite: true,
    className:
      "border border-white bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
    deliveryId: "DEL-1002",
    title: "Roll-up Doors (3 units)",
    description: "Commercial grade roll-up doors",
    status: "confirmed",
    deliveryInfo: {
      date: "Thursday, March 26, 2026",
      trackingStatus: "",
      eta: "",
      timeWindow: "13:00 - 17:00",
      company: "QuickTransport Co.",
      driver: "Sarah Transport",
      driverPhone: "(555) 777-6666",
      estimatedWeight: "2,500 lbs",
      equipment: ["5,000 lb Forklift required", "Crane needed"],
    },
    siteContact: {
      name: "Mike Roberts",
      phone: "(555) 123-4567",
      email: "mike@test.com",
      address: "Warehouse B",
      instructions: "Keep materials dry, covered storage area",
      specialNotes: "Weather protection required",
    },
    logistics: {
      company: "ABC Logistics",
      driver: "John Doe",
      phone: "(555) 123-4567",
      communications: ["Confirmation sent ✔", "48hr reminder ✔"],
    },
      loadSummary: {
    loadId: "LOAD-001",
    bundleCount: 6,
    truckNumber: "TX-4582",
    totalWeight: "36,000 lbs",
  },
  },

  {
    isSite: true,
    className:
      "border border-white bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
    deliveryId: "DEL-1003",
    title: "Roll-up Doors (3 units)",
    description: "Commercial grade roll-up doors",
    status: "confirmed",
    deliveryInfo: {
      date: "Thursday, March 26, 2026",
      trackingStatus: "",
      eta: "",
      timeWindow: "13:00 - 17:00",
      company: "QuickTransport Co.",
      driver: "Sarah Transport",
      driverPhone: "(555) 777-6666",
      estimatedWeight: "2,500 lbs",
      equipment: ["5,000 lb Forklift required", "Crane needed"],
    },
    siteContact: {
      name: "Mike Roberts",
      phone: "(555) 123-4567",
      email: "mike@test.com",
      address: "Warehouse B",
      instructions: "Keep materials dry, covered storage area",
      specialNotes: "Weather protection required",
    },
    logistics: {
      company: "ABC Logistics",
      driver: "John Doe",
      phone: "(555) 123-4567",
      communications: ["Confirmation sent ✔", "48hr reminder ✔"],
    },
      loadSummary: {
    loadId: "LOAD-001",
    bundleCount: 6,
    truckNumber: "TX-4582",
    totalWeight: "36,000 lbs",
  },
  },

  {
  isSite: false,
  className:
    "border border-white bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
  deliveryId: "DEL-1005",
  title: "Trim & Hardware",
  description: "Finishing materials and fasteners",
  status: "delivered",

  deliveryInfo: {
    date: "Sunday, March 22, 2026",
    trackingStatus: "",
    eta: "",
    timeWindow: "10:00 - 14:00",
    company: "Local Delivery Services",
    driver: "Tom Local",
    driverPhone: "(555) 555-4444",
    estimatedWeight: "850 lbs",
    equipment: [
      "5,000 lb Forklift required",
      "Crane needed",
    ],
  },

  siteContact: {
    name: "Mike Roberts",
    phone: "(555) 123-4567",
    email: "mike@test.com",
    address: "Warehouse A",
    instructions:
      "Keep materials dry, covered storage area",
    specialNotes:
      "Weather protection required",
  },

  logistics: {
    company: "ABC Logistics",
    driver: "John Doe",
    phone: "(555) 123-4567",
    communications: [
      "Confirmation sent ✔",
      "48hr reminder ✔",
    ],
  },

  loadSummary: {
    loadId: "LOAD-001",
    bundleCount: 6,
    truckNumber: "TX-4582",
    totalWeight: "36,000 lbs",
  },
},

  {
  isSite: true,
  className:
    "border border-white bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
  deliveryId: "DEL-1006",
  title: "Insulation Materials",
  description: "Wall and roof insulation",
  status: "rescheduled",

  rescheduleInfo: {
    previousDate: "March 28",
    newDate: "March 29",
    reason: "Weather",
  },

  deliveryInfo: {
    date: "Sunday, March 29, 2026",
    trackingStatus: "",
    eta: "",
    timeWindow: "08:00 - 12:00",
    company: "Regional Freight",
    driver: "Carlos Freight",
    driverPhone: "(555) 333-2222",
    estimatedWeight: "12,000 lbs",
    equipment: [
      "5,000 lb Forklift required",
      "Crane needed",
    ],
  },

  siteContact: {
    name: "Mike Roberts",
    phone: "(555) 123-4567",
    email: "mike@test.com",
    address: "Warehouse A",
    instructions:
      "Keep materials dry, covered storage area",
    specialNotes:
      "Weather protection required",
  },

  logistics: {
    company: "ABC Logistics",
    driver: "John Doe",
    phone: "(555) 123-4567",
    communications: [
      "Reschedule notification ⚠",
    ],
  },

  loadSummary: {
    loadId: "LOAD-001",
    bundleCount: 6,
    truckNumber: "TX-4582",
    totalWeight: "36,000 lbs",
  },

  siteStatus: {
    siteReady: false,
    equipmentReady: false,
  },
}
];

const DeliverySchedule = () => {
  const [scanModal, setScanModal] = useState(false);
  const [bundleId, setBundleId] = useState("BND-001");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [status, setStatus] = useState("");
  const tabs = [
  {
    id: "upcoming",
    label: "Upcoming Deliveries",
    count: deliveries.filter(
      (d) =>
        d.status !== "delivered" &&
        d.status !== "rescheduled"
    ).length,
  },
  {
    id: "past",
    label: "Past Deliveries",
    count: deliveries.filter(
      (d) => d.status === "delivered"
    ).length,
  },
  {
    id: "rescheduled",
    label: "Rescheduled Deliveries",
    count: deliveries.filter(
      (d) => d.status === "rescheduled"
    ).length,
  },
];
  const filteredDeliveries = deliveries.filter((delivery) => {
  if (activeTab === "past") {
    return delivery.status === "delivered";
  }

  if (activeTab === "rescheduled") {
    return delivery.status === "rescheduled";
  }

  return (
    delivery.status !== "delivered" &&
    delivery.status !== "rescheduled"
  );
});
  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TitleSubtitle
          title="My Delivery Schedule"
          subtitle="Track your project deliveries and receive notifications."
        />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScanModal(true)}
            className="ml-auto flex w-fit min-w-[128px] items-center gap-2 rounded-lg bg-(--button-bg-primary-color) px-4 py-2.5 text-sm font-normal text-white transition-opacity hover:opacity-90 lg:mt-2"
          >
            <QrCode />
            Scan QR
          </button>
          <ScanQrModal
            open={scanModal}
            bundleId={bundleId}
            setBundleId={setBundleId}
            onClose={() => setScanModal(false)}
          />
          <button className="flex bg-white items-center gap-2 md:px-4 ml-auto lg:mt-2 mt-4 py-2.5 shadow border border-(--button-bg-primary-color) rounded-lg hover:opacity-90 transition-opacity text-sm font-normal min-w-[128px] w-fit">
            <div className="bg-(--button-bg-primary-color) text-white rounded-full w-10 h-10 flex items-center justify-center">
              AM
            </div>
            <div>
              <p className="text-start text-base font-semibold">
                Austin McClume
              </p>
              <p className="text-start text-[#4A5565]">
                ABC Logistics Warehouse
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#E4E7EC] bg-white p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-13 items-center gap-2 rounded-lg text-sm px-6 font-medium transition-all ${
                  isActive
                    ? "bg-[#3B66B8] text-white"
                    : "bg-[#F2F4F7] text-[#344054]"
                }`}
              >
                {tab.label}

                <span
                  className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#3B66B8] text-white"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

          <div className="min-w-55">
            <CustomSelect
              placeholder="All Status"
              value={status}
              onChange={setStatus}
              options={["All Status", "Upcoming", "Today", "Past"]}
            />
          </div>
        </div>
      </div>

      {filteredDeliveries.map((delivery) => (
        <NextDeliveryCard key={delivery.deliveryId} data={delivery} />
      ))}
    </div>
  );
};

export default DeliverySchedule;
