import { Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryRecord {
  client: string;
  projectId: string;
  location: string;
  orderValue: string;
  currentCost: string;
  deposit: string;
  progress: string;
  final: string;
  outstanding: string;
  wipProfit: string;
  margin: string;
  status: "In progress" | "Completed" | "Started";
}

const tableData: OrderSummaryRecord[] = [
  {
    client: "John Doe",
    projectId: "Q-2025-1047",
    location: "Workshop . Texas",
    orderValue: "$4,50,000",
    currentCost: "$3,61,000",
    deposit: "$1,35,000",
    progress: "$1,35,000",
    final: "$0",
    outstanding: "$1,35,000",
    wipProfit: "$89,000",
    margin: "19.8%",
    status: "In progress",
  },
  {
    client: "John Doe",
    projectId: "Q-2025-1047",
    location: "Workshop . Texas",
    orderValue: "$4,50,000",
    currentCost: "$3,61,000",
    deposit: "$1,35,000",
    progress: "$1,35,000",
    final: "$0",
    outstanding: "$1,35,000",
    wipProfit: "$89,000",
    margin: "19.8%",
    status: "Completed",
  },
  {
    client: "John Doe",
    projectId: "Q-2025-1047",
    location: "Workshop . Texas",
    orderValue: "$4,50,000",
    currentCost: "$3,61,000",
    deposit: "$1,35,000",
    progress: "$1,35,000",
    final: "$0",
    outstanding: "$1,35,000",
    wipProfit: "$89,000",
    margin: "19.8%",
    status: "Started",
  },
  {
    client: "John Doe",
    projectId: "Q-2025-1047",
    location: "Workshop . Texas",
    orderValue: "$4,50,000",
    currentCost: "$3,61,000",
    deposit: "$1,35,000",
    progress: "$1,35,000",
    final: "$0",
    outstanding: "$1,35,000",
    wipProfit: "$89,000",
    margin: "19.8%",
    status: "In progress",
  },
];

export default function OrdersPaymentSummaryTable() {
  return (
    <div className="bg-white rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-1 xl:p-6 p-4 ">
        <h2 className="md:text-xl font-bold text-black tracking-tight self-start md:self-center">
          Orders & Payment Summary
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select defaultValue="all-clients">
            <SelectTrigger className="w-full md:w-[160px] bg-white border-gray-200 rounded-lg h-10 text-gray-600 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-clients">All Clients</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-dates">
            <SelectTrigger className="w-full md:w-[160px] bg-white border-gray-200 rounded-lg h-10 text-gray-600 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-dates">All Dates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full text-left border-collapse min-w-[1200px] overflow-x-auto">
          <thead className="bg-[#F9FAFB] align-middle h-16">
            <tr className="border-b border-gray-100 uppercase">
              <th className="pl-4 font-semibold text-gray-400 text-[11px] tracking-wider">
                ORDER DETAILS
              </th>
              <th className="px-2 font-semibold text-gray-400 text-[11px] tracking-wider">
                ORDER VALUE
              </th>
              <th className=" px-2 font-semibold text-gray-400 text-[11px] tracking-wider text-center">
                PAYMENT BREAKDOWN
              </th>
              <th className="px-2  font-semibold text-gray-400 text-[11px] tracking-wider text-center">
                OUTSTANDING
              </th>
              <th className=" px-2 font-semibold text-gray-400 text-[11px] tracking-wider text-center">
                WIP PROFIT
              </th>
              <th className="px-2 font-semibold text-gray-400 text-[11px] tracking-wider text-center">
                STATUS
              </th>
              <th className="px-2 font-semibold text-gray-400 text-[11px] tracking-wider text-center">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 p-6">
            {tableData.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50/30 transition-colors p-6 "
              >
                {/* ORDER DETAILS */}
                <td className="p-6 min-w-[180px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-normal text-gray-900 text-[15px]">
                      {item.client}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {item.projectId}
                    </span>
                    <span className="text-gray-400 text-xs font-normal">
                      {item.location}
                    </span>
                  </div>
                </td>

                {/* ORDER VALUE */}
                <td className="py-6 min-w-[150px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-normal text-gray-900 text-[15px]">
                      {item.orderValue}
                    </span>
                    <span className="text-gray-400 text-xs font-normal">
                      Current Cost {item.currentCost}
                    </span>
                  </div>
                </td>

                {/* PAYMENT BREAKDOWN */}
                <td className="py-6 min-w-[100px]">
                  <div className="flex flex-col gap-1.5 pr-8">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-400">Deposit:</span>
                      <span className="font-bold text-gray-700">
                        {item.deposit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-400">Progress:</span>
                      <span className="font-bold text-gray-700">
                        {item.progress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-gray-400">Final:</span>
                      <span className="font-bold text-gray-700">
                        {item.final}
                      </span>
                    </div>
                  </div>
                </td>

                {/* OUTSTANDING */}
                <td className="py-6 text-center">
                  <span className="font-normal text-red-500 text-[15px]">
                    {item.outstanding}
                  </span>
                </td>

                {/* WIP PROFIT */}
                <td className="py-6 text-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-emerald-500 text-[15px]">
                      {item.wipProfit}
                    </span>
                    <span className="text-gray-400 text-xs font-normal">
                      {item.margin} margin
                    </span>
                  </div>
                </td>

                {/* STATUS */}
                <td className="py-6 text-center">
                  <Badge
                    className={cn(
                      "font-medium text-xs px-4 py-1.5 rounded-full border-none shadow-none",
                      item.status === "In progress"
                        ? "bg-blue-50 text-blue-600"
                        : item.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-orange-50 text-orange-600"
                    )}
                  >
                    {item.status}
                  </Badge>
                </td>

                {/* ACTIONS */}
                <td className="p-6 text-right space-x-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-blue-800">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-[#4AA44A]">
                    <Pencil className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
