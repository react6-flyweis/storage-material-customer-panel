import { ProjectDrawingsPageText } from "@/data/text/ProjectDrawingsPageText";
import buildingIcon from "@/assets/icon/building.svg";
import drawingIcon from "@/assets/icon/drawing.svg";
import { useNavigate } from "react-router-dom";
import { useGetCustomerDocumentsQuery } from "@/redux/api/projectsApi";

const defaultBuildingImages = [
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
];

const AllDrawingsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCustomerDocumentsQuery({ type: "drawing" });

  const projectDrawings = (data?.projects || []).map((p, idx) => {
    const drawingsCount = p.documents?.length || 25;
    return {
      id: p.lead._id,
      title: p.lead.projectName || p.lead.buildingType || "ABC Logistics Warehouse",
      code: p.lead.jobId || "PEB-1021",
      location: p.lead.location || "Pune, Maharashtra",
      image: defaultBuildingImages[idx % defaultBuildingImages.length],
      buildingsCount: 4,
      drawingsCount: drawingsCount > 0 ? drawingsCount : 25,
    };
  });

  const displayList = projectDrawings.length > 0 ? projectDrawings : [
    {
      id: "1",
      title: "ABC Logistics Warehouse",
      code: "PEB-1021",
      location: "Pune, Maharashtra",
      image: defaultBuildingImages[0],
      buildingsCount: 4,
      drawingsCount: 25,
    },
    {
      id: "2",
      title: "ABC Logistics Warehouse",
      code: "PEB-1021",
      location: "Pune, Maharashtra",
      image: defaultBuildingImages[1],
      buildingsCount: 4,
      drawingsCount: 25,
    },
    {
      id: "3",
      title: "ABC Logistics Warehouse",
      code: "PEB-1021",
      location: "Pune, Maharashtra",
      image: defaultBuildingImages[2],
      buildingsCount: 4,
      drawingsCount: 25,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 font-inter">
          {ProjectDrawingsPageText.header.title}
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-normal">
          {ProjectDrawingsPageText.header.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D51A4]"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
            Failed to load drawings. Please try again.
          </div>
        ) : (
          displayList.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              {/* Left Details Section: Image + Project Metadata */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
                <div className="w-full sm:w-[220px] h-[125px] shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-2.5 min-w-0">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-sm font-medium text-slate-400">
                    {item.code}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-tight">
                    {item.location}
                  </p>
                </div>
              </div>

              {/* Right Section: Stats & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                {/* Vertical Divider */}
                <div className="hidden md:block w-[1px] h-20 bg-slate-200" />

                {/* Stat 1: Buildings */}
                <div className="flex flex-col items-center sm:items-start space-y-3 min-w-[90px]">
                  <div className="w-10 h-10 rounded-full bg-[#EAF7ED] flex items-center justify-center text-[#22C55E]">
                    <img src={buildingIcon} alt="Building" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block leading-none">
                      {item.buildingsCount}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                      Buildings
                    </span>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-16 sm:h-20 bg-slate-200" />

                {/* Stat 2: Total Drawings */}
                <div className="flex flex-col items-center sm:items-start space-y-3 min-w-[110px]">
                  <div className="w-10 h-10 rounded-full bg-[#EBF2FE] flex items-center justify-center text-[#2563EB]">
                    <img src={drawingIcon} alt="Drawing" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block leading-none">
                      {item.drawingsCount}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                      Total Drawings
                    </span>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-16 sm:h-20 bg-slate-200" />

                {/* View Action Button */}
                <div className="pl-2 sm:pl-4">
                  <button
                    onClick={() => navigate(`/project-buildings/${item.id}`)}
                    className="bg-[#1D51A4] hover:bg-[#18448b] text-white px-7 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllDrawingsPage;
