import { create } from 'zustand'

type DragulaType = {
	lat: number;
	lon: number;
	orientation: number[];

	setLat: (lat: number) => void;
	setLon: (lon: number) => void;
	setOrientation: (Orientation: number[]) => void;
}

const useDragulaStore = create<DragulaType>((set) => ({
	lat: 50,
	lon: 50,
	orientation: [0, 0, 0],

	setLat: (lat: number) => set(() => ({ lat: lat })),
	setLon: (lon: number) => set(() => ({ lon: lon })),
	setOrientation: (Orientation: number[]) => set(() => ({ orientation: Orientation })),
}))

export default useDragulaStore;
