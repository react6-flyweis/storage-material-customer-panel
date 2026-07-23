

import {
  Truck,
  CalendarDays,
  Clock3,
  Package,
  User,
  Phone,
  AlertCircle,
  FileText,
  Eye,
  MessageSquare,
  Download,
  Mail,
  Clock4,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

import ContactModal from "./ContactModal";
import DocumentModal from "./DocumentModal";
import CalendarModal from "./CalendarModal";
import CallbackModal from "./CallbackModal";
import SiteConfirmedModal from "./SiteConfirmedModal";
import FullDeliveryInstructionModal from "./FullDeliveryInstructionModal";
import EmailConfirmationModal from "./EmailConfirmationModal";
import ConfirmEquipmentModal from "./ConfirmEquipmentModal";
import AcknowledgeRescheduleModal from "./AcknowledgeRescheduleModal";
import { cn } from "@/lib/utils";

export const statusConfig = {
  inTransit: {
    label: "In Transit",
    bg: "bg-[#DCE8FF]",
    text: "text-[#1D4ED8]",
    icon: Truck,
  },
  scheduled: {
    label: "Scheduled",
    bg: "bg-[#DCE8FF]",
    text: "text-[#1D4ED8]",
    icon: Clock4,
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-[#DDF5E5]",
    text: "text-[#00A63E]",
    icon: CheckCircle2,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-[#F2F4F7]",
    text: "text-[#344054]",
    icon: CheckCircle2,
  },
  rescheduled: {
    label: "Rescheduled",
    bg: "bg-[#DCE8FF]",
    text: "text-[#1D4ED8]",
    icon: Clock4,
  },
};

export interface DeliveryCardData {
  className?: string;
  title: string;
  description: string;
  deliveryId: string;
  status: string;
  deliveryInfo: {
    date: string;
    trackingStatus: string;
    eta: string;
    timeWindow: string;
    company: string;
    driver: string;
    driverPhone: string;
    estimatedWeight: string;
    equipment: string[];
  };
  siteContact: {
    name: string;
    phone: string;
    instructions: string;
    specialNotes: string;
    address?: string;
  };
  logistics: {
    company: string;
    driver: string;
    phone: string;
    communications: string[];
  };
  rescheduleInfo?: {
    previousDate: string;
    newDate: string;
    reason: string;
  };
  loadSummary?: {
    loadId: string;
    bundleCount: number | null;
    truckNumber: string | null;
    totalWeight: number;
  };
  isSite?: boolean;
  siteStatus?: {
    siteReady: boolean;
  };
}

type NextDeliveryCardProps = {
  data: DeliveryCardData;
  dashboardpage?: boolean;
};

export default function NextDeliveryCard({
  data,
  dashboardpage,
}: NextDeliveryCardProps) {
  const [documentModal, setDocumentModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [callbackModal, setCallbackModal] = useState(false);
  const [fullInstructionModal, setFullInstructionModal] = useState(false);
  const [siteConfirmedModal, setSiteConfirmedModal] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [confirmEquipmentModal, setConfirmEquipmentModal] = useState(false);
  const [openAcknowledgeModal, setOpenAcknowledgeModal] = useState(false);
  const [contactModal, setContactModal] = useState<{
    open: boolean;
    type: "driver" | "company";
  }>({
    open: false,
    type: "driver",
  });

  const statusKey = (data.status in statusConfig
    ? data.status
    : "scheduled") as keyof typeof statusConfig;

  const StatusIcon = statusConfig[statusKey].icon;

  return (
    <div
      className={cn("rounded-lg border p-4 sm:p-5 bg-white", data.status === "inTransit" ? "border-lime-300 bg-[#F8FBF0]" : "")}
    >
      {dashboardpage && (
        <button className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white mb-4">
          Scan Bundle / QR Code
        </button>
      )}

      {data.status === "rescheduled" && (
        <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-4 sm:p-5 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#9A3412]">
                Delivery Rescheduled
              </h3>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 text-sm font-medium text-[#C2410C]">
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>Previous Date: {data.rescheduleInfo?.previousDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>New Date: {data.rescheduleInfo?.newDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>Reason: {data.rescheduleInfo?.reason}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenAcknowledgeModal(true)}
              className="h-10 shrink-0 rounded-lg bg-[#EA580C] px-6 text-sm font-semibold text-white transition-all hover:bg-[#C2410C] shadow-sm"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-lg shadow-md shrink-0
  ${data.status === "delivered"
              ? "bg-[#667085]"
              : data.status === "rescheduled"
                ? "bg-[#22C55E]"
                : "bg-gradient-to-br from-[#22C55E] to-[#16A34A]"
            }`}
        >
          <Truck className="h-7 w-7 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[20px] font-bold leading-tight">
              {data.status != "delivered" && (
                <span className="text-[#00A63E]">Next Delivery :</span>
              )}
              <span className="text-[#101828]"> {data.title}</span>
            </h2>

            <span
              className={`rounded-full flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${statusConfig[statusKey].bg} ${statusConfig[statusKey].text}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {statusConfig[statusKey].label}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4A5565] mt-0.5">{data.description}</p>

          <p className="text-xs sm:text-sm text-[#4A5565]">
            Delivery ID: {data.deliveryId}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Delivery Info */}
        <div>
          <h3 className="mb-4 text-[16px] font-bold text-[#101828]">
            Delivery Information
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DCE8FF]">
                <CalendarDays className="h-5 w-5 text-[#2563EB]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Delivery Date</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.deliveryInfo.date}
                </p>
                {data.deliveryInfo.trackingStatus && (
                  <p className="mt-0.5 text-xs font-semibold text-[#101828]">
                    🚚 {data.deliveryInfo.trackingStatus}
                    {" ("}📍 {data.deliveryInfo.eta}
                    {")"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#EAD9FF]">
                <Clock3 className="h-5 w-5 text-[#9333EA]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Time Window</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.deliveryInfo.timeWindow}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DDF5E5]">
                <Truck className="h-5 w-5 text-[#00A63E]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Delivery Company</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.deliveryInfo.company}
                </p>

                <p className="text-xs text-[#4A5565]">
                  Driver: {data.deliveryInfo.driver} •{" "}
                  {data.deliveryInfo.driverPhone}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#FFEAD5]">
                <Package className="h-5 w-5 text-[#F97316]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Estimated Weight</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.deliveryInfo.estimatedWeight}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DDF5E5]">
                <Truck className="h-5 w-5 text-[#00A63E]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#101828]">
                  Required Equipment
                </p>

                {data.deliveryInfo.equipment.map((item) => (
                  <p key={item} className="text-xs text-[#4A5565]">
                    ✔ {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Site Contact */}
        <div>
          <h3 className="mb-4 text-[16px] font-bold text-[#101828]">
            Site Contact & Instructions
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DCE8FF]">
                <User className="h-5 w-5 text-[#2563EB]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Site Contact</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.siteContact.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DDF5E5]">
                <Phone className="h-5 w-5 text-[#00A63E]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Contact Phone</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.siteContact.phone}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#F6D76A] bg-[#FFF8E6] p-3.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" />

                <div>
                  <p className="text-xs font-semibold text-[#894B00]">
                    Site Instructions:
                  </p>

                  <p className="text-xs text-[#733E0A]">
                    {data.siteContact.instructions}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#B7CCFF] bg-[#EEF4FF] p-3.5">
              <div className="flex items-start gap-2.5">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" />

                <div>
                  <p className="text-xs font-semibold text-[#1D4ED8]">
                    Special Notes:
                  </p>

                  <p className="text-xs text-[#1E40AF]">
                    {data.siteContact.specialNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div>
          <h3 className="mb-4 text-[16px] font-bold text-[#101828] truncate">
            Delivery Company: {data.logistics.company}
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DCE8FF]">
                <User className="h-5 w-5 text-[#2563EB]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Driver</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.logistics.driver}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-[#DDF5E5]">
                <Phone className="h-5 w-5 text-[#00A63E]" />
              </div>

              <div>
                <p className="text-xs text-[#4A5565]">Contact Phone</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {data.logistics.phone}
                </p>
              </div>
            </div>

            {dashboardpage ? (
              <div>
                <h4 className="mb-2 text-[15px] font-bold text-[#101828]">
                  Delivery Communication
                </h4>

                <div className="space-y-1.5 text-xs font-semibold text-[#101828]">
                  {data.logistics.communications.map((item) => (
                    <p key={item}>* {item}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="mb-2 text-[15px] font-bold text-[#101828]">
                  Load & Bundle Summary
                </h4>

                <div className="grid grid-cols-2 gap-2.5 text-xs text-[#101828]">
                  <div>
                    <p className="text-xs text-[#4A5565]">Load ID</p>
                    <p className="text-sm font-semibold text-[#101828]">
                      {data.loadSummary?.loadId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5565]">Bundle Count</p>
                    <p className="text-sm font-semibold text-[#101828]">
                      {data.loadSummary?.bundleCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5565]">Truck Number</p>
                    <p className="text-sm font-semibold text-[#101828]">
                      {data.loadSummary?.truckNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5565]">Total Weight</p>
                    <p className="text-sm font-semibold text-[#101828]">
                      {data.loadSummary?.totalWeight}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {data.status !== "delivered" && data.status !== "inTransit" && (
        <div className="rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] p-4 my-6">
          <h3 className="mb-3 text-[16px] font-bold text-[#4338CA]">
            Site Readiness Status
          </h3>

          <div className="flex flex-col gap-4 lg:justify-between">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm sm:text-base font-medium">
              <div className="flex items-center gap-2 text-[#4F46E5]">
                <div
                  className={`h-3.5 w-3.5 rounded-full ${data.siteStatus?.siteReady ? "bg-[#22C55E]" : "bg-[#D1D5DB]"
                    }`}
                />
                <span>
                  Site Ready:{" "}
                  {data.siteStatus?.siteReady ? "Confirmed" : "Not Confirmed"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#4F46E5]">
                <div
                  className={`h-3.5 w-3.5 rounded-full ${data.siteStatus?.siteReady ? "bg-[#22C55E]" : "bg-[#D1D5DB]"
                    }`}
                />
                <span>
                  Equipment Ready:{" "}
                  {data.siteStatus?.siteReady ? "Confirmed" : "Not Confirmed"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSiteConfirmedModal(true)}
                className="h-[42px] bg-white rounded-lg border border-[#4F46E5] px-4 text-sm font-semibold text-[#4F46E5] transition-all hover:bg-[#4F46E5] hover:text-white shadow-sm"
              >
                Confirm Site Ready
              </button>

              <button
                onClick={() => setConfirmEquipmentModal(true)}
                className="h-[42px] bg-white rounded-lg border border-[#4F46E5] px-4 text-sm font-semibold text-[#4F46E5] transition-all hover:bg-[#4F46E5] hover:text-white shadow-sm"
              >
                Confirm Equipment
              </button>
            </div>
          </div>
        </div>
      )}

      {data.status != "delivered" && (<>

        <div className="my-5 border-t border-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() =>
              setContactModal({
                open: true,
                type: "driver",
              })
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] py-2 text-sm px-2 font-semibold text-white"
          >
            <Phone size={20} />
            Contact Driver
          </button>

          <button
            onClick={() =>
              setContactModal({
                open: true,
                type: "company",
              })
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] py-2 text-sm px-2 font-semibold text-white"
          >
            <Phone size={20} />
            Delivery Company
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white py-2 text-sm px-2 font-semibold text-[#101828]"
          >
            <Mail size={20} />
            Email Confirmation
          </button>

          <button
            onClick={() => setCalendarModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white py-2 text-sm px-2 font-semibold text-[#101828]"
          >
            <CalendarDays size={20} />
            Add to Calendar
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => setFullInstructionModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white py-2 text-sm px-2 font-semibold text-[#9333EA]"
          >
            <Eye size={20} />
            View Full Delivery Instructions
          </button>

          <button
            onClick={() => setCallbackModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white py-2 text-sm px-2 font-semibold text-[#3B5FB8]"
          >
            <MessageSquare size={20} />
            Request Call Back
          </button>

          <button
            onClick={() => setDocumentModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white py-2 text-sm px-2 font-semibold text-[#F97316]"
          >
            <Download size={20} />
            Download Info (PDF)
          </button>
        </div>
      </>)}

      <ContactModal
        open={contactModal.open}
        type={contactModal.type}
        deliveryData={data}
        onClose={() =>
          setContactModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
      <DocumentModal
        open={documentModal}
        deliveryData={data}
        onClose={() => setDocumentModal(false)}
      />
      <CalendarModal
        open={calendarModal}
        deliveryData={data}
        onClose={() => setCalendarModal(false)}
      />
      <CallbackModal
        open={callbackModal}
        deliveryData={data}
        onClose={() => setCallbackModal(false)}
      />
      <SiteConfirmedModal
        open={siteConfirmedModal}
        deliveryData={data}
        deliveryId={data.deliveryId}
        onClose={() => setSiteConfirmedModal(false)}
        confirmed={false}
      />
      <FullDeliveryInstructionModal
        open={fullInstructionModal}
        deliveryId={data.deliveryId}
        onClose={() => setFullInstructionModal(false)}
      />
      <EmailConfirmationModal
        open={isEmailModalOpen}
        deliveryData={data}
        onClose={() => setIsEmailModalOpen(false)}
      />
      <ConfirmEquipmentModal
        open={confirmEquipmentModal}
        deliveryData={data}
        deliveryId={data.deliveryId}
        onClose={() => setConfirmEquipmentModal(false)}
      />

      <AcknowledgeRescheduleModal
        open={openAcknowledgeModal}
        deliveryData={data}
        onClose={() => setOpenAcknowledgeModal(false)}
        onAcknowledge={() => {
          console.log("Acknowledged");
          setOpenAcknowledgeModal(false);
        }}
      />
    </div>
  );
}
