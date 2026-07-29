import { cn } from "@/core/lib/utils"

function CustomSectionHeading({ value, center_align, className }: { value: string, center_align?: boolean, className?: string }) {
    return (
        <div>
            <h2 className={
                cn("text-xl md:text-2xl lg:text-3xl text-text font-semibold", center_align && "text-center", className)
            }>
                {value}
            </h2>
        </div>
    )
}

export default CustomSectionHeading