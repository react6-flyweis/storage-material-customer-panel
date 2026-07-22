import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useGetProjectDetailsQuery } from "@/redux/api/projectsApi";
import ViewDrawingModal from "@/components/drawings_and_documents/ViewDrawingModal";

const defaultBuildingImage =
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80";

const ProjectBuildingDrawingsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [selectedDrawing, setSelectedDrawing] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { data: projectData, isLoading } = useGetProjectDetailsQuery(id || "", {
  //   skip: !id,
  // });

  const isLoading = false

  // const lead = projectData?.projectDetails?.lead;

  const projectTitle = "ABC Logistic Warehouse";
  const projectCode = "PEB-1021";
  const projectLocation = "Pune, Maharashtra";

  const handleOpenDrawing = (drawingItem: {
    name: string;
    size?: string;
    status?: string;
    fileUrl?: string;
  }) => {
    setSelectedDrawing({
      id: drawingItem.name,
      name: drawingItem.name,
      status: drawingItem.status || "Pending Review",
      fileUrl: drawingItem.fileUrl,
      leadId: id || projectCode,
    });
    setIsModalOpen(true);
  };

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
      drawings: [
        {
          name: "Architectural Plans.pdf",
          size: "15.2 MB",
          status: "Pending Review",
        },
        {
          name: "Structural Drawings.dwg",
          size: "15.2 MB",
          status: "Approved",
        },
        {
          name: "Building.Image",
          size: "15.2 MB",
          fileUrl: defaultBuildingImage,
          status: "Approved",
        },
      ],
    },
  ];

  return (
    <div className="p-5 space-y-6 font-sans">
      {/* Header section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center gap-2 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {projectTitle} Drawings
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-normal mt-1">
            All structural, fabrication, and erection drawings for this project.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D51A4]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {buildings.map((building) => (
            <div
              key={building.id}
              className="bg-white rounded-xl border border-[#D0D5DD] p-6 space-y-6 shadow-xs"
            >
              {/* Building Header */}
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {building.name}
              </h2>

              {/* Drawings Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Drawings</h3>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">{projectCode}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs md:text-sm text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-xs">Uploaded By:</span>
                      <span className="font-semibold text-slate-700">Rahul Sharma</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Location</span>
                      <span className="font-semibold text-slate-700">{projectLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Last Update on</span>
                      <span className="font-semibold text-slate-700">25-April-2025</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Attachments & Drawings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Item 1 */}
                    <div
                      onClick={() => handleOpenDrawing(building.drawings[0])}
                      className="relative border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <span className="absolute -top-3 left-28 bg-[#FEF3C7] text-[#D97706] text-xs font-medium px-3 py-0.5 rounded-full">
                        Pending Review
                      </span>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-100">
                          P
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            Architectural Plans.pdf
                          </p>
                          <p className="text-xs text-slate-400">15.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                        <span
                          className="hover:text-slate-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            // download action or view
                            handleOpenDrawing(building.drawings[0]);
                          }}
                        >
                          ↓
                        </span>
                        <span
                          className="hover:text-slate-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawing(building.drawings[0]);
                          }}
                        >
                          👁
                        </span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div
                      onClick={() => handleOpenDrawing(building.drawings[1])}
                      className="relative border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <span className="absolute -top-3 right-16 bg-[#D1FADF] text-[#12B76A] text-xs font-medium px-3 py-0.5 rounded-full">
                        Approved
                      </span>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-100">
                          P
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            Structural Drawings.dwg
                          </p>
                          <p className="text-xs text-slate-400">15.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                        <span
                          className="hover:text-slate-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawing(building.drawings[1]);
                          }}
                        >
                          ↓
                        </span>
                        <span
                          className="hover:text-slate-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawing(building.drawings[1]);
                          }}
                        >
                          👁
                        </span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div
                      onClick={() => handleOpenDrawing(building.drawings[2])}
                      className="border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={building.image}
                          alt="Building"
                          className="w-10 h-8 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            Building.Image
                          </p>
                          <p className="text-xs text-slate-400">15.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                        <span
                          className="hover:text-slate-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawing(building.drawings[2]);
                          }}
                        >
                          ↓
                        </span>
                        <span
                          className="hover:text-slate-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawing(building.drawings[2]);
                          }}
                        >
                          👁
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Documents</h3>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">{projectCode}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs md:text-sm text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-xs">Location</span>
                      <span className="font-semibold text-slate-700">{projectLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Last Update on</span>
                      <span className="font-semibold text-slate-700">25-April-2025</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Attachments & Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Item 1 */}
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-100">
                          P
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            Agreement
                          </p>
                          <p className="text-xs text-slate-400">15.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                        <span className="hover:text-slate-900 cursor-pointer">↓</span>
                        <span className="hover:text-slate-900 cursor-pointer">👁</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-100">
                          P
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            Contract
                          </p>
                          <p className="text-xs text-slate-400">15.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                        <span className="hover:text-slate-900 cursor-pointer">↓</span>
                        <span className="hover:text-slate-900 cursor-pointer">👁</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-100">
                          P
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            Invoice
                          </p>
                          <p className="text-xs text-slate-400">15.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 shrink-0 text-sm">
                        <span className="hover:text-slate-900 cursor-pointer">↓</span>
                        <span className="hover:text-slate-900 cursor-pointer">👁</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Drawing Modal */}
      <ViewDrawingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDrawing(null);
        }}
        drawing={selectedDrawing}
        projectInfo={{
          projectName: projectTitle,
          projectCode: projectCode,
          siteLocation: projectLocation,
          uploadedBy: "Rahul Sharma",
          lastUpdate: "25-April-2025",
        }}
        onSendMessage={() => { }}
      />
    </div>
  );
};

export default ProjectBuildingDrawingsPage;
