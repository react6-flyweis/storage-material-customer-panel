import { mockPaymentsData } from "../../data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const ProjectPayments = () => {
  const navigate = useNavigate();
  const { summary, history, id } = mockPaymentsData;

  return (
    <div className="space-y-6 md:p-6 p-4 md:space-y-8 bg-white rounded-[10px]">
      <div className="flex items-center gap-2">
        <span className="text-(--text-color-black) md:text-lg text-base font-normal">
          Lead ID -
        </span>
        <span className="text-(--text-color-black) text-lg font-bold">
          {id}
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
              {summary.totalPayment}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[#717171] text-sm font-normal">Total Paid</p>
            <p className="text-lg font-bold text-[#3AB449]">
              {summary.totalPaid}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[#717171] text-sm font-normal">
              Outstanding Balance
            </p>
            <p className="text-lg font-bold text-[#EF4444]">
              {summary.outstandingBalance}
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
              {history.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {payment.invoiceNo}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#2563EB] font-medium">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-black">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {payment.dueDate}
                  </td>
                  <td className="px-6 py-4 flex">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectPayments;
