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
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

export const PaymentTableSkeleton = ({
  title,
  titleColor = "text-black",
  headers,
  containerClassName,
  headRowClassName,
  rowCount = 3,
}: {
  title?: string;
  titleColor?: string;
  headers: string[];
  containerClassName?: string;
  headRowClassName?: string;
  rowCount?: number;
}) => {
  return (
    <PaymentTable
      title={title || ""}
      titleColor={titleColor}
      headers={headers}
      data={[]}
      renderRow={() => null}
      isLoading={true}
      skeletonRowCount={rowCount}
      containerClassName={containerClassName}
      headRowClassName={headRowClassName}
    />
  );
};

const PaymentTable = <T extends object>({
  title,
  titleColor = "text-black",
  headers,
  data,
  renderRow,
  containerClassName,
  headRowClassName,
  emptyMessage,
  isLoading = false,
  skeletonRowCount = 3,
}: PaymentTableProps<T>) => {
  return (
    <div
      className={cn(
        "bg-white rounded-md border border-gray-100 overflow-hidden",
        containerClassName
      )}
    >
      <div className="xl:p-6 p-4">
        {title && (
          <h2
            className={cn(
              "md:text-lg text-base font-inter font-medium",
              titleColor
            )}
          >
            {title}
          </h2>
        )}

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
            <tbody>
              {isLoading ? (
                Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-gray-50 last:border-0",
                      headRowClassName?.includes("border-y")
                        ? "border-y border-[#00000033]"
                        : headRowClassName?.includes("border-b")
                        ? "border-b border-gray-100"
                        : ""
                    )}
                  >
                    {headers.map((_, colIndex) => {
                      const isLast = colIndex === headers.length - 1;
                      const isSecondLast = colIndex === headers.length - 2;

                      return (
                        <td
                          key={colIndex}
                          className={cn(
                            "py-4 px-4 md:text-sm text-xs first:pl-0 last:pr-0",
                            isLast ? "text-right" : ""
                          )}
                        >
                          <div
                            className={cn(
                              "animate-pulse",
                              isLast
                                ? "flex justify-center items-center"
                                : ""
                            )}
                          >
                            {isLast ? (
                              <div
                                className={cn(
                                  "bg-gray-200 rounded-md",
                                  headers.length > 6
                                    ? "h-8 w-8"
                                    : "h-7 w-20"
                                )}
                              />
                            ) : isSecondLast && headers.length > 6 ? (
                              <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto" />
                            ) : (
                              <div
                                className={cn(
                                  "h-4 bg-gray-200 rounded",
                                  colIndex === 0
                                    ? "w-20"
                                    : colIndex === 1
                                    ? "w-32"
                                    : colIndex === 2
                                    ? "w-24"
                                    : "w-16"
                                )}
                              />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="py-12 text-center text-sm text-gray-500 font-medium"
                  >
                    {emptyMessage || "No data available"}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => renderRow(item, index))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
