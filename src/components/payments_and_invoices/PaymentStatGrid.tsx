import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Repeat, Gift, TrendingUp } from "lucide-react";
import TotalPurchaseReturnIcon from "@/assets/icon/TotalPurchaseReturnIcon.svg";

interface PaymentStatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  badge?: {
    text: string;
    type: "positive" | "negative";
  };
}

const PaymentStatCard = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  badge,
}: PaymentStatCardProps) => {
  return (
    <Card
      className={cn(
        "md:p-4 p-2 border-none text-white overflow-hidden rounded-md h-fit",
        bgColor
      )}
    >
      <div className="flex items-start justify-start gap-5">
        <div className="bg-white h-full max-h-11 md:p-3 p-2 flex justify-center items-center rounded-md">
          {React.cloneElement(icon as React.ReactElement<any>, {
            className: cn("xl:h-6 xl:w-6 h-4 w-4", iconColor),
          })}
        </div>
        <div className="flex flex-col gap-0.5 w-full">
          <p className="xl:text-sm text-xs opacity-90">{title}</p>
          <div className="flex items-center md:gap-2 gap-1 flex-wrap w-full">
            <h3 className="lg:text-lg md:text-base text-xs w-[100px] sm:w-auto overflow-y-hidden overflow-x-auto">
              {value}
            </h3>
            {badge && (
              <div className="bg-[#DCFCE7] text-[#3AB449] md:px-2 md:py-1 p-0.5 rounded-md flex items-center gap-1 text-[8px] font-bold">
                <TrendingUp className="md:h-3 md:w-3 h-2 w-2" />
                {badge.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const PaymentStatGrid = () => {
  const stats: PaymentStatCardProps[] = [
    {
      title: "Total Project Value",
      value: "$48,988,078",
      icon: <FileText />,
      bgColor: "bg-[#FF9F43]",
      iconColor: "text-[#FF9F43]",
    },
    {
      title: "Pending Amount",
      value: "$16,478,145",
      icon: <Repeat />,
      bgColor: "bg-[#001E3C]",
      iconColor: "text-[#001E3C]",
    },
    {
      title: "Amount Paid",
      value: "$24,145,789",
      icon: <Gift />,
      bgColor: "bg-[#0D9488]",
      iconColor: "text-[#0D9488]",
    },
    {
      title: "Upcoming Invoice Due",
      value: "$18,458,747",
      icon: (
        <img src={TotalPurchaseReturnIcon} alt="" className="h-full w-full" />
      ),
      bgColor: "bg-[#2563EB]",
      iconColor: "text-[#2563EB]",
      badge: {
        text: "4 days",
        type: "positive",
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 md:gap-4 gap-2 mb-5">
      {stats.map((stat, index) => (
        <PaymentStatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default PaymentStatGrid;
