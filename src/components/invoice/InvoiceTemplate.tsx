import logo from "@/assets/logo.svg";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatInvoiceDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatStageName(
  name: string | null | undefined,
  amount: number | null | undefined,
  amountType: string | null | undefined,
) {
  const stageName = name || "Payment";
  if (amountType === "percentage" && amount != null) {
    const pctStr = `${amount}%`;
    if (!stageName.includes("%")) {
      return `${stageName} (${pctStr})`;
    }
  }
  return stageName;
}

export interface InvoiceTemplateProps {
  invoiceNumber?: string;
  date?: string;
  daysToPay?: string | number;
  subtotal?: number;
  taxAmount?: number;
  total?: number;
  discount?: number;
  depositAmount?: number;
  items?: Array<{
    id?: string;
    description?: string;
    notes?: string;
    rate?: number;
    quantity?: number;
    total?: number;
    images?: string[];
    photos?: string[];
    items?: string[];
  }>;
  stages?: Array<{
    _id?: string;
    stageName?: string | null;
    amount?: number | null;
    amountType?: string | null;
    dueDate?: string | null;
    status?: string | null;
  }>;
}

export default function InvoiceTemplate({
  invoiceNumber = "-",
  date = "-",
  daysToPay = "15",
  subtotal = 0,
  taxAmount = 0,
  total = 0,
  discount = 0,
  depositAmount,
  items = [],
  stages = [],
}: InvoiceTemplateProps) {
  const deposit = depositAmount ?? total * 0.25;
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-lg p-6 sm:p-14 shadow-sm mx-auto max-w-8xl">
      <h1 className="text-center text-gray-300 font-bold text-md md:text-xl tracking-widest uppercase mb-12">
        Invoice
      </h1>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-16 ">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center shrink-0">
              <img src={logo} alt="Logo" className="h-12 object-contain" />
            </div>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            1851 Madison Ave Suite 300
            <br />
            Council Bluffs, IA
            <br />
            51503
            <br />
            United States
            <br />
            travis@storagematerials.com
            <br />
            www.storagematerials.com
          </div>
        </div>

        <div className="min-w-55 space-y-2">
          <div className="flex justify-between text-sm gap-4">
            <span className="text-gray-500 font-medium">Payment terms</span>
            <span className="text-gray-900">
              {daysToPay === "-" || !daysToPay ? "-" : `${daysToPay} days`}
            </span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-gray-500 font-medium">Invoice #</span>
            <span className="text-gray-900">{invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-gray-500 font-medium">Date</span>
            <span className="text-gray-900">{formatInvoiceDate(date)}</span>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-12">
        <div className="flex justify-between border-b border-gray-800 pb-2 mb-6">
          <span className="text-sm font-bold text-gray-700">
            Description
          </span>
          <div className="flex gap-8">
            <span className="text-sm font-bold text-gray-700 w-20 text-right">Rate</span>
            <span className="text-sm font-bold text-gray-700 w-12 text-right">Qty</span>
            <span className="text-sm font-bold text-gray-700 w-24 text-right">Total</span>
          </div>
        </div>

        <div className="space-y-8">
          {items.map((item, index) => {
            const itemRate = item.rate ?? 0;
            const itemQty = item.quantity ?? 0;
            const itemTotal = item.total ?? (itemRate * itemQty);
            const itemImages = item.images ?? item.photos ?? [];
            const itemDetails = item.items ?? [];

            return (
              <div
                key={item.id ?? index}
                className={index > 0 ? "border-t border-gray-100 pt-4" : ""}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {item.description || "Item Description"}
                  </span>
                  <div className="flex gap-8">
                    <span className="text-sm text-gray-500 w-20 text-right">
                      ${formatCurrency(itemRate)}
                    </span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {itemQty}
                    </span>
                    <span className="text-sm text-gray-600 w-24 text-right">
                      ${formatCurrency(itemTotal)}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <div className="text-[10px] text-gray-400 mb-2">
                    {item.notes}
                  </div>
                )}

                {itemDetails.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap mb-3">
                    {itemDetails.map((it, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 border border-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]"
                      >
                        {it}
                      </div>
                    ))}
                  </div>
                )}

                {/* Display Photos if any */}
                {itemImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-3 mb-4">
                    {itemImages.map((photo, i) => (
                      <div
                        key={i}
                        className="w-64 h-40 overflow-hidden rounded-sm bg-gray-100"
                      >
                        <img
                          src={
                            photo.startsWith("blob:") ||
                            photo.startsWith("http")
                              ? photo
                              : FALLBACK_IMAGE
                          }
                          alt={`Item photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-4">
              No line items available
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-900 font-bold">Subtotal</span>
            <span className="text-gray-500">
              ${formatCurrency(Number(subtotal))}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-red-600">Discount</span>
              <span className="text-red-600 font-medium">
                -${formatCurrency(Number(discount))}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
            <span className="text-gray-500">Tax</span>
            <span className="text-gray-500">
              ${formatCurrency(Number(taxAmount))}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-1">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="text-gray-900 font-bold">
              ${formatCurrency(Number(total))}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-900 font-medium">Deposit Due</span>
            <span className="text-gray-900 font-bold">
              ${formatCurrency(Number(deposit))}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Schedule Section */}
      {stages.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-800 flex justify-end">
          <div className="w-full lg:w-3/4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Payment Schedule
            </h2>
            <div className="border-t border-b border-gray-200 divide-y divide-gray-100">
              {stages.map((stage, i) => {
                const label = formatStageName(
                  stage.stageName,
                  stage.amount,
                  stage.amountType,
                );
                const amount =
                  stage.amountType === "percentage"
                    ? (total * (stage.amount ?? 0)) / 100
                    : (stage.amount ?? 0);

                return (
                  <div
                    key={stage._id ?? i}
                    className="flex justify-between py-3 text-sm"
                  >
                    <span className="text-gray-600 font-medium">{label}</span>
                    <span className="text-gray-900 font-bold">
                      ${formatCurrency(amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6">
        <p className="text-[10px] text-gray-500 mb-8">
          Thank you for your business? Reach out with any questions
        </p>
        <p className="text-[10px] text-gray-500 mb-16">
          By Signing this document the customer agrees to the services and
          conditions outlined in this document
        </p>

        <div className="flex justify-end">
          <div className="border-t border-gray-400 w-64 pt-2">
            <p className="text-xs text-gray-500">Client signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
