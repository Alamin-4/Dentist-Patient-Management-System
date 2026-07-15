interface ControlButtonProps {
    isOff: boolean;
    onClick: () => void;
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
    title: string;
    disabled?: boolean;
}

export function ControlButton({ isOff, onClick, onIcon, offIcon, title, disabled }: ControlButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`size-12 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${isOff
                    ? "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
            title={disabled ? `${title} (Device not available)` : title}
        >
            {isOff ? offIcon : onIcon}
        </button>
    );
}