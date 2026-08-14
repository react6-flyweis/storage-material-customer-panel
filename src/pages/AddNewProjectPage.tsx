import React, { useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useCreateProjectMutation } from "@/redux/api/projectsApi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectRequestSuccessModal } from "@/components/modals/ProjectRequestSuccessModal";
import { getApiErrorMessage } from "@/redux/utils/apiError";

interface CreateProjectFormValues {
  projectName: string;
  buildingType: string;
  expectedStartDate: string;
  targetCompletionDate: string;
  fullAddress: string;
  city: string;
  pincode: string;
  state: string;
  width: number;
  length: number;
  height: number;
  doors: number;
  windows: number;
  insulation: number;
  description: string;
}

export const AddNewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [createProject, { isLoading: isSubmitting }] = useCreateProjectMutation();

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    defaultValues: {
      projectName: "",
      buildingType: "",
      expectedStartDate: "",
      targetCompletionDate: "",
      fullAddress: "",
      city: "",
      pincode: "",
      state: "",
      width: 0,
      length: 0,
      height: 0,
      doors: 0,
      windows: 0,
      insulation: 0,
      description: "",
    },
  });

  const onSubmit = async (data: CreateProjectFormValues) => {
    clearErrors("root");
    try {
      await createProject({
        projectName: data.projectName,
        buildingType: data.buildingType,
        expectedStartDate: data.expectedStartDate,
        targetCompletionDate: data.targetCompletionDate,
        fullAddress: data.fullAddress,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        width: Number(data.width),
        length: Number(data.length),
        height: Number(data.height),
        doors: Number(data.doors),
        windows: Number(data.windows),
        insulation: Number(data.insulation),
        description: data.description,
      }).unwrap();

      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error("Failed to create project:", err);
      const errorMessage = getApiErrorMessage(err);
      setError("root", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/my_projects");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        {/* Top Bar with Back and Header */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1D51A4] border-[#1D51A4] hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">Create New Project</h1>
        </div>

        {/* Main Form Card Container */}
        <Card className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm py-6">
          <CardContent className="space-y-6 px-6">
            {/* Form Root Error Alert */}
            {errors.root && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-2">
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Top Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("projectName", { required: "Project name is required" })}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  placeholder="e.g. ABC Warehouse Expansion"
                />
                {errors.projectName && (
                  <p className="text-xs text-red-500 mt-1">{errors.projectName.message}</p>
                )}
              </div>

              {/* Building Type */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Building Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("buildingType", { required: "Building type is required" })}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] appearance-none focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select building type</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.buildingType && (
                  <p className="text-xs text-red-500 mt-1">{errors.buildingType.message}</p>
                )}
              </div>

              {/* Expected Start Date */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Expected Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("expectedStartDate", { required: "Start date is required" })}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-[#F8FAFC]" />
                </div>
                {errors.expectedStartDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.expectedStartDate.message}</p>
                )}
              </div>

              {/* Target Completion Date */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Target Completion Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("targetCompletionDate", { required: "Completion date is required" })}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-[#F8FAFC]" />
                </div>
                {errors.targetCompletionDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.targetCompletionDate.message}</p>
                )}
              </div>
            </div>

            {/* Location Row (Address, City, Pincode, State) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fullAddress", { required: "Full address is required" })}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  placeholder="Enter full address"
                />
                {errors.fullAddress && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullAddress.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("city", { required: "City is required" })}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              {/* Pin code */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Pin code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("pincode", { required: "Pin code is required" })}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  placeholder="Enter pincode"
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("state", { required: "State is required" })}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors"
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                )}
              </div>
            </div>

            <hr className="border-t border-[#F1F5F9]" />

            {/* Project Specification Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#1E293B]">Project Specification</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Width */}
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1.5">
                    Width (ft/m)
                  </label>
                  <Controller
                    control={control}
                    name="width"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-[#0F172A]">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                          className="text-[#1D51A4] hover:text-blue-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1.5">
                    Length (ft/m)
                  </label>
                  <Controller
                    control={control}
                    name="length"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-[#0F172A]">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                          className="text-[#1D51A4] hover:text-blue-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1.5">
                    Height (ft/m)
                  </label>
                  <Controller
                    control={control}
                    name="height"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-[#0F172A]">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                          className="text-[#1D51A4] hover:text-blue-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Doors */}
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1.5">
                    Doors
                  </label>
                  <Controller
                    control={control}
                    name="doors"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-[#0F172A]">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                          className="text-[#1D51A4] hover:text-blue-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Windows */}
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1.5">
                    Windows
                  </label>
                  <Controller
                    control={control}
                    name="windows"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-[#0F172A]">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                          className="text-[#1D51A4] hover:text-blue-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Insulation */}
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1.5">
                    Insulation
                  </label>
                  <Controller
                    control={control}
                    name="insulation"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-[#0F172A]">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange((field.value || 0) + 1)}
                          className="text-[#1D51A4] hover:text-blue-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Tell us more about your project */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#1E293B]">
                Tell us more about your project
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1D51A4] focus:outline-none transition-colors resize-none"
                placeholder="Describe any special requirements, preferred materials, design requirements, delivery expectations, or other information our team should know."
              />
            </div>
          </CardContent>

          {/* Action Buttons inside Card Footer */}
          <CardFooter className="flex items-center justify-between border-t border-[#F1F5F9] pt-6 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border-[#E2E8F0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-[#1D51A4] hover:bg-[#163e80] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Success Dialog */}
      <ProjectRequestSuccessModal open={showSuccessModal} onClose={handleModalClose} />
    </>
  );
};

export default AddNewProjectPage;



