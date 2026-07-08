import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { drawingApprovalsByFilter } from "@/data/mockData";

const colorStyles: { [key: string]: { dot: string; bg: string } } = {
  blue: { dot: "bg-[#3B82F6]", bg: "bg-[#EBF3FF]" },
  yellow: { dot: "bg-[#EAB308]", bg: "bg-[#FFF9E6]" },
  purple: { dot: "bg-[#A855F7]", bg: "bg-[#F3E8FF]" },
  green: { dot: "bg-[#22C55E]", bg: "bg-[#E6F9EA]" },
};

export type DashboardFilter = "today" | "week" | "month";

export type DrawingColor = "blue" | "yellow" | "purple" | "green";

export interface DrawingApprovalItem {
  label: string;
  count: string;
  subtext: string;
  color: DrawingColor;
}
const DrawingsAndApprovals = ({activeFilter}: {activeFilter: string}) => {
  const navigate = useNavigate();
  return (
    <Card className="w-full h-full bg-white border-none gap-4 py-4 px-2">
      <CardHeader className="pb-0 px-2">
        <CardTitle className="text-lg font-normal text-(--text-color-black)">
          Drawings & Approvals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-2">
        {drawingApprovalsByFilter[activeFilter].map((item: DrawingApprovalItem, index: number) => {
          const styles = colorStyles[item.color] || colorStyles.blue;
          return (
            <div
              key={index}
              onClick={() => navigate("/drawings")}
              className={`${styles.bg} min-h-20 py-5 px-4 rounded-lg flex items-center justify-between cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${styles.dot}`}></div>
                <span className="text-sm font-medium text-gray-800">
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {item.count}
                </p>
                {item.subtext && (
                  <p className="text-[10px] text-gray-500">{item.subtext}</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-center mt-auto">
        <div
          onClick={() => navigate("/drawings")}
          className="text-[#1D51A4] text-sm font-medium cursor-pointer"
        >
          View New Drawings
        </div>
      </CardFooter>
    </Card>
  );
};

export default DrawingsAndApprovals;
