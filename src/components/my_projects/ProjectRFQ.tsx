import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PDF_URL from "../../assets/dummy-pdf_2.pdf";
const ProjectRFQ = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="rounded-lg bg-white p-5">
      <div className="mb-8 flex items-center gap-1">
        <span className="text-[16px] text-[#101828]">Lead ID -</span>

        <span className="text-[16px] font-bold text-[#101828]">{id}</span>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            ✅ Quote Summary
          </h2>

          <h3 className="mb-4 text-[18px] font-bold text-[#101828]">
            Your Custom Steel Building Quote
          </h3>

          <ul className="list-disc space-y-3 pl-8 text-[16px] text-[#101828]">
            <li>Building Type: Workshop</li>
            <li>Dimensions: 30' × 40' × 12'</li>
            <li>Roof Style: Gable Roof</li>
            <li>
              Location: Dallas, TX (designed for 120 mph wind load, 20 psf snow
              load)
            </li>
            <li>Estimated Delivery: 4–6 weeks</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            💰 Estimated Price Range
          </h2>

          <p className="mb-4 text-[18px] font-bold text-[#101828]">
            $24,500 – $28,000
          </p>

          <p className="max-w-[850px] text-[14px] leading-7 text-[#4A5565]">
            (This is an instant estimate based on your inputs. Final pricing
            will be confirmed after engineering review and foundation
            requirements.)
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            📦 What’s Included
          </h2>

          <ul className="list-disc space-y-4 pl-8 text-[16px] text-[#101828]">
            <li>Pre-engineered steel frame</li>
            <li>Roof & wall panels (26-gauge, 30-year warranty)</li>
            <li>Trim & fasteners</li>
            <li>Detailed installation drawings</li>
            <li>Engineer-stamped plans (where required)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-[20px] font-bold text-[#101828]">
            🛠 Optional Add-Ons
          </h2>

          <ul className="list-disc space-y-4 pl-8 text-[16px] text-[#101828]">
            <li>Roll-up doors</li>
            <li>Walk-in doors & windows</li>
            <li>Skylights</li>
            <li>Insulation package</li>
            <li>Color customization</li>
          </ul>
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
