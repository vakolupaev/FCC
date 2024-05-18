import { useMemo } from "react"

type MeterProps = {
	text: string
	size: string
}

const MeterComponent = ({ text, size }: MeterProps) => {


	const color = useMemo(() => {
		return `rgb(${Math.random() * 200 + 55}, ${Math.random() * 200 + 55}, ${Math.random() * 200 + 55})`
	}, [])

	return (
		<div className="relative p-5 w-full h-full">
			<div
				style={{ borderColor: color }}
				className="rounded-full h-full w-full flex justify-center text-center items-center text-3xl font-black border-2 bg-[#0f0f0f]"
			>
				<div className={`w-min ${size} leading-10`}>
					{text}
				</div>

			</div>
		</div>
	)
}

export default MeterComponent;