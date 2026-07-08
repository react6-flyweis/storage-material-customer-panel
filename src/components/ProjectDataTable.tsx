import {
  ArrowUpDown,
  Eye,
  FileSpreadsheet,
  FileText,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockProjects = [
  {
    id: 1,
    name: "Downtown Office Complex",
    orderValue: "$580,000",
    costToDate: "$335,000",
    profit: "$245,000",
    margin: "42.5%",
    marginColor: "green",
    status: "In Progress",
    updatedOn: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Residential Tower Phase 2",
    orderValue: "$520,000",
    costToDate: "$322,000",
    profit: "$198,000",
    margin: "38.2%",
    marginColor: "green",
    status: "In Progress",
    updatedOn: "Jan 14, 2024",
  },
  {
    id: 3,
    name: "Shopping Mall Renovation",
    orderValue: "$435,000",
    costToDate: "$279,000",
    profit: "$156,000",
    margin: "35.8%",
    marginColor: "green",
    status: "In Progress",
    updatedOn: "Jan 13, 2024",
  },
  {
    id: 4,
    name: "Industrial Warehouse",
    orderValue: "$380,000",
    costToDate: "$310,000",
    profit: "$70,000",
    margin: "18.5%",
    marginColor: "red",
    status: "In Progress",
    updatedOn: "Jan 12, 2024",
  },
  {
    id: 5,
    name: "School Extension",
    orderValue: "$295,000",
    costToDate: "$230,000",
    profit: "$65,000",
    margin: "22.1%",
    marginColor: "yellow", // Orange/Yellow in image for mid-range, but image mostly shows green/red. Let's use yellow for 22% if strictly following "Decreasing Margin" list implication, but here let's stick to what we see. 22.1% is visually yellow/orange in typical dashboards. Image shows "School Extension" as Red in the "Decreasing Margin" card earlier. Let's check image... Image for table shows 22.1% as Yellow/Orange.
    status: "In Progress",
    updatedOn: "Jan 11, 2024",
  },
  {
    id: 6,
    name: "Hospital Wing",
    orderValue: "$240,000",
    costToDate: "$202,000",
    profit: "$38,000",
    margin: "15.8%",
    marginColor: "red",
    status: "In Progress",
    updatedOn: "Jan 10, 2024",
  },
];

export default function ProjectDataTable() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900">Project Data</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="text-gray-600 border-gray-200 hover:bg-gray-50 h-9"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 border-gray-200 hover:bg-gray-50 h-9"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Table Container - responsive scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Project
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Order Value
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Cost to Date
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Profit
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Margin %
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 w-[120px] text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Updated On
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[120px] text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockProjects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  {project.name}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {project.orderValue}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {project.costToDate}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  {project.profit}
                </td>
                <td className="py-4 px-4 text-sm">
                  <span
                    className={cn(
                      "font-medium",
                      project.marginColor === "green"
                        ? "text-emerald-500"
                        : project.marginColor === "red"
                        ? "text-red-500"
                        : "text-amber-500"
                    )}
                  >
                    {project.margin}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {project.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  {project.updatedOn}
                </td>
                <td className="py-4 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
