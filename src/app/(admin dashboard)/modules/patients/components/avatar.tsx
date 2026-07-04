// avatar.tsx
interface Props { initials: string; color: string; }
export function Avatar({ initials, color }: Props) {
    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: color }}>
            {initials}
        </span>
    );
}