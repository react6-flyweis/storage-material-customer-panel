import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import PaymentStatGrid from "@/components/payments_and_invoices/PaymentStatGrid";
import PaymentTable from "@/components/payments_and_invoices/PaymentTable";
import { useGetTaxReportQuery, type TaxReportRow } from "@/redux/api/paymentsApi";

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

const TaxReportsPage = () => {
  const { data, isLoading } = useGetTaxReportQuery();

  const renderTaxReportRow = (item: TaxReportRow, index: number) => (
    <tr key={index} className="border-b border-gray-50 last:border-0">
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] first:pl-0">
        {formatDate(item.date)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.invoiceNumber || "-"}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.projectName || "-"}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs">
        <span className="bg-[#EBF5FF] text-[#2563EB] px-3 py-1 rounded-full text-[10px] font-medium uppercase">
          {item.buildingType || "-"}
        </span>
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.location || "-"}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.taxRate ? `${item.taxRate}%` : "-"}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black">
        {formatCurrency(item.contractAmount)}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-[#EF4444] text-center">
        {formatCurrency(item.taxDue)}
      </td>
    </tr>
  );

  return (
    <div className="p-5 space-y-6">
      <TitleSubtitle
        title={"Tax Report"}
        subtitle={
          "Review your project billing, track payments, and download invoice documents."
        }
      />

      <PaymentStatGrid />

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading tax reports...</div>
      ) : (
        <PaymentTable
          title=""
          headers={[
            "Date",
            "Invoice No.",
            "Project Name",
            "Building Type",
            "Location",
            "Tax Rate",
            "Contract Amount",
            "Tax Due",
          ]}
          data={data?.rows || []}
          renderRow={renderTaxReportRow}
          headRowClassName="border-b border-[#00000033]"
        />
      )}
    </div>
  );
};

export default TaxReportsPage;

