import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "sm:p-5 px-3 py-2 rounded-md text-white border-none",
        className,
        color
      )}
    >
      <div className="flex items-center flex-wrap justify-between">
        <div className="flex flex-col md:w-2/3 w-1/2">
          <p className="xl:text-base md:text-sm sm:text-xs text-xs opacity-90">
            {title}
          </p>
          <p className="xl:text-2xl md:text-lg sm:text-base text-sm mt-1 w-[70px] sm:w-auto overflow-y-hidden overflow-x-auto">
            {value}
          </p>
        </div>

        <div className="bg-white sm:p-2 p-1 lg:h-auto lg:w-auto md:h-8 md:w-8 flex items-center justify-center rounded-md ml-auto h-auto w-auto">
          {icon}
        </div>
      </div>
    </Card>
  );
}
