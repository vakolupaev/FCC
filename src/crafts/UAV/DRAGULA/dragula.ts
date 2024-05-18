import { useEffect, useState } from "react";
import { Body, fetch, ResponseType } from "@tauri-apps/api/http"

type PathT = {
	name: string
	color: string,
	path: number[][]
}

const useDragula = () => {

	const [track, setTrack] = useState<PathT[]>([{ name: "dragula", color: "#ff4040", path: [] }]);

	const [params, setParams] = useState<{
		alt: number,
		lat: number,
		lon: number,
		ground_speed: number,
		orientation: number[]
	}>({ lat: 0, lon: 0, alt: 0, ground_speed: 0, orientation: [0, 0, 0] })

	const [ports, setPorts] = useState<string[]>([]);
	const [port, setPort] = useState<string>("DISCONECT");

	const getData = async () => {
		let response = await fetch<[TelemetryPosition, any]>("http://127.0.0.1:5000/", {
			method: "GET",
			timeout: 1,
			responseType: ResponseType.JSON,
		});
		return response.data;
	}

	useEffect(() => {
		const int = setInterval(async () => {
			await getData()
				.then(res => {
					setParams({
						lat: res[0].lat / 10000000,
						lon: res[0].lon / 10000000,
						ground_speed: res[0].ground_speed,
						alt: res[0].alt,
						orientation: [
							res[0].roll / Math.PI * 180,
							-res[0].yaw / Math.PI * 180,
							res[0].pitch / Math.PI * 180
						]
					})
					setPorts([...res[1]["_ports"], " "]);
					setPort(res[1]["port_name"]);
				});

		})

		return () => clearInterval(int);
	}, [])

	useEffect(() => {
		if (params.lat != 0 && params.lon != 0) {
			setTrack(prev => {
				prev[0].path.push([params.lon, params.lat])
				return prev
			})
		}
	}, [params.lat, params.lon])

	return { port, ports, track, lat: params.lat, lon: params.lon, alt: params.alt, ground_speed: params.ground_speed, orientation: params.orientation }
}

export default useDragula