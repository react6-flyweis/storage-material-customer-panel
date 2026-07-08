import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Plus, Database } from "lucide-react";
import FinanceStatCard from "../components/FinanceStatCard";
import OrdersPaymentSummaryTable from "../components/OrdersPaymentSummaryTable";
import PaymentTimeline from "../components/PaymentTimeline";
import TitleSubtitle from "@/components/common_components/TitleSubtitle";

const financeStats = [
  {
    title: "Total Order Value",
    value: "$12,30,000",
    icon: <Database className="md:w-4 md:h-4 w-3.5 h-3.5 text-blue-600" />,
    iconBgColor: "bg-[#EFF6FF]",
    valueColor: "text-black",
  },
  {
    title: "Total Received",
    value: "$8,45,000",
    icon: <Database className="md:w-4 md:h-4 w-3.5 h-3.5 text-emerald-500" />,
    iconBgColor: "bg-[#DCFCE7]",
    valueColor: "text-emerald-500",
  },
  {
    title: "Outstanding",
    value: "$3,85,000",
    icon: <Database className="md:w-4 md:h-4 w-3.5 h-3.5 text-red-500" />,
    iconBgColor: "bg-[#FEE2E2]",
    valueColor: "text-red-500",
  },
  {
    title: "Total WIP Profit",
    value: "$2,33,000",
    icon: <Database className="md:w-4 md:h-4 w-3.5 h-3.5 text-purple-600" />,
    iconBgColor: "bg-[#F3E8FF]",
    valueColor: "text-black",
  },
];

const OrdersAndPaymentsPage = () => {
  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2 pr-0 sm:pr-10">
        <TitleSubtitle
          title="Orders & Payments"
          subtitle="Financial performance tracking and management"
        />
        <div className="flex flex-wrap items-stretch sm:items-center gap-3 w-fit xl:w-auto ml-auto">
          <Button
            variant={"outline"}
            className="bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#434C5B] rounded-lg h-10 px-4 gap-2 md:text-sm text-xs font-regular w-fit sm:w-auto border border-[#D5D8DE]"
          >
            <ArrowDownToLine className="w-5 h-5" />
            Export Reports
          </Button>
          <Button className="bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg h-10 px-4 gap-2 md:text-sm text-xs font-regular w-fit sm:w-auto">
            <Plus className="w-5 h-5" />
            New Entry
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-5">
        {financeStats.map((stat, index) => (
          <FinanceStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            valueColor={stat.valueColor}
          />
        ))}
      </div>

      <OrdersPaymentSummaryTable />

      <PaymentTimeline />
    </div>
  );
};

export default OrdersAndPaymentsPage;
