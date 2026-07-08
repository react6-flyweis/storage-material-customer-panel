import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeaderWithAction from "./common_components/SectionHeaderWithAction";
import LeadsDetailsModal from "./my_projects/LeadsDetailsModal";

interface ProjectDetail {
  project: string;
  material: string;
  estimated: string;
  actual: string;
  variance: string;
  varianceType: "positive" | "negative";
  date: string;
}

const tableData: ProjectDetail[] = [
  {
    project: "Downtown Office Complex",
    material: "$450,000",
    estimated: "$420,000",
    actual: "$465,000",
    variance: "$45,000",
    varianceType: "negative", // Actual > Estimated is usually negative variance for cost
    date: "2024-01-15",
  },
  {
    project: "Residential Tower A",
    material: "$320,000",
    estimated: "$340,000",
    actual: "$315,000",
    variance: "$25,000",
    varianceType: "positive",
    date: "2024-01-20",
  },
  {
    project: "Shopping Mall Renovation",
    material: "$280,000",
    estimated: "$275,000",
    actual: "$285,000",
    variance: "$10,000",
    varianceType: "negative",
    date: "2024-01-25",
  },
  {
    project: "Industrial Warehouse",
    material: "$180,000",
    estimated: "$190,000",
    actual: "$175,000",
    variance: "$15,000",
    varianceType: "positive",
    date: "2024-02-01",
  },
  {
    project: "Hospital Extension",
    material: "$520,000",
    estimated: "$500,000",
    actual: "$535,000",
    variance: "$35,000",
    varianceType: "negative",
    date: "2024-02-05",
  },
  {
    project: "School Building",
    material: "$240,000",
    estimated: "$250,000",
    actual: "$235,000",
    variance: "$15,000",
    varianceType: "positive",
    date: "2024-02-10",
  },
];

export default function ProjectDetailsTable() {
  return (
    <div className="bg-white rounded-md xl:p-6 p-4  border border-gray-100/50">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <SectionHeaderWithAction
            title="Project Details"
            actionLabel="" // No action label needed here as per image, but we'll use the space for icons
            showIcon={false}
          />
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
          <Filter className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 ">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="pb-4 font-semibold text-gray-900 text-sm">
                Project
              </th>
              <th className="pb-4 font-semibold text-gray-900 text-sm">
                Material
              </th>
              <th className="pb-4 font-semibold text-gray-900 text-sm">
                Estimated
              </th>
              <th className="pb-4 font-semibold text-gray-900 text-sm">
                Actual
              </th>
              <th className="pb-4 font-semibold text-gray-900 text-sm">
                Variance
              </th>
              <th className="pb-4 font-semibold text-gray-900 text-sm">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tableData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 text-sm text-gray-700 font-medium">
                  {item.project}
                </td>
                <td className="py-4 text-sm text-gray-600">{item.material}</td>
                <td className="py-4 text-sm text-gray-600">{item.estimated}</td>
                <td className="py-4 text-sm text-gray-600">{item.actual}</td>
                <td className="py-4">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal",
                      item.varianceType === "positive"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {item.varianceType === "positive" ? (
                      <ArrowDown className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUp className="w-3.5 h-3.5" />
                    )}
                    {item.variance}
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-500 font-normal">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LeadsDetailsModal isOpen={true} onClose={() => {}} />
    </div>
  );
}
