import {
  CalendarDays,
  Clock3,
  MapPin,
  Copy,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  useLazyGetDeliveryCalendarQuery,
  useGetDeliveryCalendarDetailsQuery,
} from "@/redux/api/deliveriesApi";

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  deliveryData: {
    title: string;
    description: string;
    deliveryId: string;
    deliveryInfo: {
      date: string;
      timeWindow: string;
      company: string;
      driver: string;
      driverPhone: string;
    };
    siteContact: {
      address?: string;
    };
  };
}

export default function CalendarModal({
  open,
  onClose,
  deliveryData,
}: CalendarModalProps) {
  const [triggerGetCalendar, { isFetching }] = useLazyGetDeliveryCalendarQuery();
  const { data: detailsData, isLoading: isLoadingDetails } = useGetDeliveryCalendarDetailsQuery(
    deliveryData.deliveryId,
    { skip: !open }
  );
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopyToClipboard = async () => {
    try {
      const calendarText = await triggerGetCalendar(deliveryData.deliveryId).unwrap();
      await navigator.clipboard.writeText(calendarText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy calendar text:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[520px] max-h-[85vh] overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316]">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              Add to Calendar
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border-2 border-[#F7C48A] bg-[#FFF8F1] p-5">
          <h3 className="text-base font-bold text-[#101828]">
            {deliveryData.title}
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-[#101828]">
              <CalendarDays
                size={18}
                className="text-[#F97316]"
              />
              {deliveryData.deliveryInfo.date}
            </div>

            <div className="flex items-center gap-3 text-sm text-[#101828]">
              <Clock3 size={18} className="text-[#F97316]" />
              {deliveryData.deliveryInfo.timeWindow}
            </div>

            {deliveryData.siteContact.address && (
              <div className="flex items-center gap-3 text-sm text-[#101828]">
                <MapPin size={18} className="text-[#F97316]" />
                {deliveryData.siteContact.address}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[#F8FAFC] p-5">
          <p className="text-sm font-semibold text-[#344054]">
            Event Description:
          </p>

          <p className="mt-3 text-sm text-[#101828]">
            {deliveryData.description}
          </p>

          <div className="my-4 border-t" />

          <div className="space-y-1 text-sm text-[#4A5565]">
            <p>Driver: {deliveryData.deliveryInfo.driver}</p>
            <p>Phone: {deliveryData.deliveryInfo.driverPhone}</p>
            <p>Delivery Company: {deliveryData.deliveryInfo.company}</p>
            <p>Delivery ID: {deliveryData.deliveryId}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-base font-semibold text-[#101828]">
            Select Calendar Type:
          </h4>

          <div className="space-y-3">
            {isLoadingDetails ? (
              <div className="text-sm text-slate-500 py-3 text-center">Loading calendar options...</div>
            ) : (
              <>
                {detailsData?.googleCalendarUrl && (
                  <button
                    onClick={() => window.open(detailsData.googleCalendarUrl, "_blank")}
                    className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium text-[#101828]"
                  >
                    <CalendarDays size={18} className="text-[#4285F4]" />
                    Add to Google Calendar
                  </button>
                )}

                {detailsData?.outlookCalendarUrl && (
                  <button
                    onClick={() => window.open(detailsData.outlookCalendarUrl, "_blank")}
                    className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium text-[#101828]"
                  >
                    <CalendarDays size={18} className="text-[#0078D4]" />
                    Add to Outlook Calendar
                  </button>
                )}

                {detailsData?.icsDownloadUrl && (
                  <button
                    onClick={() => {
                      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
                      const link = document.createElement("a");
                      link.href = `${baseUrl}${detailsData.icsDownloadUrl}`;
                      link.setAttribute("download", `delivery-${deliveryData.deliveryId}.ics`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium text-[#101828]"
                  >
                    <CalendarDays size={18} className="text-[#F97316]" />
                    Add to Apple Calendar (.ics)
                  </button>
                )}
              </>
            )}

            <button
              onClick={handleCopyToClipboard}
              disabled={isFetching}
              className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium text-[#101828] disabled:opacity-50"
            >
              {copied ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} />
              )}
              {isFetching ? "Generating event..." : copied ? "Copied!" : "Copy event details to clipboard"}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-10 w-full rounded-lg border py-3 text-sm font-medium text-[#101828]"
        >
          Close
        </button>
      </div>
    </div>
  );
}