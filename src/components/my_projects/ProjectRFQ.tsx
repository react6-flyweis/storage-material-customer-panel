import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetProjectRFQQuery } from "@/redux/api/projectsApi";
import PDF_URL from "../../assets/dummy-pdf_2.pdf";

const ProjectRFQ = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, error } = useGetProjectRFQQuery(id || "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-white p-5">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg bg-white p-5 text-center">
        <p className="text-[16px] text-red-500">Failed to load RFQ details.</p>
        <Button
          variant="outline"
          className="mt-4 border-[#2563EB] text-[#2563EB]"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
    );
  }

  const { rfq, quotation } = data;

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatCurrency = (val: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Dimensions formatted text
  const dimensionsText = quotation
    ? `${quotation.width}' × ${quotation.length}' × ${quotation.height}'`
    : rfq.width && rfq.length
    ? `${rfq.width}' × ${rfq.length}'`
    : "";

  return (
    <div className="rounded-lg bg-white p-5">
      <div className="mb-8 flex items-center gap-1">
        <span className="text-[16px] text-[#101828]">Lead ID -</span>
        <span className="text-[16px] font-bold text-[#101828]">{rfq.jobId || id}</span>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            ✅ Quote Summary
          </h2>

          <h3 className="mb-4 text-[18px] font-bold text-[#101828]">
            {rfq.projectName || "Your Custom Steel Building Quote"}
          </h3>

          <ul className="list-disc space-y-3 pl-8 text-[16px] text-[#101828]">
            <li>Building Type: {capitalize(quotation?.buildingType || rfq.buildingType || "") || "-"}</li>
            {dimensionsText && <li>Dimensions: {dimensionsText}</li>}
            <li>Roof Style: {capitalize(quotation?.roofStyle || rfq.roofStyle || "") || "-"} Roof</li>
            <li>
              Location: {quotation?.location || rfq.location || "-"}
              {quotation && (quotation.windLoad || quotation.snowLoad) ? (
                ` (designed for ${quotation.windLoad || "N/A"} wind load, ${quotation.snowLoad || "N/A"} snow load)`
              ) : ""}
            </li>
            <li>Estimated Delivery: {quotation?.estimatedDelivery || "—"}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            💰 Estimated Price Range
          </h2>

          <p className="mb-4 text-[18px] font-bold text-[#101828]">
            {quotation
              ? `${formatCurrency(quotation.basePrice, quotation.currency)} – ${formatCurrency(quotation.maxPrice, quotation.currency)}`
              : rfq.quoteValue
              ? formatCurrency(rfq.quoteValue)
              : "—"}
          </p>

          <p className="max-w-[850px] text-[14px] leading-7 text-[#4A5565]">
            (This is an estimate based on your inputs. Final pricing
            will be confirmed after engineering review and foundation
            requirements.)
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            📦 What’s Included
          </h2>

          {quotation?.includedMaterials && quotation.includedMaterials.length > 0 ? (
            <ul className="list-disc space-y-4 pl-8 text-[16px] text-[#101828]">
              {quotation.includedMaterials.map((item) => (
                <li key={item._id}>
                  <span className="font-semibold">{item.name}</span>
                  {item.description ? `: ${item.description}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[16px] text-gray-500 pl-8">—</p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            🛠 Optional Add-Ons
          </h2>

          {quotation?.optionalAddOns && quotation.optionalAddOns.length > 0 ? (
            <ul className="list-disc space-y-4 pl-8 text-[16px] text-[#101828]">
              {quotation.optionalAddOns.map((item) => (
                <li key={item._id}>
                  <span className="font-semibold">{item.name}</span>
                  {item.description ? `: ${item.description}` : ""}
                  {item.price ? ` - ${formatCurrency(item.price, quotation.currency)}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[16px] text-gray-500 pl-8">—</p>
          )}
        </section>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            className="h-14 w-[280px] rounded-lg border-[#2563EB] text-[16px] font-medium text-[#2563EB]"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button
            asChild
            className="h-14 w-[280px] rounded-lg bg-[#1668E8] text-[16px] font-medium text-white hover:bg-[#1668E8]"
          >
            <a href={PDF_URL} download>
              Downloadable PDF Quote
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectRFQ;
