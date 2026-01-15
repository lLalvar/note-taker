import { useMemo } from 'react'

import { useDebounce } from 'use-debounce'

import { useSearchStore } from '@/store/search-store'

export function useSearch() {
  const searchQuery = useSearchStore((state) => state.searchQuery)
  const isSearchActive = useSearchStore((state) => state.isSearchActive)
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery)
  const setIsSearchActive = useSearchStore((state) => state.setIsSearchActive)
  const openSearch = useSearchStore((state) => state.openSearch)
  const closeSearch = useSearchStore((state) => state.closeSearch)
  const toggleSearch = useSearchStore((state) => state.toggleSearch)
  const clearSearch = useSearchStore((state) => state.clearSearch)

  // Debounce the search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)

  // Computed values
  const trimmedSearchQuery = useMemo(
    () => debouncedSearchQuery.trim(),
    [debouncedSearchQuery]
  )

  const shouldSearch = useMemo(
    () => trimmedSearchQuery.length >= 3,
    [trimmedSearchQuery]
  )

  return {
    // State
    searchQuery,
    debouncedSearchQuery: trimmedSearchQuery,
    isSearchActive,
    // Computed
    trimmedSearchQuery,
    shouldSearch,
    // Actions
    setSearchQuery,
    setIsSearchActive,
    openSearch,
    closeSearch,
    toggleSearch,
    clearSearch,
  }
}
