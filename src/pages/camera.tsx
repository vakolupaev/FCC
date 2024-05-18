import MeterComponent from "@/components/meter";
import Webcam from "react-webcam";
import useDragula from "@/crafts/UAV/DRAGULA/dragula";


const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: "user"
};

function CameraPage() {
	const dragula = useDragula();

	return (
		<>
			<div
				className="flex flex-row w-full h-full"
			>
				<div
					className="h-full w-full relative overflow-hidden flex flex-row"
					id="wind"
				>
					<div
						className="w-full h-full absolute overflow-hidden min-w-full"
						id="cam"
					>
						<Webcam
							className="h-full w-full rounded-md"
							audio={false}
							height={1080}
							screenshotFormat="image/jpeg"
							width={1920}

							videoConstraints={videoConstraints}
						/>
					</div>
				</div>
			</div>
			<div
				className="flex gap-4"
			>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Тангаж: ${Math.round(dragula.orientation[2])}°`} size={'text-2xl'} />
				</div>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Крен: ${Math.round(dragula.orientation[0])}°`} size={'text-2xl'} />
				</div>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Курс: ${-dragula.orientation[1] < 0 ? -Math.round(dragula.orientation[1] - 180) + 180 : Math.round(-dragula.orientation[1])}°`} size={'text-2xl'} />
				</div>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Скорость: ${Math.round(dragula.ground_speed)}м/с`} size={'text-xl'} />
				</div>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Высота: ${dragula.alt / 1000}м`} size={'text-xl'} />
				</div>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Широта: ${dragula.lat.toString().slice(0, 8)}`} size={'text-xl'} />
				</div>
				<div
					className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
				>
					<MeterComponent text={`Долгота: ${dragula.lon.toString().slice(0, 8)}`} size={'text-xl'} />
				</div>

			</div>
		</>
	)
}

export default CameraPage;
