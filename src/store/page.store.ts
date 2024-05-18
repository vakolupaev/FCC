import { create } from 'zustand'

const usePageStore = create((set) => ({
	page: "map",

	setPage: (page: string) => set(() => ({ page })),
}))

export default usePageStore;
