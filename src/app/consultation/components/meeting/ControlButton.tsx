interface ControlButtonProps {
    isOff: boolean;
    onClick: () => void;
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
    title: string;
}

export function ControlButton({ isOff, onClick, onIcon, offIcon, title }: ControlButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`size-12 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer active:scale-95 ${isOff
                    ? "border-rose-500/30 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white"
                }`}
            title={title}
        >
            {isOff ? offIcon : onIcon}
        </button>
    );
}