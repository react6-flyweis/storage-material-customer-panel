"use client";

import {
  Eye,
  X,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Download,
  Package,
  Truck,
  CalendarDays,
  Clock4,
  Loader2,
} from "lucide-react";
import { useGetDeliveryByIdQuery } from "@/redux/api/deliveriesApi";

interface FullDeliveryInstructionModalProps {
  open: boolean;
  onClose: () => void;
  deliveryId: string;
}

export default function FullDeliveryInstructionModal({
  open,
  onClose,
  deliveryId,
}: FullDeliveryInstructionModalProps) {
  const { data: delivery, isLoading } = useGetDeliveryByIdQuery(deliveryId, {
    skip: !open || !deliveryId,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[992px] max-h-[90vh] overflow-y-auto scroll-hide rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#9333EA] to-[#C026D3]">
              <Eye className="h-7 w-7 text-white" />
            </div>

            <h2 className="text-[24px] font-bold text-[#101828]">
              Full Delivery Instructions
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="h-7 w-7 text-[#98A2B3]" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
          </div>
        ) : !delivery ? (
          <div className="flex h-[400px] flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg border border-dashed mt-4">
            <p className="text-gray-500 font-medium text-lg">Delivery details not found</p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="flex flex-col lg:mb-0 mb-5">
              <div className="lg:h-[650px] overflow-y-auto mt-7 scroll-hide">
                <div className="rounded-lg border-2 border-[#BEDBFF] bg-[#EFF6FF] p-4">
                  <p className="text-[12px] font-medium text-[#193CB8]">
                    Delivery
                  </p>

                  <h3 className="mt-4 text-[18px] font-bold text-[#101828]">
                    {delivery.description || delivery.deliveryNumber || "Delivery"}
                  </h3>

                  <p className="mt-4 text-[18px] font-medium text-[#193CB8]">
                    {delivery.deliveryNumber}
                  </p>

                  <p className="mt-4 text-[16px] font-semibold text-[#155DFC] capitalize">
                    Status: {delivery.status?.replace("_", " ")}
                  </p>
                </div>
                <div className="mt-5">
                  <h3 className="mb-5 text-[20px] font-bold text-[#101828]">
                    Delivery Details
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCE8FF]">
                        <CalendarDays className="h-6 w-6 text-[#155DFC]" />
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Delivery Date</p>
                        <p className="text-[18px] font-semibold text-[#101828]">
                          {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString("en-US", {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          }) : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E8FF]">
                        <Clock4 className="h-6 w-6 text-[#9333EA]" />
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Time Window</p>
                        <p className="text-[18px] font-semibold text-[#101828]">
                          {delivery.timings || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7]">
                        <Truck className="h-6 w-6 text-[#16A34A]" />
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Project Location</p>
                        <p className="text-[18px] font-semibold text-[#101828]">
                          {delivery.project?.projectName || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF3E2]">
                        <Package className="h-6 w-6 text-[#F97316]" />
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Estimated Weight</p>
                        <p className="text-[18px] font-semibold text-[#101828]">
                          {delivery.estimatedWeight ? `${delivery.estimatedWeight.toLocaleString()} lbs` : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {delivery.siteInstructions && (
                  <div className="mt-5 rounded-xl border-2 border-[#F4DD61] bg-[#FFFBEA] p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-1 h-5 w-5 text-[#D97706]" />

                      <div>
                        <p className="text-base font-semibold text-[#A16207]">
                          Site Instructions:
                        </p>

                        <p className="mt-2 text-base text-[#92400E]">
                          {delivery.siteInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {delivery.loadingEquipment && delivery.loadingEquipment.length > 0 && (
                  <div className="mt-5 rounded-lg border-2 border-[#DCC5FF] bg-[#FAF5FF] p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-1 h-5 w-5 text-[#6B21A8]" />

                      <div>
                        <p className="text-base font-semibold text-[#6B21A8]">
                          Required Equipment:
                        </p>

                        <p className="mt-2 text-base text-[#6B21A8]">
                          {delivery.loadingEquipment.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {delivery.specialNotes && (
                  <div className="mt-5 rounded-lg border border-[#BEDBFF] bg-[#EFF6FF] p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 text-[#155DFC]" />

                      <div>
                        <p className="text-base font-semibold text-[#193CB8]">
                          Special Notes
                        </p>

                        <p className="mt-2 text-base text-[#193CB8]">
                          {delivery.specialNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {delivery.loadAndBundle && (
                  <div className="mt-5 rounded-lg border-2 border-[#BEDBFF] p-4">
                    <h3 className="text-[18px] font-bold text-[#101828]">
                      Load & Bundle Summary
                    </h3>

                    <div className="mt-5 grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-[#4A5565]">Load ID</p>
                        <p className="text-base font-semibold">{delivery.loadAndBundle.loadId || "-"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Bundle Count</p>
                        <p className="text-base font-semibold">{delivery.loadAndBundle.bundleCount || "-"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Truck Number</p>
                        <p className="text-base font-semibold">{delivery.loadAndBundle.truckNumber || "-"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-[#4A5565]">Total Weight</p>
                        <p className="text-base font-semibold">{delivery.loadAndBundle.totalWeight || "-"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-lg border-2 border-[#BEDBFF] p-4">
                  <h3 className="text-[18px] font-bold text-[#101828]">
                    Packing List Summary
                  </h3>

                  <div className="mt-5 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-[#4A5565]">Total Parts</p>
                      <p className="text-base font-semibold">-</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#4A5565]">Bundle Types</p>
                      <p className="text-base font-semibold">-</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#4A5565]">Material</p>
                      <p className="text-base font-semibold">-</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium text-[#101828]">
                  <Download size={18} />
                  Download PDF
                </button>

                <button
                  onClick={onClose}
                  className="rounded-lg bg-gradient-to-r from-[#9333EA] to-[#C026D3] py-3 text-sm font-medium text-white"
                >
                  Close
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-[#667085]">
                Contact Information
              </h3>

              <div className="space-y-5">
                <ContactCard
                  title="Receiving POC"
                  name="-"
                  phone="-"
                  email="-"
                />

                <ContactCard
                  title="Delivery Team"
                  company
                  name={delivery.deliveryCompany?.name || "-"}
                  phone={delivery.deliveryCompany?.phone || "-"}
                  email={delivery.deliveryCompany?.email || "-"}
                  driver={delivery.deliveryCompany?.driver || "-"}
                />

                <ContactCard
                  title="Site Contact"
                  name={delivery.siteContact?.name || "-"}
                  phone={delivery.siteContact?.phone || "-"}
                  email="-"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({
  title,
  company,
  name,
  phone,
  email,
  driver,
}: {
  title: string;
  company?: boolean;
  name?: string;
  phone?: string;
  email?: string;
  driver?: string;
}) {
  return (
    <div className="rounded-lg border border-[#F3CC97] p-4">
      <h4 className="mb-5 text-[18px] font-bold text-[#101828]">{title}</h4>

      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCE8FF]">
            <User className="h-5 w-5 text-[#155DFC]" />
          </div>

          <div>
            <p className="text-sm text-[#4A5565]">
              {company
                ? "Delivery Company"
                : title === "Site Contact"
                  ? "Site Manager"
                  : "Receiver Name"}
            </p>

            <p className="text-base font-semibold text-[#101828]">
              {name || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF5E5]">
              <Phone className="h-5 w-5 text-[#16A34A]" />
            </div>

            <div>
              <p className="text-sm text-[#4A5565]">Contact Phone</p>

              <p className="text-base font-semibold text-[#101828]">
                {phone || "-"}
              </p>

              {company && driver && (
                <p className="text-sm text-[#4A5565]">Driver: {driver}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF5E5]">
              <Mail className="h-5 w-5 text-[#16A34A]" />
            </div>

            <div>
              <p className="text-sm text-[#4A5565]">Contact Mail</p>

              <p className="text-base font-semibold text-[#101828]">
                {email || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
