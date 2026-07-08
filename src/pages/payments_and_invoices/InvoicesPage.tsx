import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import PaymentStatGrid from "@/components/payments_and_invoices/PaymentStatGrid";
import PaymentTable from "@/components/payments_and_invoices/PaymentTable";
import { invoiceList } from "@/data/PaymentsData";
import type { InvoiceListItem } from "@/data/PaymentsData";
import { useNavigate } from "react-router-dom";
import invoice from "../../assets/Invoice_placeholder.png";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const renderInvoiceRow = (item: InvoiceListItem) => (
    <tr
      key={item.invoiceId}
      className="border-b border-[#00000033] last:border-0"
    >
      <td className="py-4 px-4 md:text-sm text-xs max-w-[100px] text-[#6B7280] first:pl-0">
        {item.invoiceId}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs max-w-[150px] font-normal text-[#6B7280]">
        {item.projectName}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] max-w-[150px]">
        {item.milestone}
      </td>
      <td className="py-4 px-4 md:text-sm text-xs font-normal text-black max-w-[150px]">
        {item.amount}
      </td>
      <td className="py-4 md:text-sm text-xs text-[#6B7280] max-w-[100px]">
        {item.invoiceDate || "-"}
      </td>
      <td className="py-4 px-4 text-center last:pr-0 w-fit flex justify-center items-center">
        <span className="bg-[#DCFCE7] text-[#3AB449] px-3 py-1.5 rounded-full text-xs font-normal">
          {item.status}
        </span>
      </td>
      <td className="py-4 text-sm text-center">
        <div className="flex justify-start items-center gap-2">
          <a href={invoice} download="invoice.png" className="text-(--button-bg-primary-color) px-2 py-1 text-xs font-normal rounded-md cursor-pointer">

            Download
          </a>
          <div
            className="text-(--button-bg-primary-color) px-2 py-1 text-xs font-normal rounded-md cursor-pointer"
            onClick={() => navigate("/invoice_preview")}
          >
            View
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-5 space-y-6">
      <TitleSubtitle
        title={"Invoices"}
        subtitle={
          "Review your project billing, track payments, and download invoice documents."
        }
      />

      <PaymentStatGrid />

      {/* Payment History */}
      <PaymentTable
        title="Invoice list"
        headers={[
          "Invoice No.",
          "Project Name",
          "Milestone",
          "Amount",
          "Invoice Date",
          "Status",
          "Action",
        ]}
        data={invoiceList}
        renderRow={renderInvoiceRow}
        headRowClassName="border-b border-[#00000033]"
      />
    </div>
  );
};

export default InvoicesPage;
