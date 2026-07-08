import React from "react";
import { cn } from "@/lib/utils";

interface PaymentTableProps<T> {
  title: string;
  titleColor?: string;
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  containerClassName?: string;
  headRowClassName?: string;
}

const PaymentTable = <T extends object>({
  title,
  titleColor = "text-black",
  headers,
  data,
  renderRow,
  containerClassName,
  headRowClassName,
}: PaymentTableProps<T>) => {
  return (
    <div
      className={cn(
        "bg-white rounded-md border border-gray-100 overflow-hidden",
        containerClassName
      )}
    >
      <div className="xl:p-6 p-4">
        <h2
          className={cn(
            "md:text-lg text-base font-inter font-medium",
            titleColor
          )}
        >
          {title}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`${headRowClassName ?? ""}`}>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="text-left align-top py-4 px-4 text-xs min-w-[120px] font-semibold text-(--text-color-gray-2) first:pl-0 last:pr-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
