import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { drawingApprovalsByFilter } from "@/data/mockData";

export type DrawingColor = "cyan" | "blue" | "yellow" | "purple" | "green";

export interface DrawingApprovalItem {
  label: string;
  count: string;
  subtext?: string;
  color: DrawingColor;
}

const colorStyles: Record<string, { bg: string; text: string }> = {
  cyan: { bg: "bg-[#EBF7F9]", text: "text-[#00A8B5]" },
  blue: { bg: "bg-[#EBF7F9]", text: "text-[#00A8B5]" },
  yellow: { bg: "bg-[#FEF5E7]", text: "text-[#F59E0B]" },
  purple: { bg: "bg-[#F3E8FF]", text: "text-[#A855F7]" },
  green: { bg: "bg-[#E6F9EE]", text: "text-[#22C55E]" },
};

const DrawingsAndApprovals = ({
  activeFilter = "today",
}: {
  activeFilter?: string;
}) => {
  const navigate = useNavigate();
  const items: DrawingApprovalItem[] =
    (drawingApprovalsByFilter as Record<string, DrawingApprovalItem[]>)[
      activeFilter
    ] ||
    (drawingApprovalsByFilter as Record<string, DrawingApprovalItem[]>)[
      "today"
    ] ||
    [];

  return (
    <Card className="w-full h-full bg-white border border-slate-100/80 shadow-sm rounded-2xl p-5 md:p-6 gap-0">
      <CardHeader className="p-0 mb-5">
        <CardTitle className="text-lg md:text-xl font-bold text-slate-900">
          Drawings & Approvals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-3.5">
        {items.map((item: DrawingApprovalItem, index: number) => {
          const styles = colorStyles[item.color] || colorStyles.cyan;
          return (
            <div
              key={index}
              onClick={() => navigate("/drawings")}
              className="bg-white border border-slate-200/70 hover:border-slate-300 transition-colors p-4 sm:py-4.5 sm:px-5 rounded-xl flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${styles.bg}`}
                >
                  <Layers className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.text}`} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 leading-tight">
                    {item.label}
                  </h4>
                  {item.subtext ? (
                    <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                      {item.subtext}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="text-right pl-3 shrink-0">
                <span className="text-base font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DrawingsAndApprovals;
