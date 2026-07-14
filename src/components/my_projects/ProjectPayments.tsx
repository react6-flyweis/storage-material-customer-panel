import { mockPaymentsData } from "../../data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjectPaymentsSummaryQuery, type ProjectInvoice } from "@/redux/api/projectsApi";

interface ProjectPaymentsProps {
  invoices?: ProjectInvoice[];
  leadId?: string;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return "-";
  return `$${amount.toLocaleString()}`;
};

const ProjectPayments = ({ invoices = [], leadId }: ProjectPaymentsProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { id: mockId } = mockPaymentsData;

  const displayId = leadId || mockId;
  const activeLeadId = id || "";

  const { data: summary, isLoading: isSummaryLoading } = useGetProjectPaymentsSummaryQuery(activeLeadId, {
    skip: !activeLeadId,
  });

  return (
    <div className="space-y-6 md:p-6 p-4 md:space-y-8 bg-white rounded-[10px]">
      <div className="flex items-center gap-2">
        <span className="text-(--text-color-black) md:text-lg text-base font-normal">
          Lead ID -
        </span>
        <span className="text-(--text-color-black) text-lg font-bold">
          {displayId}
        </span>
      </div>

      {/* Financial Summary */}
      <div className="bg-[#EFF6FF] rounded-xl md:p-6 p-4 border border-[#EBF2FF]">
        <h3 className="text-(--text-color-black) text-base font-medium mb-6">
          Financial Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-[#717171] text-sm font-normal">Total Payment</p>
            <p className="text-lg font-bold text-gray-900">
              {isSummaryLoading ? "Loading..." : formatCurrency(summary?.totalPayment)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[#717171] text-sm font-normal">Total Paid</p>
            <p className="text-lg font-bold text-[#3AB449]">
              {isSummaryLoading ? "Loading..." : formatCurrency(summary?.totalPaid)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[#717171] text-sm font-normal">
              Outstanding Balance
            </p>
            <p className="text-lg font-bold text-[#EF4444]">
              {isSummaryLoading ? "Loading..." : formatCurrency(summary?.outstandingBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-6">
        <h3 className="text-gray-900 text-lg font-medium">Payment History</h3>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-y border-gray-100">
                <th className="px-6 py-2 text-left text-xs font-normal text-[#717171] uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-2 text-left text-xs font-normal text-[#717171] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-2 text-left text-xs font-normal text-[#717171] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-2 text-left text-xs font-normal text-[#717171] uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-2 text-left text-xs font-normal text-[#717171] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-2 text-left text-xs font-normal text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((payment, index) => (
                  <tr key={payment._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#2563EB] font-medium">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-black">
                      {formatCurrency(payment.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(payment.dueDate)}
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <div
                        className={cn(
                          "min-w-[100px] w-fit px-3 py-1 flex items-center justify-center rounded-full text-xs font-semibold",
                          payment.status === "Paid"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : "bg-[#FFF7ED] text-[#EA580C]"
                        )}
                      >
                        {payment.status}
                      </div>
                      {payment.status === "Pending" && (
                        <button onClick={() => navigate("/payments")} className="text-[#3AB449] ml-5 text-xs font-normal hover:underline">
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectPayments;
