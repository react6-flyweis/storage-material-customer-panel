import TitleSubtitle from "@/components/common_components/TitleSubtitle";
import PaymentStatGrid from "@/components/payments_and_invoices/PaymentStatGrid";
import PaymentTable from "@/components/payments_and_invoices/PaymentTable";
import { useNavigate } from "react-router-dom";
import invoice from "../../assets/Invoice_placeholder.png";
import { useGetInvoicesQuery, type InvoiceDetail, type InvoiceProject } from "@/redux/api/paymentsApi";
import { cn } from "@/lib/utils";

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

const getProjectName = (project: InvoiceProject) => {
  if (!project.lead) return "-";
  const { buildingType, location, _id } = project.lead;
  if (buildingType && location) {
    const formattedBuildingType = buildingType.charAt(0).toUpperCase() + buildingType.slice(1);
    return `${formattedBuildingType} - ${location}`;
  }
  if (buildingType || location) {
    return buildingType || location || "-";
  }
  return `Project (${_id.slice(-5)})`;
};

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetInvoicesQuery();

  const invoices = (data?.projects || []).flatMap((project) => {
    const projectName = getProjectName(project);
    return project.invoices.map((inv) => ({
      ...inv,
      projectName,
    }));
  });

  const getStatusStyles = (status: string) => {
    const normalized = status?.toLowerCase();
    if (normalized === "paid") {
      return "bg-[#DCFCE7] text-[#3AB449]";
    }
    if (normalized === "draft") {
      return "bg-gray-100 text-[#6B7280]";
    }
    return "bg-yellow-100 text-yellow-600";
  };

  const renderInvoiceRow = (item: InvoiceDetail & { projectName: string }) => {
    const milestone = item.lineItems?.flatMap((li) => li.items || []).join(", ") || "-";

    return (
      <tr
        key={item._id}
        className="border-b border-[#00000033] last:border-0"
      >
        <td className="py-4 px-4 md:text-sm text-xs max-w-[100px] text-[#6B7280] first:pl-0">
          {item.invoiceNumber || "-"}
        </td>
        <td className="py-4 px-4 md:text-sm text-xs max-w-[150px] font-normal text-[#6B7280]">
          {item.projectName}
        </td>
        <td className="py-4 px-4 md:text-sm text-xs text-[#6B7280] max-w-[150px]">
          {milestone}
        </td>
        <td className="py-4 px-4 md:text-sm text-xs font-normal text-black max-w-[150px]">
          {formatCurrency(item.totalAmount)}
        </td>
        <td className="py-4 md:text-sm text-xs text-[#6B7280] max-w-[100px]">
          {formatDate(item.date)}
        </td>
        <td className="py-4 px-4 text-center last:pr-0 w-fit flex justify-center items-center">
          <span className={cn("px-3 py-1.5 rounded-full text-xs font-normal", getStatusStyles(item.status))}>
            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}
          </span>
        </td>
        <td className="py-4 text-sm text-center">
          <div className="flex justify-start items-center gap-2">
            <a href={invoice} download="invoice.png" className="text-(--button-bg-primary-color) px-2 py-1 text-xs font-normal rounded-md cursor-pointer">
              Download
            </a>
            <div
              className="text-(--button-bg-primary-color) px-2 py-1 text-xs font-normal rounded-md cursor-pointer"
              onClick={() => navigate(`/invoice_preview?id=${item._id}`, {
                state: {
                  id: item._id,
                  invoiceNumber: item.invoiceNumber,
                  date: formatDate(item.date),
                  daysToPay: item.daysToPay?.toString() || "15",
                  items: item.lineItems?.map((li) => ({
                    id: li._id,
                    description: li.items?.join(", ") || "Project Item",
                    rate: li.rate || 0,
                    quantity: li.quantity || 1,
                    photos: li.images,
                  })) || [],
                  subtotal: item.subtotal,
                  taxAmount: item.lineItems?.reduce((acc, curr) => acc + (curr.tax || 0), 0) || 0,
                  total: item.totalAmount,
                }
              })}
            >
              View
            </div>
          </div>
        </td>
      </tr>
    );
  };

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
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading invoices...</div>
      ) : (
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
          data={invoices}
          renderRow={renderInvoiceRow}
          headRowClassName="border-b border-[#00000033]"
        />
      )}
    </div>
  );
};

export default InvoicesPage;
