import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import PaymentStatGrid from "@/components/payments_and_invoices/PaymentStatGrid";
import PaymentTable from "@/components/payments_and_invoices/PaymentTable";
import {
  upcomingPayments,
  overduePayments,
  paymentHistory,
} from "@/data/PaymentsData";
import type { PaymentItem, PaymentHistoryItem } from "@/data/PaymentsData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PaymentModal from "./PaymentModal";
import { useState } from "react";

const PaymentsPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const renderPaymentRow = (item: PaymentItem, color: string) => (
    <tr key={item.id} className="border-b border-gray-50 last:border-0">
      <td className="py-4 px-4 md:text-sm text-xs max-w-[150px] text-[#6B7280] first:pl-0">
        {item.id}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs max-w-[150px] font-normal text-black">
        {item.projectName}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-black max-w-[150px]">
        {item.dueDate}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black max-w-[150px]">
        {item.amount}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] max-w-[100px]">
        {item.overdueFrom || "-"}
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

  const renderHistoryRow = (item: PaymentHistoryItem) => (
    <tr
      key={item.transactionId}
      className="border-y border-[#00000033] last:border-0"
    >
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] first:pl-0">
        {item.transactionId}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-[#6B7280]">
        {item.projectName}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-black">
        {item.paymentDate}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black">
        {item.amount}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-black">{item.tax}</td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.mode}
      </td>
      <td className="py-4 px-4 text-right last:pr-0 max-w-[150px] flex justify-center items-center">
        <span className="bg-[#DCFCE7] text-[#3AB449] px-10 py-1.5 rounded-full text-xs font-normal">
          {item.status}
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
        data={upcomingPayments}
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
        data={overduePayments}
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
        data={paymentHistory}
        renderRow={renderHistoryRow}
      />
    </div>
  );
};

export default PaymentsPage;
