import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, MoveLeft } from "lucide-react";
import img1 from "../../assets/Steel contract and terms for quotes_1.svg";
import img2 from "../../assets/Steel contract and terms for quotes_2.svg";
import img3 from "../../assets/Steel contract and terms for quotes_3.svg";
import img4 from "../../assets/Steel contract and terms for quotes_4.svg";
import img5 from "../../assets/Steel contract and terms for quotes_5.png";

export default function DocumentPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentType = "Agreement" } = location.state || {};

  return (
    <div className="md:px-5 px-2 pt-2 md:pt-5 pb-10 space-y-6">
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-8  max-w-7xl mr-auto gap-4 flex-wrap">
        <Button
          className="bg-[#2563EB] hover:bg-blue-700 text-white min-w-[100px] gap-2 px-6 h-10 rounded-md shadow-sm"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          asChild
          size={"xs"}
          className="bg-[#2563EB] hover:bg-blue-700 font-normal  text-white min-w-[150px] gap-2 px-4 h-10 rounded-md shadow-sm"
        >
          <a href={img1} download={`${documentType}_1.png`} className="flex items-center gap-2 text-sm">
            <Download className="w-8 h-8" />
            Download {documentType}
          </a>
        </Button>
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-sm shadow-sm max-w-7xl mr-auto min-h-screen p-8 md:p-16 text-[#333333] font-inter">
        {/* Logo and Company Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <img src={img1} alt="h-full w-full object-contain" className="" />
          <img src={img2} alt="h-full w-full object-contain" className="" />
          <img src={img3} alt="h-full w-full object-contain" className="" />
          <img src={img4} alt="h-full w-full object-contain" className="" />
          <img src={img5} alt="h-full w-full object-contain" className="" />
          <div className="flex justify-end items-center w-full">
            <Button className="bg-[#2563EB] hover:bg-blue-700 md:text-sm text-xs text-white min-w-[150px] gap-2 px-6 h-10 rounded-md shadow-sm">
              Submit & Continue to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
