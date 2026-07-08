import BlueStackIcon from "@/assets/icon/BlueStackIcon.svg";
import InvoiceDueIcon from "@/assets/icon/InvoiceDueIcon.svg";
import TotalExpensesIcon from "@/assets/icon/TotalExpensesIcon.svg";
import PurpleHashIcon from "@/assets/icon/PurpleHashIcon.svg";

import BlueCallIcon from "@/assets/icon/BlueCallIcon.svg";
import GreenMailIcon from "@/assets/icon/GreenMailIcon.svg";
import PurpleCalendarIcon from "@/assets/icon/PurpleCalendarIcon.svg";
import { useNavigate } from "react-router-dom";

const DashboardWidgets = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      <div className="bg-white rounded-md xl:p-6 p-4 flex flex-col h-full">
        <h2 className="md:text-lg font-light text-black-400 mb-6">
          Financial Overview
        </h2>
        <div className="flex flex-col gap-4">
          {/* Card 1 */}
          <div className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="xl:text-lg font-medium text-gray-900">
                $8,458,798
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Total Equipment Value
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#E9F8FB] flex items-center justify-center text-cyan-500">
              <img src={BlueStackIcon} alt="" className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="xl:text-lg font-medium text-gray-900">
                $48,988,78
              </h3>
              <p className="text-sm text-gray-500 mt-1">Available Equipment</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#E9F5F4] flex items-center justify-center text-green-500">
              <img src={InvoiceDueIcon} alt="" className="h-5 w-5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="xl:text-lg font-medium text-gray-900">$980,097</h3>
              <p className="text-sm text-gray-500 mt-1">In Use Equipment</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#FCEFEA] flex items-center justify-center text-orange-500">
              <img src={TotalExpensesIcon} alt="" className="h-4 w-4" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="xl:text-lg font-medium text-gray-900">$980,097</h3>
              <p className="text-sm text-gray-500 mt-1">
                Under Maintenance Equipment
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
              <img src={PurpleHashIcon} alt="" className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Recent Messages / RFIs */}
      <div className="bg-white rounded-md xl:p-6 p-4 flex flex-col h-full">
        <h2 className="md:text-[17px] font-semibold text-black-400 mb-6">
          Recent Messages / RFIs
        </h2>
        <div className="flex flex-col gap-6">
          {/* Message 1 */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] flex-shrink-0">
              <img src={BlueCallIcon} alt="" className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-(--text-color-black) leading-tight">
                Mixer needed at Pune site ASAP.
              </h4>
              <p className="text-xs mt-1 text-[#717171]">Team Steel company</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">2:00 PM</span>
                <span className="text-[10px] font-semibold bg-[#FEE2E2] text-[#B44D4D] px-2 py-0.5 rounded-full">
                  High priority
                </span>
              </div>
            </div>
          </div>

          {/* Message 2 */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#2563EB] flex-shrink-0">
              <img src={GreenMailIcon} alt="" className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-(--text-color-black) leading-tight">
                Invoice Received from team
              </h4>
              <p className="text-xs text-[#717171] mt-1">Team Steel company</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">2:00 PM</span>
                <span className="text-[10px] font-semibold bg-[#FEE2E2] text-[#B44D4D] px-2 py-0.5 rounded-full">
                  High priority
                </span>
              </div>
            </div>
          </div>

          {/* Message 3 */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] flex-shrink-0">
              <img src={PurpleCalendarIcon} alt="" className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-(--text-color-black) leading-tight">
                Meeting with construction team
              </h4>
              <p className="text-xs text-[#717171] mt-1">Team Steel company</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">2:00 PM</span>
                <span className="text-[10px] font-semibold bg-[#FEE2E2] text-[#B44D4D] px-2 py-0.5 rounded-full">
                  High priority
                </span>
              </div>
            </div>
          </div>

          {/* Message 4 */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#2563EB] flex-shrink-0">
              <img src={GreenMailIcon} alt="" className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-(--text-color-black) leading-tight">
                Invoice Received from team
              </h4>
              <p className="text-xs text-[#717171] mt-1">Team Steel company</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">2:00 PM</span>
                <span className="text-[10px] font-semibold bg-[#FEE2E2] text-[#B44D4D] px-2 py-0.5 rounded-full">
                  High priority
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: PLANT DEPARTMENT ALERTS */}
      <div className="bg-white rounded-md xl:p-6 p-4 flex flex-col h-full">
        <div className="p-0 pb-0 grow">
          <h2 className="text-sm font-bold text-[#3E4857] pb-4 mb-2 border-b border-[#00000021]">
            Notifications
          </h2>
          <div className="flex flex-col gap-5">
            {/* Alert 1 */}
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#3B82F6]" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  Need to Maintain
                </p>
                <p className="text-xs text-[#888888] mt-1">
                  Equipment ID ME 98237
                </p>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#EAB308]" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  New Maintenance request accepted by admin
                </p>
                <p className="text-xs text-[#888888] mt-1">
                  Equipment ID ME 98237
                </p>
              </div>
            </div>

            {/* Alert 3 */}
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#22C55E]" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  New message from team steel company
                </p>
                <p className="text-xs text-[#888888] mt-1">
                  Equipment ID ME 98237
                </p>
              </div>
            </div>

            {/* Alert 4 */}
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#3B82F6]" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  Project status Updated #OR987654
                </p>
                <p className="text-xs text-[#888888] mt-1">2 minutes ago</p>
              </div>
            </div>

            {/* Alert 5 */}
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#EAB308]" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  New drawing Added #ST87368
                </p>
                <p className="text-xs text-[#888888] mt-1">2 minutes ago</p>
              </div>
            </div>

            {/* Alert 6 */}
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#22C55E]" />
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  New message from team steel company
                </p>
                <p className="text-xs text-[#888888] mt-1">2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 pb-0 border-t border-[#00000021] mt-4">
          <button
            className="w-full text-center text-(--text-color-primary-blue) font-medium text-sm hover:underline"
            onClick={() => navigate("/notification")}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
