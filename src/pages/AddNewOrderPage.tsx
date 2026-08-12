import React, { useEffect } from "react";
import {
  ArrowLeft,
  FolderPlus,
  Plus,
  Minus,
  Trash2,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useGetProjectsQuery } from "@/redux/api/projectsApi";
import { useCreateProjectOrderMutation } from "@/redux/api/materialOrdersApi";

interface AttachmentItem {
  name: string;
  url: string;
}

interface OrderItemFormValues {
  name: string;
  quantity: number;
  unit: string;
  lengthFeet: number;
  color: string;
}

interface AddOrderFormValues {
  leadId: string;
  buildingLabel: string;
  requiredBy: string;
  preferredDeliveryDate: string;
  priority: string;
  specialInstructions: string;
  attachments: AttachmentItem[];
  items: OrderItemFormValues[];
}

export const AddNewOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialLeadId = searchParams.get("leadId") || "";

  // Fetch projects list for dropdown
  const { data: projectsData } = useGetProjectsQuery({ page: 1, limit: 100 });
  const projectsList = projectsData?.projects || [];

  // API Mutation
  const [createProjectOrder, { isLoading: isSubmitting }] =
    useCreateProjectOrderMutation();

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddOrderFormValues>({
    defaultValues: {
      leadId: initialLeadId,
      buildingLabel: "",
      requiredBy: "",
      preferredDeliveryDate: "",
      priority: "normal",
      specialInstructions: "",
      attachments: [],
      items: [
        {
          name: "Black 26ga",
          quantity: 1,
          unit: "ft",
          lengthFeet: 10,
          color: "Black",
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const selectedLeadId = watch("leadId");

  useEffect(() => {
    if (initialLeadId && !selectedLeadId) {
      setValue("leadId", initialLeadId);
    }
  }, [initialLeadId, selectedLeadId, setValue]);

  const onSubmit = async (data: AddOrderFormValues) => {
    if (!data.leadId) {
      alert("Please select a project.");
      return;
    }

    try {
      await createProjectOrder({
        leadId: data.leadId,
        body: {
          buildingLabel: data.buildingLabel,
          requiredBy: data.requiredBy,
          preferredDeliveryDate: data.preferredDeliveryDate || undefined,
          priority: data.priority,
          specialInstructions: data.specialInstructions,
          attachments: data.attachments,
          items: data.items,
        },
      }).unwrap();

      navigate(-1);
    } catch (err: unknown) {
      console.error("Failed to create order:", err);
      const apiErr = err as { data?: { message?: string } };
      alert(apiErr?.data?.message || "Failed to create order request.");
    }
  };

  const handleAddCoilLine = () => {
    append({
      name: "Black 26ga",
      quantity: 1,
      unit: "ft",
      lengthFeet: 10,
      color: "Black",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-[#1d4ed8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#101828]">
              Add New Order
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5565] mt-0.5">
              Create a new order by providing project, coil specifications and delivery details.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FolderPlus className="w-4 h-4" />
          )}
          {isSubmitting ? "Submitting..." : "Submit Order Request"}
        </button>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Project Info Card */}
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#101828]">Project Info</h2>
          </div>

          <div className="space-y-4 flex-1">
            {/* Project Select */}
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Project *
              </label>
              <select
                {...register("leadId", { required: "Project is required" })}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-sm text-[#101828] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
              >
                <option value="">Select Project</option>
                {projectsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectName} {p.jobId ? `(${p.jobId})` : ""}
                  </option>
                ))}
              </select>
              {errors.leadId && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.leadId.message}
                </p>
              )}
            </div>

            {/* Building Select */}
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Building *
              </label>
              <select
                {...register("buildingLabel", {
                  required: "Building is required",
                })}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-sm text-[#101828] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
              >
                <option value="">Select Building</option>
                <option value="Building A">Building A</option>
                <option value="Building B">Building B</option>
                <option value="Building C">Building C</option>
                <option value="Main Warehouse">Main Warehouse</option>
              </select>
              {errors.buildingLabel && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.buildingLabel.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Information Card */}
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#101828]">
              Order Information
            </h2>
          </div>

          <div className="space-y-4 flex-1">
            {/* Required Date */}
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Required Date *
              </label>
              <input
                type="date"
                {...register("requiredBy", {
                  required: "Required date is required",
                })}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-sm text-[#101828] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
              {errors.requiredBy && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.requiredBy.message}
                </p>
              )}
            </div>

            {/* Preferred Delivery Date */}
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Preferred Delivery Date
              </label>
              <input
                type="date"
                {...register("preferredDeliveryDate")}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-sm text-[#101828] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Priority *
              </label>
              <select
                {...register("priority", { required: true })}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-sm text-[#101828] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
              >
                <option value="normal">normal</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Special Instruction & Attachments Column */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Special Instruction Card */}
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xs flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <FolderPlus className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#101828]">
                Special Instruction
              </h2>
            </div>
            <textarea
              {...register("specialInstructions")}
              rows={3}
              className="w-full rounded-xl border border-transparent bg-slate-50 p-3 text-sm text-[#475467] leading-relaxed resize-none focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              placeholder="Enter any special instructions..."
            />
          </div>

          {/* Attachments Card */}
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xs flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#101828]">Attachments</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#475467] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#344054] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>

            <div className="space-y-2.5">
              {watch("attachments")?.length === 0 ? (
                <p className="text-xs text-[#667085]">No attachments uploaded yet.</p>
              ) : (
                watch("attachments")?.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-[#E4E7EC] bg-white p-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 font-bold text-xs">
                        {att.name ? att.name.charAt(0).toUpperCase() : "F"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#101828]">
                          {att.name}
                        </p>
                        <p className="text-xs text-[#667085]">Attached</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#667085]">
                      {att.url && (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:text-[#101828] cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order List (Summary) Section */}
      <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
            <FolderPlus className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#101828]">
            Order List (Summary)
          </h2>
        </div>

        {/* Coil Lines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EAECF0]/60 text-xs font-bold text-[#475467] uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg">Coil Type</th>
                <th className="py-3 px-4 text-center">Length</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {fields.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Coil Type Select */}
                  <td className="py-4 px-4 w-1/3">
                    <input
                      type="hidden"
                      {...register(`items.${index}.color`)}
                    />
                    <input
                      type="hidden"
                      {...register(`items.${index}.unit`)}
                    />
                    <select
                      {...register(`items.${index}.name`)}
                      onChange={(e) => {
                        const val = e.target.value;
                        const colorName = val.split(" ")[0] || "Black";
                        update(index, {
                          ...item,
                          name: val,
                          color: colorName,
                        });
                      }}
                      className="w-full max-w-xs rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2 text-sm text-[#101828] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
                    >
                      <option value="Black 26ga">Black 26ga</option>
                      <option value="White 26ga">White 26ga</option>
                      <option value="Galvalume 26ga">Galvalume 26ga</option>
                      <option value="Gray 24ga">Gray 24ga</option>
                    </select>
                  </td>

                  {/* Length Increment / Decrement Counter */}
                  <td className="py-4 px-4 text-center">
                    <Controller
                      control={control}
                      name={`items.${index}.lengthFeet`}
                      render={({ field }) => (
                        <div className="inline-flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(Math.max(1, (field.value || 1) - 1))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-[48px] text-sm font-semibold text-[#101828]">
                            {field.value} ft
                          </span>
                          <button
                            type="button"
                            onClick={() => field.onChange((field.value || 0) + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    />
                  </td>

                  {/* Quantity Increment / Decrement Counter */}
                  <td className="py-4 px-4 text-center">
                    <Controller
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <div className="inline-flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(Math.max(1, (field.value || 1) - 1))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-[32px] text-sm font-semibold text-[#101828]">
                            {field.value}
                          </span>
                          <button
                            type="button"
                            onClick={() => field.onChange((field.value || 0) + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    />
                  </td>

                  {/* Action Trash Icon */}
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center justify-center p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Coil Line Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAddCoilLine}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            Add Coil Line
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddNewOrderPage;
