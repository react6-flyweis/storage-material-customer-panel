import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Repeat, Gift, TrendingUp } from "lucide-react";
import TotalPurchaseReturnIcon from "@/assets/icon/TotalPurchaseReturnIcon.svg";
import { useGetInvoiceStatsQuery } from "@/redux/api/paymentsApi";

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
              <div
                className={cn(
                  "md:px-2 md:py-1 p-0.5 rounded-md flex items-center gap-1 text-[8px] font-bold",
                  badge.type === "negative"
                    ? "bg-[#FEE2E2] text-[#EF4444]"
                    : "bg-[#DCFCE7] text-[#3AB449]"
                )}
              >
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

const formatCurrency = (val?: number | null) => {
  if (val === undefined || val === null) return "-";
  return `$${val.toLocaleString()}`;
};

const getDaysDiffText = (dateStr?: string | null) => {
  if (!dateStr) return undefined;
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return undefined;
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return { text: "Due Today", type: "positive" as const };
  } else if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} Days Overdue`, type: "negative" as const };
  } else {
    return { text: `Due in ${diffDays} Days`, type: "positive" as const };
  }
};

const PaymentStatGrid = ({
  totalProjectValue,
  pendingAmount,
  amountPaid,
  upcomingInvoiceDue,
  upcomingInvoiceDueDays,
}: {
  totalProjectValue?: string;
  pendingAmount?: string;
  amountPaid?: string;
  upcomingInvoiceDue?: string;
  upcomingInvoiceDueDays?: string;
}) => {
  const { data, isLoading } = useGetInvoiceStatsQuery();

  // If loading or data is not present yet, we can fallback to props or display "-"
  const displayTotalProjectValue =
    totalProjectValue !== undefined
      ? totalProjectValue
      : isLoading
      ? "-"
      : formatCurrency(data?.totalProjectValue);

  const displayPendingAmount =
    pendingAmount !== undefined
      ? pendingAmount
      : isLoading
      ? "-"
      : formatCurrency(data?.pendingAmount);

  const displayAmountPaid =
    amountPaid !== undefined
      ? amountPaid
      : isLoading
      ? "-"
      : formatCurrency(data?.amountPaid);

  const displayUpcomingInvoiceDue =
    upcomingInvoiceDue !== undefined
      ? upcomingInvoiceDue
      : isLoading
      ? "-"
      : data?.upcomingInvoiceDue
      ? formatCurrency(data.upcomingInvoiceDue.totalAmount)
      : "-";

  const badgeInfo =
    upcomingInvoiceDueDays !== undefined
      ? { text: upcomingInvoiceDueDays, type: "positive" as const }
      : data?.upcomingInvoiceDue?.dueDate
      ? getDaysDiffText(data.upcomingInvoiceDue.dueDate)
      : undefined;

  const stats: PaymentStatCardProps[] = [
    {
      title: "Total Project Value",
      value: displayTotalProjectValue,
      icon: <FileText />,
      bgColor: "bg-[#FF9F43]",
      iconColor: "text-[#FF9F43]",
    },
    {
      title: "Pending Amount",
      value: displayPendingAmount,
      icon: <Repeat />,
      bgColor: "bg-[#001E3C]",
      iconColor: "text-[#001E3C]",
    },
    {
      title: "Amount Paid",
      value: displayAmountPaid,
      icon: <Gift />,
      bgColor: "bg-[#0D9488]",
      iconColor: "text-[#0D9488]",
    },
    {
      title: "Upcoming Invoice Due",
      value: displayUpcomingInvoiceDue,
      icon: (
        <img src={TotalPurchaseReturnIcon} alt="" className="h-full w-full" />
      ),
      bgColor: "bg-[#2563EB]",
      iconColor: "text-[#2563EB]",
      badge: badgeInfo,
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

