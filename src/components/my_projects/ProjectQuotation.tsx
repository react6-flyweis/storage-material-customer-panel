import { Loader2 } from "lucide-react";
import { useGetProjectDetailsQuery, useGetProjectQuotationQuery } from "@/redux/api/projectsApi";
import { useAppSelector } from "@/redux/hooks";
import QuotationCard from "./QuotationCard";

interface ProjectQuotationProps {
  leadId: string;
}

const ProjectQuotation = ({ leadId }: ProjectQuotationProps) => {
  const { data: projectDetails, isLoading: isProjectLoading, error: projectError } = useGetProjectDetailsQuery(leadId, {
    skip: !leadId,
  });

  const { data: quotationData, isLoading: isQuotationLoading, error: quotationError } = useGetProjectQuotationQuery(leadId, {
    skip: !leadId,
  });

  const user = useAppSelector((state) => state.auth.user);

  const isLoading = isProjectLoading || isQuotationLoading;
  const hasError = projectError || quotationError;

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center bg-white rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-red-500 bg-white rounded-lg">
        Failed to load quotation details. Please try again later.
      </div>
    );
  }

  if (!quotationData?.quotation) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-gray-500 bg-white rounded-lg">
        No quotation details available for this project.
      </div>
    );
  }

  const customerData = user ? {
    firstName: user.firstName,
    email: user.email,
    _id: user._id,
  } : undefined;

  return (
    <div className="rounded-lg bg-white p-5 w-full">
      <QuotationCard
        quotation={quotationData.quotation}
        lead={projectDetails?.lead}
        customer={customerData}
      />
    </div>
  );
};

export default ProjectQuotation;
