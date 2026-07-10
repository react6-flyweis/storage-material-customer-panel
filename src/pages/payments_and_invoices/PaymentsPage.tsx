import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import PaymentStatGrid from "@/components/payments_and_invoices/PaymentStatGrid";
import PaymentTable from "@/components/payments_and_invoices/PaymentTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PaymentModal from "./PaymentModal";
import { useState } from "react";
import { useGetPaymentsQuery, type PaymentItemDetail } from "@/redux/api/paymentsApi";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const formatCurrency = (val?: number | null) => {
  if (val === undefined || val === null || val === 0) return "-";
  return `$${val.toLocaleString()}`;
};

const getProjectName = (item: PaymentItemDetail) => {
  if (!item.lead) return "-";
  const { buildingType, location } = item.lead;
  if (buildingType && location) {
    const formattedBuildingType = buildingType.charAt(0).toUpperCase() + buildingType.slice(1);
    return `${formattedBuildingType} - ${location}`;
  }
  return buildingType || location || "-";
};

const getDueDate = (item: PaymentItemDetail) => {
  if (!item.date) return "-";
  const d = new Date(item.date);
  if (isNaN(d.getTime())) return "-";
  if (item.daysToPay) {
    d.setDate(d.getDate() + item.daysToPay);
  }
  return formatDate(d.toISOString());
};

const getTaxAmount = (item: PaymentItemDetail) => {
  if (item.lineItems && Array.isArray(item.lineItems)) {
    const totalTax = item.lineItems.reduce((acc: number, current) => acc + (current.tax || 0), 0);
    return formatCurrency(totalTax);
  }
  return "-";
};

const PaymentsPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { data } = useGetPaymentsQuery();

  const upcomingList = data?.upcoming || [];
  const overdueList = data?.overdue || [];
  const paidList = data?.paid || [];

  const renderPaymentRow = (item: PaymentItemDetail, color: string) => (
    <tr key={item._id} className="border-b border-gray-50 last:border-0">
      <td className="py-4 px-4 md:text-sm text-xs max-w-[150px] text-[#6B7280] first:pl-0">
        {item.invoiceNumber || "-"}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs max-w-[150px] font-normal text-black">
        {getProjectName(item)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-black max-w-[150px]">
        {getDueDate(item)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black max-w-[150px]">
        {formatCurrency(item.totalAmount)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] max-w-[100px]">
        {formatDate(item.date)}
      </td>
      <td className="py-4 px-4 text-right last:pr-0 max-w-[150px] flex justify-center items-center">
        <Button
          onClick={() => setIsPaymentModalOpen(true)}
          className={cn(
            "text-white px-6 py-1 h-auto text-xs font-semibold rounded-md",
            color,
          )}
        >
          Pay Now
        </Button>
      </td>
    </tr>
  );

  const renderHistoryRow = (item: PaymentItemDetail) => (
    <tr
      key={item._id}
      className="border-y border-[#00000033] last:border-0"
    >
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] first:pl-0">
        {item.invoiceNumber || "-"}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-[#6B7280]">
        {getProjectName(item)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-black">
        {formatDate(item.paidAt || item.updatedAt)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black">
        {formatCurrency(item.totalAmount)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-black">
        {getTaxAmount(item)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        -
      </td>
      <td className="py-4 px-4 text-right last:pr-0 max-w-[150px] flex justify-center items-center">
        <span className="bg-[#DCFCE7] text-[#3AB449] px-10 py-1.5 rounded-full text-xs font-normal">
          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="p-5 space-y-6">
      <TitleSubtitle
        title={"Payments"}
        subtitle={
          "Review your project billing, track payments, and download invoice documents."
        }
      />

      <PaymentStatGrid />

      {/* Upcoming Payments */}
      <PaymentTable
        title="Upcoming Payments"
        headers={[
          "Payment ID",
          "Project Name",
          "Due Date",
          "Amount",
          "Over due From",
          "Action",
        ]}
        data={upcomingList}
        renderRow={(item) =>
          renderPaymentRow(item, "bg-[#3AB449] hover:bg-[#2F923B]")
        }
        headRowClassName="border-b border-[#00000033]"
      />

      {/* Payment Overdue */}
      <PaymentTable
        title="Payment Overdue"
        titleColor="text-[#EF4444]"
        headers={[
          "Payment ID",
          "Project Name",
          "Due Date",
          "Amount",
          "Over due From",
          "Action",
        ]}
        data={overdueList}
        renderRow={(item) =>
          renderPaymentRow(item, "bg-[#EF4444] hover:bg-[#DC2626]")
        }
        headRowClassName="border-b border-[#00000033]"
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Payment History */}
      <PaymentTable
        title="Payment History"
        headers={[
          "Transaction ID",
          "Project Name",
          "Payment Date",
          "Amount",
          "Tax",
          "Payment Mode",
          "Status",
        ]}
        data={paidList}
        renderRow={renderHistoryRow}
      />
    </div>
  );
};

export default PaymentsPage;
