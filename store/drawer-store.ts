import { create } from 'zustand'

interface DrawerState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
}))
