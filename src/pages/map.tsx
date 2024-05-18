import MapComponent from "@/components/map";
import MeterComponent from "@/components/meter";
import useDragula from "@/crafts/UAV/DRAGULA/dragula";

function MapPage() {
	const dragula = useDragula();

	return (
		<>
			<div
				className="flex flex-row w-full h-full"
			>
				<div
					className="h-full w-full relative overflow-x-scroll flex flex-row"
					id="wind"
				>
					<div
						className="h-full w-full min-w-full relative "
						id="map"
					>
						<MapComponent />
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

export default MapPage;
