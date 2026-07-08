import TitleSubtitle from "../components/common_components/TitleSubtitle";
import { PaymentStatCard } from "../components/PaymentStatCard";
import InvoiceManagementTable from "../components/InvoiceManagementTable";
import ClientPaymentBreakdown from "../components/ClientPaymentBreakdown";

const paymentStats = [
  {
    title: "Deposit Payments",
    percentage: "85.9%",
    totalAmount: "$1,56,000",
    receivedAmount: "$1,34,000",
    pendingAmount: "$22,000",
  },
  {
    title: "Progress Payments",
    percentage: "82.2%",
    totalAmount: "$1,56,000",
    receivedAmount: "$1,34,000",
    pendingAmount: "$22,000",
  },
  {
    title: "Final Payments",
    percentage: "88.2%",
    totalAmount: "$1,56,000",
    receivedAmount: "$1,34,000",
    pendingAmount: "$22,000",
  },
];

const PaymentOverview = () => {
  return (
    <div className="p-5 space-y-6">
      <TitleSubtitle
        title="Payment Overview"
        subtitle="Financial performance tracking and management"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 xl:gap-6 gap-3">
        {paymentStats.map((stat, index) => (
          <PaymentStatCard key={index} {...stat} />
        ))}
      </div>

      <InvoiceManagementTable />
      <ClientPaymentBreakdown />
    </div>
  );
};

export default PaymentOverview;
