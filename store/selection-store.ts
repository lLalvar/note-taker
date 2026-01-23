import { create } from 'zustand'

interface SelectionState {
  isSelectionMode: boolean
  selectedNoteIds: Set<string>
  setIsSelectionMode: (isSelectionMode: boolean) => void
  setSelectedNoteIds: (ids: Set<string>) => void
  toggleNoteSelection: (noteId: string) => void
  selectAll: (allNoteIds: string[]) => void
  deselectAll: () => void
  clearSelection: () => void
  enterSelectionMode: (noteId: string) => void
  exitSelectionMode: () => void
  getSelectedCount: () => number
  isAllSelected: (totalCount: number) => boolean
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  isSelectionMode: false,
  selectedNoteIds: new Set<string>(),

  setIsSelectionMode: (isSelectionMode: boolean) => {
    set({ isSelectionMode })
  },

  setSelectedNoteIds: (ids: Set<string>) => {
    set({ selectedNoteIds: ids })
  },

  toggleNoteSelection: (noteId: string) => {
    if (!get().isSelectionMode) return

    set((state) => {
      const newSet = new Set(state.selectedNoteIds)
      if (newSet.has(noteId)) {
        newSet.delete(noteId)
      } else {
        newSet.add(noteId)
      }
      return { selectedNoteIds: newSet }
    })
  },

  selectAll: (allNoteIds: string[]) => {
    set({ selectedNoteIds: new Set(allNoteIds) })
  },

  deselectAll: () => {
    set({ selectedNoteIds: new Set() })
  },

  clearSelection: () => {
    set({
      isSelectionMode: false,
      selectedNoteIds: new Set(),
    })
  },

  enterSelectionMode: (noteId: string) => {
    if (get().isSelectionMode) return
    set({
      isSelectionMode: true,
      selectedNoteIds: new Set([noteId]),
    })
  },

  exitSelectionMode: () => {
    set({
      isSelectionMode: false,
      selectedNoteIds: new Set(),
    })
  },

  getSelectedCount: () => {
    return get().selectedNoteIds.size
  },

  isAllSelected: (totalCount: number) => {
    const selectedCount = get().selectedNoteIds.size
    return selectedCount === totalCount && totalCount > 0
  },
}))
