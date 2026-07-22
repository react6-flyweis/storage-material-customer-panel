import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import buildingIcon from "@/assets/icon/building.svg";
import drawingIcon from "@/assets/icon/drawing.svg";
import PurpleCalendarIcon from "@/assets/icon/PurpleCalendarIcon.svg";
// import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";

const defaultBuildingImage =
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80";

const ProjectDrawingsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isLoading = false

  // const { data: projectData, isLoading } = useGetProjectDetailsQuery(id || "", {
  //   skip: !id,
  // });

  // const lead = projectData?.projectDetails?.lead;

  const projectTitle = "ABC Logistic Warehouse";
  const projectCode = "PEB-1021";
  const projectLocation = "Pune, Maharashtra";
  const buildingsCount = 4;
  const totalDrawingsCount = 25;
  const projectStatus = "Active";

  const buildings = [
    {
      id: "bldg-a",
      name: "Building A",
      code: "BLDG-A",
      floor: "Ground Floor",
      totalDrawings: 25,
      documentsCount: 4,
      lastUpdate: "12 April 2026",
      image: defaultBuildingImage,
    },
    {
      id: "bldg-b",
      name: "Building B",
      code: "BLDG-A",
      floor: "Ground Floor",
      totalDrawings: 25,
      documentsCount: 4,
      lastUpdate: "12 April 2026",
      image: defaultBuildingImage,
    },
  ];

  return (
    <div className="p-4 md:p-5 max-w-[1300px] mx-auto space-y-4 font-sans">
      {/* Header section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1 rounded-md text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            Back
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            {projectTitle}
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-normal pl-0.5">
          Select a building to view its drawings and documents
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#1D51A4]"></div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Main Project Overview Card */}
          <div className="bg-[#F4F7FF] rounded-xl border border-slate-100 shadow-xs p-3.5 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Left Info: Image + Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 min-w-0">
              <div className="w-full sm:w-[160px] h-[95px] shrink-0 rounded-lg overflow-hidden bg-slate-200">
                <img
                  src={defaultBuildingImage}
                  alt={projectTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col space-y-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                  {projectTitle}
                </h2>
                <p className="text-xs font-semibold text-slate-400">
                  {projectCode}
                </p>
                <p className="text-xs text-slate-600 font-normal leading-tight">
                  {projectLocation}
                </p>
              </div>
            </div>

            {/* Middle and Right Stats */}
            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
              {/* Divider 1 */}
              <div className="hidden md:block w-[1px] h-14 bg-slate-300/60" />

              {/* Buildings Stat */}
              <div className="flex items-center gap-2.5 min-w-[90px]">
                <div className="w-8 h-8 rounded-full bg-[#EAF7ED] flex items-center justify-center shrink-0">
                  <img src={buildingIcon} alt="Buildings" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                    {buildingsCount}
                  </span>
                  <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                    Buildings
                  </span>
                </div>
              </div>

              {/* Divider 2 */}
              <div className="w-[1px] h-12 md:h-14 bg-slate-300/60" />

              {/* Total Drawings Stat */}
              <div className="flex items-center gap-2.5 min-w-[110px]">
                <div className="w-8 h-8 rounded-full bg-[#EBF2FE] flex items-center justify-center shrink-0">
                  <img src={drawingIcon} alt="Total Drawings" className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                    {totalDrawingsCount}
                  </span>
                  <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                    Total Drawings
                  </span>
                </div>
              </div>

              {/* Divider 3 */}
              <div className="hidden md:block w-[1px] h-14 bg-slate-300/60" />

              {/* Project Status */}
              <div className="flex flex-col items-center sm:items-start space-y-1 min-w-[90px] pl-1 sm:pl-2">
                <span className="text-xs font-medium text-slate-500 block">
                  Project Status
                </span>
                <span className="bg-[#D1FADF] text-[#12B76A] px-3 py-0.5 rounded-md text-xs font-semibold inline-block">
                  {projectStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Building Cards List */}
          {buildings.map((building) => (
            <div
              key={building.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              {/* Left Details: Building Image + Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <div className="w-full sm:w-[150px] h-[90px] shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={building.image}
                    alt={building.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col space-y-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                    {building.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#2563EB]">
                    {building.code}
                  </p>
                  <p className="text-xs text-slate-600 font-normal">
                    {building.floor}
                  </p>
                </div>
              </div>

              {/* Right Stats + Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {/* Divider */}
                <div className="hidden md:block w-[1px] h-14 bg-slate-200" />

                {/* Stat 1: Total Drawings */}
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <div className="w-8 h-8 rounded-full bg-[#EBF2FE] flex items-center justify-center shrink-0">
                    <img src={drawingIcon} alt="Total Drawings" className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                      {building.totalDrawings}
                    </span>
                    <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                      Total Drawings
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-12 md:h-14 bg-slate-200" />

                {/* Stat 2: Documents */}
                <div className="flex items-center gap-2.5 min-w-[85px]">
                  <div className="w-8 h-8 rounded-full bg-[#EAF7ED] flex items-center justify-center shrink-0">
                    <img src={buildingIcon} alt="Documents" className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-lg md:text-xl font-bold text-slate-900 block leading-none">
                      {building.documentsCount}
                    </span>
                    <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                      Documents
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-12 md:h-14 bg-slate-200" />

                {/* Stat 3: Last Update */}
                <div className="flex items-center gap-2.5 min-w-[110px]">
                  <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                    <img
                      src={PurpleCalendarIcon}
                      alt="Last Update"
                      className="w-4 h-4"
                    />
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-bold text-slate-900 block leading-none">
                      {building.lastUpdate}
                    </span>
                    <span className="text-[11px] md:text-xs text-slate-600 font-medium mt-0.5 block">
                      Last Update
                    </span>
                  </div>
                </div>

                {/* Open Drawings Button */}
                <div className="pl-1 sm:pl-2">
                  <button
                    onClick={() =>
                      navigate(
                        id
                          ? `/project-building-drawings/${id}`
                          : "/project-building-drawings/default"
                      )
                    }
                    className="bg-[#1D51A4] hover:bg-[#18448b] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    Open Drawings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDrawingsPage;

