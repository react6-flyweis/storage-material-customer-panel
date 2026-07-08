import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashStatCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  borderColor?: string;
  iconBg?: string;
  className?: string;
};

export default function DashStatCard({
  title,
  value,
  icon,
  borderColor = "#3B82F6",
  iconBg = "#3B82F6",
  className,
}: DashStatCardProps) {
  return (
    <Card
      className={cn(
        "rounded-lg border bg-white p-4 shadow-none",
        className
      )}
      style={{ borderColor }}
    >
      <div className="flex items-center gap-4 h-full">
        <div
          className="flex h-12 w-12 min-w-12 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>

        <div>
          <p className="text-lg text-gray-500">{title}</p>
          <p className="text-4xl font-semibold text-black">{value}</p>
        </div>
      </div>
    </Card>
  );
}