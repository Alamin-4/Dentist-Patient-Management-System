import { cn } from "@/core/lib/utils"

function CustomDesText({ value, center_align }: { value: string, center_align?: boolean }) {
    return (
        <div>
            <p className={
                cn("md:text-lg lg:text-xl text-sec-text font-medium", center_align && "text-center")
            }>
                {value}
            </p>
        </div>
    )
}

export default CustomDesText