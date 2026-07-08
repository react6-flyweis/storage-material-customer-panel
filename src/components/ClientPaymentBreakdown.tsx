import SectionHeaderWithAction from "./common_components/SectionHeaderWithAction";

interface ClientBreakdownItemProps {
  company: string;
  totalInvoiced: string;
  received: string;
  outstanding: string;
}

function ClientBreakdownItem({
  company,
  totalInvoiced,
  received,
  outstanding,
}: ClientBreakdownItemProps) {
  return (
    <div className="p-4 xl:p-6 rounded-md border border-gray-100 bg-white mb-4 last:mb-0 ">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Company Info */}
        <div className="md:flex-1 min-w-[150px]">
          <h4 className="font-semibold text-gray-900 text-xs md:text-base items-start">
            {company}
          </h4>
        </div>

        {/* Details Grid for Mobile / Flex for Desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-3 gap-y-4 md:gap-4 items-start md:items-center">
          {/* Total Invoiced */}
          <div className="flex-1 min-w-0">
            <p className="md:text-xs text-[10px] text-gray-400 uppercase tracking-wider mb-1">
              Total Invoiced
            </p>
            <p className="font-bold text-gray-900 text-sm md:text-base">
              {totalInvoiced}
            </p>
          </div>

          {/* Received */}
          <div className="flex-1 min-w-0">
            <p className="md:text-xs text-[10px] text-gray-400 uppercase tracking-wider mb-1">
              Received
            </p>
            <p className="font-normal text-emerald-500 text-sm md:text-base">
              {received}
            </p>
          </div>

          {/* Outstanding */}
          <div className="flex-1 min-w-0">
            <p className="md:text-xs text-[10px] text-gray-400 uppercase tracking-wider mb-1">
              Outstanding
            </p>
            <p className="font-normal text-red-500 text-sm md:text-base">
              {outstanding}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientPaymentBreakdown() {
  const data: ClientBreakdownItemProps[] = [
    {
      company: "ABC Industries",
      totalInvoiced: "$3,45,000",
      received: "$2,90,000",
      outstanding: "$55,000",
    },
    {
      company: "ABC Industries",
      totalInvoiced: "$3,45,000",
      received: "$2,90,000",
      outstanding: "$55,000",
    },
    {
      company: "ABC Industries",
      totalInvoiced: "$3,45,000",
      received: "$2,90,000",
      outstanding: "$55,000",
    },
    {
      company: "ABC Industries",
      totalInvoiced: "$3,45,000",
      received: "$2,90,000",
      outstanding: "$55,000",
    },
    {
      company: "ABC Industries",
      totalInvoiced: "$3,45,000",
      received: "$2,90,000",
      outstanding: "$55,000",
    },
  ];

  return (
    <div className="bg-white rounded-md xl:p-6 p-4 shadow-sm border border-gray-100/50">
      <SectionHeaderWithAction
        title="Client-wise Payment Breakdown"
        showIcon={false}
        containerClassName="mb-6"
        actionLabel=""
      />
      <div className="space-y-4 overflow-y-auto border-t border-gray-300 pt-6">
        {data.map((item, index) => (
          <ClientBreakdownItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
