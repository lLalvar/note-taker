import React from 'react'

import { useLocalSearchParams } from 'expo-router'

import { NoteForm } from '@/components/note-form'

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    return null
  }

  return <NoteForm noteId={id} />
}
