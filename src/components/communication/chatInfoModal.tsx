import { X, Building2, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAppSelector } from "@/redux/hooks";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChatInfoDrawer({ open, onClose }: Props) {
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!open) return null;

  return (
    <div className="fixed md:absolute inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-sm md:w-[360px] h-full bg-white flex flex-col shadow-2xl border-l border-gray-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900 text-base">Support & Contact Info</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Organization Card */}
          <div className="flex flex-col items-center text-center p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <img src={logo} alt="MR Storage" className="h-10 object-contain mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm">MR Storage Operations Team</h3>
            <p className="text-xs text-gray-500 mt-1">
              Direct line between customer account & support team.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Support Active
            </div>
          </div>

          {/* Support Services Covered */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Support Coverage
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-gray-900">Plant & Fabrication</p>
                  <p className="text-[11px] text-gray-500">Material production, packing & dispatches</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-gray-900">Sales & Quotations</p>
                  <p className="text-[11px] text-gray-500">Orders, BOM approvals & quotation revisions</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-xs text-gray-900">Project Operations</p>
                  <p className="text-[11px] text-gray-500">Drawings, milestones & delivery schedules</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Context */}
          {currentUser && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Your Account
              </h4>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-800">{currentUser.firstName || "Customer"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-800 truncate max-w-[180px]">{currentUser.email}</span>
                </div>
                {currentUser.customerId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer ID:</span>
                    <span className="font-mono text-gray-800">{currentUser.customerId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Operating hours & security */}
          <div className="space-y-3 pt-2 border-t text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Working Hours: Mon – Fri (8:00 AM – 6:00 PM EST)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>End-to-end recorded communication linked to your account</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Need phone support?</span>
          <span className="font-semibold text-blue-600">Contact your Account Manager</span>
        </div>
      </div>
    </div>
  );
}
