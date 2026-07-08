import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import PaymentStatGrid from "@/components/payments_and_invoices/PaymentStatGrid";
import PaymentTable from "@/components/payments_and_invoices/PaymentTable";
import { taxReportList } from "@/data/PaymentsData";
import type { TaxReportItem } from "@/data/PaymentsData";

const TaxReportsPage = () => {
  const renderTaxReportRow = (item: TaxReportItem, index: number) => (
    <tr key={index} className="">
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] first:pl-0">
        {item.date}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs">
        <span className="bg-[#EBF5FF] text-[#2563EB] px-3 py-1 rounded-full text-[10px] font-medium uppercase">
          {item.buildingType}
        </span>
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.city}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.taxId}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.state}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.zip}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280]">
        {item.taxRate}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black">
        {item.contractAmount}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-[#EF4444] text-center">
        {item.taxDue}
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

      <PaymentTable
        title=""
        headers={[
          "Date",
          "Building Type",
          "City",
          "Tax ID",
          "State",
          "zip",
          "Tax Rate",
          "Contract Amount",
          "Tax Due",
        ]}
        data={taxReportList}
        renderRow={renderTaxReportRow}
        headRowClassName="border-b border-[#00000033]"
      />
    </div>
  );
};

export default TaxReportsPage;
