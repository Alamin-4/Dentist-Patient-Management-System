import { cn } from "@/core/lib/utils"

function CustomSectionHeading({ value, center_align, className }: { value: string, center_align?: boolean, className?: string }) {
    return (
        <div>
            <h2 className={
                cn("text-2xl md:text-3xl lg:text-4xl text-text font-semibold", center_align && "text-center", className)
            }>
                {value}
            </h2>
        </div>
    )
}

export default CustomSectionHeading