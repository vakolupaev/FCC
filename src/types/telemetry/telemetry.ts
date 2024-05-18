
type TelemetryPosition = {
	type_of_message: number,
	ground_speed: number,
	pitch: number,
	yaw: number,
	roll: number,
	lat: number,
	lon: number,
	alt: number,
}
type TelemetryBattery = {
	type_of_message: number,
	voltage: number,
}