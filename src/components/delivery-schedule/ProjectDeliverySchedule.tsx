import { useState } from "react";
import { useParams } from "react-router-dom";
import TitleSubtitle from "../common_components/TitleSubtitle";
import { QrCode, Loader2 } from "lucide-react";
import NextDeliveryCard, { type DeliveryCardData } from "../dashbord/NextDeliveryCard";
import ScanQrModal from "./ScanQrModal";
import CustomSelect from "../common_components/CustomSelect";
import { useGetDeliveriesQuery } from "@/redux/api/deliveriesApi";
import { useGetProjectsQuery } from "@/redux/api/projectsApi";

const ProjectDeliverySchedule = () => {
  const { id: paramProjectId } = useParams();
  const [scanModal, setScanModal] = useState(false);
  const [bundleId, setBundleId] = useState("BND-001");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedProject, setSelectedProject] = useState(paramProjectId || "");

  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjectsQuery({ page: 1, limit: 100 });
  const projectsList = projectsData?.projects || [];

  const { data, isLoading } = useGetDeliveriesQuery({
    tab: activeTab,
    project: selectedProject ? selectedProject : undefined,
  });

  const projectOptions = [
    { label: "All Projects", value: "" },
    ...projectsList.map((p) => ({
      label: p.projectName || p.jobId || p.projectId,
      value: p._id || p.projectId,
    })),
  ];

  const projectDisplayOptions = projectOptions.map((p) => p.label);

  const handleProjectChange = (label: string) => {
    const found = projectOptions.find((p) => p.label === label);
    setSelectedProject(found ? found.value : "");
  };

  const currentProjectLabel =
    projectOptions.find((p) => p.value === selectedProject)?.label || "All Projects";

  const tabs = [
    {
      id: "upcoming",
      label: "Upcoming Deliveries",
      count: data?.tabs?.upcoming ?? 0,
    },
    {
      id: "past",
      label: "Past Deliveries",
      count: data?.tabs?.past ?? 0,
    },
    {
      id: "rescheduled",
      label: "Rescheduled Deliveries",
      count: data?.tabs?.rescheduled ?? 0,
    },
  ];

  const filteredDeliveries: DeliveryCardData[] = (data?.deliveries || [])
    .filter((delivery) => {
      if (!statusFilter || statusFilter === "All Status") return true;
      if (statusFilter.toLowerCase() === "upcoming") return delivery.status === "scheduled" || delivery.status === "in_transit";
      if (statusFilter.toLowerCase() === "today") {
        if (!delivery.deliveryDate) return false;
        const delDate = new Date(delivery.deliveryDate).toDateString();
        const todayDate = new Date().toDateString();
        return delDate === todayDate;
      }
      if (statusFilter.toLowerCase() === "past") return delivery.status === "delivered";
      return true;
    })
    .map((delivery) => {
      return {
        title: delivery.description || delivery.deliveryNumber || "Delivery",
        description: delivery.description || "",
        deliveryId: delivery.deliveryId,
        status: delivery.status === "in_transit" ? "inTransit" : (delivery.status || "scheduled"),
        deliveryInfo: {
          date: delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString("en-US", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }) : "-",
          trackingStatus: delivery.status === "in_transit" ? "Out for Delivery" : "-",
          eta: "-",
          timeWindow: delivery.timings || "-",
          company: delivery.deliveryCompany?.name || "-",
          driver: delivery.deliveryCompany?.driver || "-",
          driverPhone: delivery.deliveryCompany?.phone || "-",
          estimatedWeight: delivery.estimatedWeight ? `${delivery.estimatedWeight.toLocaleString()} lbs` : "-",
          equipment: delivery.loadingEquipment || [],
        },
        siteContact: {
          name: delivery.siteContact?.name || "-",
          phone: delivery.siteContact?.phone || "-",
          instructions: delivery.siteInstructions || "-",
          specialNotes: delivery.specialNotes || "-",
        },
        logistics: {
          company: delivery.deliveryCompany?.name || "-",
          driver: delivery.deliveryCompany?.driver || "-",
          phone: delivery.deliveryCompany?.phone || "-",
          communications: [],
        },
        rescheduleInfo: delivery.status === "rescheduled" ? {
          previousDate: delivery.pickupDate ? new Date(delivery.pickupDate).toLocaleDateString() : "-",
          newDate: delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : "-",
          reason: delivery.specialNotes || "Rescheduled",
        } : undefined,
        loadSummary: delivery.loadAndBundle ? {
          loadId: delivery.loadAndBundle.loadId,
          bundleCount: delivery.loadAndBundle.bundleCount,
          truckNumber: delivery.loadAndBundle.truckNumber,
          totalWeight: delivery.loadAndBundle.totalWeight
        } : undefined,
      };
    });

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TitleSubtitle
          title="Project Delivery Schedule"
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
        <div className="flex flex-wrap items-center gap-4">
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

          <div className="min-w-55 ml-auto flex items-center gap-3">
            <div className="w-55">
              <CustomSelect
                placeholder="Select Project"
                value={currentProjectLabel}
                onChange={handleProjectChange}
                options={projectDisplayOptions}
              />
            </div>
            <div className="w-44">
              <CustomSelect
                placeholder="All Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={["All Status", "Upcoming", "Today", "Past"]}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading || isProjectsLoading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="flex h-[30vh] flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500 font-medium text-lg">No deliveries found</p>
          <p className="text-gray-400 text-sm mt-1">There are no deliveries in this tab at the moment.</p>
        </div>
      ) : (
        filteredDeliveries.map((delivery) => (
          <NextDeliveryCard key={delivery.deliveryId} data={delivery} />
        ))
      )}
    </div>
  );
};

export default ProjectDeliverySchedule;
