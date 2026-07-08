import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

type SectionHeaderWithActionProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  showIcon?: boolean;
  containerClassName?: string;
};

const SectionHeaderWithAction: React.FC<SectionHeaderWithActionProps> = ({
  title,
  subtitle,
  actionLabel = "View Details",
  onActionClick,
  showIcon = true,
  containerClassName = "",
}) => {
  return (
    <div className={containerClassName}>
      <div className="flex justify-between items-start flex-wrap">
        <p className="md:text-xl text-md font-semibold text-black tracking-tight">
          {title}
        </p>

        {actionLabel && (
          <Button
            variant="link"
            onClick={onActionClick}
            className="text-[#1D51A4] md:text-sm text-xs font-normal flex items-center gap-1 p-0 h-auto hover:no-underline ml-auto"
          >
            {showIcon && <ArrowUpRight className="w-4 h-4" />}
            {actionLabel}
          </Button>
        )}
      </div>

      {subtitle && (
        <p className="md:text-sm text-[12px] text-gray-400 mt-2 mb-3 font-regular">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeaderWithAction;
