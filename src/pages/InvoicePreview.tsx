

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, MoveLeft, Wallet } from "lucide-react";
import logo from "@/assets/logo.svg";
import invoice from "../assets/Invoice_placeholder.png";
import PaymentModal from "./payments_and_invoices/PaymentModal";
import { useState } from "react";

export default function InvoicePreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    invoiceNumber = "2460",
    date = "10-25-2025",
    daysToPay = "15",
    items = [],
    subtotal = 1917952,
    taxAmount = 153436.15,
    total = 2071388.16,
  } = location.state || {};

  const deposit = total * 0.25;

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200";

  return (
    <div className="space-y-6 px-2 pb-10 pt-3 md:px-5 md:pt-5">
      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="outline"
          className="min-w-[120px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            asChild
            className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          >
            <a href={invoice} download>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            <Wallet className="h-4 w-4" />
            Payments
          </Button>
        </div>
      </div>

            <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <div className="w-full rounded-lg bg-white px-10 py-8 shadow-sm">
        <h1 className="mb-10 text-center text-[22px] font-bold uppercase text-[#BDBDBD]">
          Invoice
        </h1>

        <div className="mb-20">
          <div>
            <img
              src={logo}
              alt="logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-between gap-10">
            <div className="text-[16px] leading-7 text-[#667085]">
              1851 Madison Ave Suite 300
              <br />
              Council Bluffs, IA
              <br />
              51503
              <br />
              United States
              <br />
              travis@storagematerials.com
              <br />
              www.storagematerials.com
            </div>

            <div className="w-[260px] space-y-4">
              <div className="flex justify-between text-[16px]">
                <span>Payment terms</span>
                <span>{daysToPay} days</span>
              </div>

              <div className="flex justify-between text-[16px]">
                <span>Invoice #</span>
                <span>{invoiceNumber}</span>
              </div>

              <div className="flex justify-between text-[16px]">
                <span>Date</span>
                <span>{date}</span>
              </div>

              <div className="flex justify-between text-[16px]">
                <span>Business/Tax #</span>
                <span>99-4515145</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="mb-8 flex justify-between border-b border-[#344054] pb-3">
            <span className="text-[18px] font-medium text-[#101828]">
              Description
            </span>

            <span className="text-[18px] font-medium text-[#101828]">
              Total
            </span>
          </div>

          <div className="space-y-10">
            {items.length > 0 ? (
              items.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={
                    index > 0 ? "border-t border-[#E4E7EC] pt-5" : ""
                  }
                >
                  <div className="mb-2 flex justify-between">
                    <span className="text-[18px] text-[#667085]">
                      {item.description}
                    </span>

                    <span className="text-[18px] text-[#667085]">
                      $
                      {(item.rate * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[15px] text-[#98A2B3]">
                      {item.notes}
                    </p>
                  )}

                  {item.photos?.length > 0 && (
                    <div className="mt-6">
                      <div className="h-[260px] w-[260px] overflow-hidden">
                        <img
                          src={
                            item.photos[0]?.startsWith("blob:") ||
                            item.photos[0]?.startsWith("http")
                              ? item.photos[0]
                              : FALLBACK_IMAGE
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-[18px] text-[#667085]">
                      Building 1
                    </span>

                    <span className="text-[18px] text-[#667085]">
                      $75,000.00
                    </span>
                  </div>

                  <p className="text-[15px] text-[#98A2B3]">
                    3500 sq ft building
                  </p>

                  <div className="mt-6 h-[260px] w-[260px] overflow-hidden">
                    <img
                      src={FALLBACK_IMAGE}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="border-t border-[#E4E7EC] pt-5">
                  <div className="mb-2 flex justify-between">
                    <span className="text-[18px] text-[#667085]">
                      Building 2
                    </span>

                    <span className="text-[18px] text-[#667085]">
                      $75,000.00
                    </span>
                  </div>

                  <p className="text-[15px] text-[#98A2B3]">Notes</p>
                </div>

                <div className="border-t border-[#E4E7EC] pt-5">
                  <div className="mb-2 flex justify-between">
                    <span className="text-[18px] text-[#667085]">
                      Building 3
                    </span>

                    <span className="text-[18px] text-[#667085]">
                      $75,000.00
                    </span>
                  </div>

                  <p className="text-[15px] text-[#98A2B3]">Notes</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-20 flex justify-end">
          <div className="w-[320px]">
            <div className="flex justify-between border-b border-[#E4E7EC] py-3 text-[18px]">
              <span className="font-semibold">Subtotal</span>

              <span>
                $
                {Number(subtotal).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#E4E7EC] py-3 text-[18px]">
              <span>Tax</span>

              <span>
                $
                {Number(taxAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between py-3 text-[20px] font-bold">
              <span>Total</span>

              <span>
                $
                {Number(total).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between border-t border-[#E4E7EC] py-4 text-[18px] font-semibold">
              <span>Deposit Due</span>

              <span>
                $
                {deposit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-20 ml-auto w-[520px]">
          <h3 className="mb-4 text-[20px] font-bold text-[#101828]">
            Payment Schedule
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between border-b border-[#E4E7EC] py-3 text-[18px]">
              <span>Deposit (25%)</span>
              <span>
                $
                {(total * 0.25).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#E4E7EC] py-3 text-[18px]">
              <span>1st payment 50%</span>
              <span>
                $
                {(total * 0.5).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#E4E7EC] py-3 text-[18px]">
              <span>2nd payment 20%</span>
              <span>
                $
                {(total * 0.2).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between py-3 text-[18px]">
              <span>Final payment 5%</span>
              <span>
                $
                {(total * 0.05).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-[#D0D5DD] pt-8">
          <p className="text-[16px] text-[#667085]">
            Thank you for your business? Reach out with any questions
          </p>

          <div className="my-8 border-t border-[#D0D5DD]" />

          <p className="text-[16px] text-[#667085]">
            By Signing this document the customer agrees to the services and
            conditions outlined in this document
          </p>

          <div className="mt-32 flex justify-end">
            <div className="w-[320px] border-t border-[#98A2B3] pt-3">
              <p className="text-[18px] text-[#667085]">
                Your Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
