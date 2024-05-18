import { create } from 'zustand'

const useMapStore = create((set) => ({
	lat: 0,
	lon: 0,
	zoom: 18,

	setLat: (lat: number) => set(() => ({ lat })),
	setLon: (lon: number) => set(() => ({ lon })),
	setZoom: (zoom: number) => set(() => ({ zoom })),
}))

export default useMapStore;
