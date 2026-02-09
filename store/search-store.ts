import { create } from 'zustand'

interface SearchState {
  searchQuery: string
  isSearchActive: boolean
  setSearchQuery: (query: string) => void
  setIsSearchActive: (isActive: boolean) => void
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  isSearchActive: false,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },

  setIsSearchActive: (isActive: boolean) => {
    set({ isSearchActive: isActive })
  },

  openSearch: () => {
    set({ isSearchActive: true })
  },

  closeSearch: () => {
    set({
      isSearchActive: false,
      searchQuery: '',
    })
  },

  toggleSearch: () => {
    const { isSearchActive } = get()
    if (isSearchActive) {
      get().closeSearch()
    } else {
      get().openSearch()
    }
  },

  clearSearch: () => {
    get().closeSearch()
  },
}))
