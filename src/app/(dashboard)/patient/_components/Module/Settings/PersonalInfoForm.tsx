import { ChevronDown, Eye } from "lucide-react";

export function PersonalInfoForm() {
  return (
    <div className="space-y-10">
      <h2 className="text-[28px] font-bold text-[#1A1A2E]">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <InputGroup label="First Name" value="John" />
        <InputGroup label="Last Name" value="Smith" />
        <InputGroup label="Email" value="johnsmith@gmail.com" />
        <InputGroup label="Phone Number" value="+555 123 4567890" />
        <InputGroup label="Date of Birth" value="May 4, 2001" />
        <InputGroup label="Country" value="USA" isSelect />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button className="px-10 py-4 rounded-xl border border-slate-300 font-bold text-[#1A1A2E] text-xl hover:bg-slate-50">
          Cancel
        </button>
        <button className="px-10 py-4 rounded-xl bg-[#0F3659] font-bold text-white text-xl hover:bg-[#0a2640]">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export function InputGroup({ label, value, isSelect, isPassword }: any) {
  return (
    <div className="space-y-2">
      {/* Label weight matches your design requirements */}
      <label className="text-lg font-semibold text-[#1A1A2E]">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? "password" : "text"}
          defaultValue={value}
          className="w-full h-16 px-6 rounded-xl border border-slate-200 text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all"
        />
        {/* Dynamic icons based on the field type */}
        {isSelect && (
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 size-6 text-slate-400" />
        )}
        {isPassword && (
          <Eye className="absolute right-6 top-1/2 -translate-y-1/2 size-6 text-slate-400 cursor-pointer" />
        )}
      </div>
    </div>
  );
}
