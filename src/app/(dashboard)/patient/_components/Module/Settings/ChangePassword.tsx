import { InputGroup } from "./PersonalInfoForm";

export function ChangePasswordForm() {
  return (
    <div className="space-y-10">
      <h2 className="text-[28px] font-bold text-[#1A1A2E]">Change Password</h2>

      <div className="space-y-8">
        <InputGroup label="Old Password" value="••••••••••••" isPassword />
        <InputGroup label="New Password" value="••••••••••••" isPassword />
        <InputGroup
          label="Confirm New Password"
          value="••••••••••••"
          isPassword
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button className="px-10 py-4 rounded-xl border border-slate-300 font-bold text-[#1A1A2E] text-xl hover:bg-slate-50">
          Cancel
        </button>
        <button className="px-10 py-4 rounded-xl bg-[#0F3659] font-bold text-white text-xl hover:bg-[#0a2640]">
          Change Password
        </button>
      </div>
    </div>
  );
}
