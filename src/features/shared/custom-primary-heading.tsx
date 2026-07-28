function CustomPrimaryHeading({ value }: { value: string }) {
    return (
        <div>
            <h3 className="text-primary text-lg md:text-xl lg:text-2xl font-bold">
                {value}
            </h3>
        </div>
    )
}

export default CustomPrimaryHeading