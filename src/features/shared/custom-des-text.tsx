import { cn } from "@/core/lib/utils"

function CustomDesText({ value, center_align, className }: { value: string, center_align?: boolean, className?: string }) {
    return (
        <div>
            <p className={
                cn("text-xs md:text-sm lg:text-base text-sec-text font-medium", center_align && "text-center", className)
            }>
                {value}
            </p>
        </div>
    )
}

export default CustomDesText