import logo from "@/assets/logo.png";
import type {
  InvoiceAddress,
  InvoiceBankDetails,
} from "@/redux/api/paymentsApi";

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

const DEFAULT_COMPANY_ADDRESS_LINES = [
  "1851 Madison Ave Suite 300",
  "Council Bluffs, IA 51503",
  "United States",
  "info@steelbuildingdepot.com",
  "www.steelbuildingdepot.com",
];

const DEFAULT_BANK_DETAILS: InvoiceBankDetails = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  routingNumber: "",
  swiftCode: "",
  iban: "",
  branchAddress: "",
  paymentInstructions: "",
};

function getAddressLines(
  address?: InvoiceAddress | null,
  fallbackLines?: string[],
): string[] {
  if (!address) return fallbackLines ?? [];
  if (address.lines && address.lines.length > 0) {
    return address.lines;
  }
  const lines: string[] = [];
  if (address.line1) lines.push(address.line1);
  if (address.line2) lines.push(address.line2);
  const cityStateZip = [
    address.city,
    [address.state, address.postalCode].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  if (cityStateZip) lines.push(cityStateZip);
  if (address.country) lines.push(address.country);

  return lines.length > 0 ? lines : (fallbackLines ?? []);
}

export interface InvoiceTemplateProps {
  invoiceNumber?: string;
  date?: string;
  dueDate?: string | null;
  daysToPay?: string | number;
  subtotal?: number;
  taxAmount?: number;
  total?: number;
  discount?: number;
  depositAmount?: number;
  companyEmail?: string;
  companyWebsite?: string;
  billingAddress?: InvoiceAddress | null;
  recipientAddress?: InvoiceAddress | null;
  bankDetails?: InvoiceBankDetails | null;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
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
    taxAmount?: number;
    tax?: number;
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
  dueDate,
  daysToPay = "15",
  subtotal = 0,
  taxAmount = 0,
  total = 0,
  discount = 0,
  depositAmount,
  billingAddress,
  recipientAddress,
  bankDetails,
  customer,
  items = [],
  stages = [],
}: InvoiceTemplateProps) {
  const deposit = depositAmount ?? total * 0.25;
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop";

  const sellerAddress = billingAddress;
  const sellerCompanyName =
    sellerAddress?.companyName || "STEEL BUILDING DEPOT";
  const sellerLines = getAddressLines(
    sellerAddress,
    DEFAULT_COMPANY_ADDRESS_LINES,
  );

  const customerFullName = customer
    ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim()
    : "";
  const recipientCompanyName =
    recipientAddress?.companyName || customerFullName || "Valued Customer";
  const recipientLines = getAddressLines(recipientAddress);
  const hasRecipientInfo = Boolean(
    recipientAddress?.companyName ||
      recipientLines.length > 0 ||
      customerFullName ||
      customer?.email,
  );

  const bank = {
    bankName: bankDetails?.bankName || DEFAULT_BANK_DETAILS.bankName,
    accountName: bankDetails?.accountName || DEFAULT_BANK_DETAILS.accountName,
    accountNumber:
      bankDetails?.accountNumber || DEFAULT_BANK_DETAILS.accountNumber,
    routingNumber:
      bankDetails?.routingNumber || DEFAULT_BANK_DETAILS.routingNumber,
    swiftCode: bankDetails?.swiftCode || "",
    iban: bankDetails?.iban || "",
    branchAddress: bankDetails?.branchAddress || "",
    paymentInstructions:
      bankDetails?.paymentInstructions ||
      DEFAULT_BANK_DETAILS.paymentInstructions,
  };

  return (
    <div className="bg-white rounded-lg p-6 sm:p-14 shadow-sm mx-auto max-w-8xl">
      <h1 className="text-center text-gray-300 font-bold text-md md:text-xl tracking-widest uppercase mb-12">
        Invoice
      </h1>

      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16 items-start">
        {/* Seller / Billing Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-10 max-w-56 object-contain object-left"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              {sellerCompanyName}
            </h2>
            <div className="text-xs text-gray-500 leading-relaxed mt-1">
              {sellerLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Billed To / Recipient Address */}
        <div className="space-y-2 md:pl-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Billed To
          </span>
          {hasRecipientInfo ? (
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">
                {recipientCompanyName}
              </p>
              {customer?.email && recipientCompanyName !== customer.email && (
                <p className="text-gray-500">{customer.email}</p>
              )}
              {recipientLines.map((line, idx) => (
                <p key={idx} className="text-gray-500">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">
              Client details on file
            </div>
          )}
        </div>

        {/* Invoice Meta */}
        <div className="min-w-50 space-y-2 md:text-right">
          <div className="flex md:justify-end justify-between gap-4 text-sm">
            <span className="text-gray-500 font-medium">Payment terms</span>
            <span className="text-gray-900">
              {daysToPay === "-" || !daysToPay ? "-" : `${daysToPay} days`}
            </span>
          </div>
          <div className="flex md:justify-end justify-between gap-4 text-sm">
            <span className="text-gray-500 font-medium">Invoice #</span>
            <span className="text-gray-900 font-bold">{invoiceNumber}</span>
          </div>
          <div className="flex md:justify-end justify-between gap-4 text-sm">
            <span className="text-gray-500 font-medium">Date</span>
            <span className="text-gray-900">{formatInvoiceDate(date)}</span>
          </div>
          {dueDate && (
            <div className="flex md:justify-end justify-between gap-4 text-sm">
              <span className="text-gray-500 font-medium">Due Date</span>
              <span className="text-gray-900">{formatInvoiceDate(dueDate)}</span>
            </div>
          )}
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
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
        {/* Left: Banking & Wire Info */}
        <div className="w-full max-w-md">
          <div className="pb-2 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">
              Banking & Wire Info
            </h3>
          </div>

          <div className="py-2.5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Bank</span>
              <span className="font-semibold text-gray-900">
                {bank.bankName || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Account Name</span>
              <span className="font-semibold text-gray-900">
                {bank.accountName || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Account #</span>
              <span className="font-semibold text-gray-900 font-mono">
                {bank.accountNumber || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Routing #</span>
              <span className="font-semibold text-gray-900 font-mono">
                {bank.routingNumber || "-"}
              </span>
            </div>
            {Boolean(bank.swiftCode) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">SWIFT</span>
                <span className="font-semibold text-gray-900 font-mono">
                  {bank.swiftCode}
                </span>
              </div>
            )}
            {Boolean(bank.iban) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">IBAN</span>
                <span className="font-semibold text-gray-900 font-mono">
                  {bank.iban}
                </span>
              </div>
            )}
            {Boolean(bank.branchAddress) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Branch Address</span>
                <span className="font-semibold text-gray-900">
                  {bank.branchAddress}
                </span>
              </div>
            )}
          </div>

          {Boolean(bank.paymentInstructions) && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                Memo: {bank.paymentInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Right: Totals */}
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
