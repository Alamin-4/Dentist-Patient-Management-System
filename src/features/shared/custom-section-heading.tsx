import { cn } from "@/core/lib/utils"

function CustomSectionHeading({ value, center_align }: { value: string, center_align?: boolean }) {
    return (
        <div>
            <h2 className={
                cn("text-3xl md:text-4xl lg:text-[40px] text-text font-bold", center_align && "text-center")
            }>
                {value}
            </h2>
        </div>
    )
}

export default CustomSectionHeading