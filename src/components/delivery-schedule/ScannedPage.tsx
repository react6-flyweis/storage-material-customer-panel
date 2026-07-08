import TitleSubtitle from "../common_components/TitleSubtitle";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  ClipboardList,
  MoveLeft,
} from "lucide-react";
import SuccessModal from "../common_components/SuccessModal";
import { useState } from "react";

const parts = [
  {
    id: 1,
    part: "STL-B12",
    qty: 30,
    length: "20 ft",
    weight: "3600 lbs",
  },
  {
    id: 2,
    part: "STL-B12",
    qty: 20,
    length: "12 ft",
    weight: "2400 lbs",
  },
];

const ScannedPage = () => {
  const navigate = useNavigate();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <Button
          className="bg-[#2563EB] hover:bg-blue-700 text-white min-w-[100px] gap-2 px-6 h-10 rounded-md shadow-sm"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center justify-between gap-4">
          <button className="ml-auto flex w-fit min-w-[128px] items-center gap-2 rounded-md bg-(--button-bg-primary-color) px-4 py-2.5 text-sm font-normal text-white transition-opacity hover:opacity-90 lg:mt-2">
            Contact Support
          </button>
          <button className="ml-auto flex w-fit min-w-[128px] items-center gap-2 rounded-md bg-[#FD8D5B] px-4 py-2.5 text-sm font-normal text-white transition-opacity hover:opacity-90 lg:mt-2">
            Report Issue
          </button>
        </div>
      </div>
      <TitleSubtitle
        title="QR Label Scanned"
        subtitle="Bundle Details — BND-001"
      />
      <div className="rounded-lg bg-white p-5">
        <div className="rounded-lg bg-[#F8FAFC] p-6">
          <h2 className="text-[24px] font-medium text-[#101828]">
            Bundle Details — BND-001
          </h2>

          <div className="mt-4 space-y-2 text-base text-[#101828]">
            <p>
              <span className="font-semibold">Project:</span> Riverside Complex
            </p>

            <p>
              <span className="font-semibold">Bundle ID:</span> BND-001
            </p>

            <p>
              <span className="font-semibold">Load ID:</span> LOAD-001
            </p>

            <p>
              <span className="font-semibold">Truck:</span> TX-4582
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-[20px] font-medium text-[#101828]">
              <Package size={20} />
              Material Details
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">Part Numbers</span>

                <span className="font-semibold text-[#101828]">
                  STL-B12, STL-A03
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">
                  Total Quantity
                </span>

                <span className="font-semibold text-[#101828]">50</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">Total Weight</span>

                <span className="font-semibold text-[#101828]">3,600 lbs</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">Length</span>

                <span className="font-semibold text-[#101828]">20 ft</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-[20px] font-medium text-[#101828]">
              <Truck size={20} />
              Delivery Reference
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">Delivery ID</span>

                <span className="font-semibold text-[#101828]">DEL-2001</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">Destination</span>

                <span className="font-semibold text-[#101828]">
                  Construction Site A
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-[#101828]">Status</span>

                <span className="font-semibold text-[#101828]">In Transit</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 flex items-center gap-2 text-[20px] font-medium text-[#101828]">
            <ClipboardList size={20} />
            Parts
          </h3>

          <div className="overflow-hidden rounded-lg border border-[#E4E7EC]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#222222] text-left text-sm text-white">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Part</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Length</th>
                  <th className="px-6 py-4">Weight</th>
                </tr>
              </thead>

              <tbody>
                {parts.map((item) => (
                  <tr key={item.id} className="border-t border-[#E4E7EC]">
                    <td className="px-6 py-5 text-[#4A5565]">{item.id}</td>

                    <td className="px-6 py-5 text-[#4A5565]">{item.part}</td>

                    <td className="px-6 py-5 text-[#4A5565]">{item.qty}</td>

                    <td className="px-6 py-5 text-[#4A5565]">{item.length}</td>

                    <td className="px-6 py-5 text-[#4A5565]">{item.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button className="rounded-lg border border-[#D0D5DD] px-6 py-3 text-sm font-medium text-[#101828]">
            Cancel
          </button>

          <button onClick={() => {
            setIsSuccessModalOpen(true);
            setModalTitle("Downloaded Successfully");
            setTimeout(() => {
              setIsSuccessModalOpen(false);
            }, 3000);
          }} className="rounded-lg bg-gradient-to-r from-[#9333EA] to-[#7C3AED] px-6 py-3 text-sm font-medium text-white">
            Download Bundle contents
          </button>

          <button onClick={() => {
            setIsSuccessModalOpen(true);
            setModalTitle("Downloaded Successfully");
            setTimeout(() => {
              setIsSuccessModalOpen(false);
            }, 3000);
          }} className="rounded-lg bg-gradient-to-r from-[#9333EA] to-[#7C3AED] px-6 py-3 text-sm font-medium text-white">
            Download Packing List
          </button>
        </div>
              <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
      </div>
    </div>
  );
};

export default ScannedPage;
