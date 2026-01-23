import { getAuth } from '@react-native-firebase/auth'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@react-native-firebase/firestore'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import type { CreateNoteData, Note } from '@/types'

export async function createNote(data: CreateNoteData): Promise<Note> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to create a note')
  }

  const db = getFirestore()
  const noteData = {
    title: data.title || null,
    description: data.description || null,
    mood: data.mood || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId: user.uid,
  }

  const notesRef = collection(db, 'users', user.uid, 'notes')
  const docRef = await addDoc(notesRef, noteData)

  // Fetch the document to get the server-generated timestamps
  // This ensures we return the actual server timestamp, not a client-generated one
  const createdDoc = await getDoc(docRef)

  if (!createdDoc.exists()) {
    throw new Error('Failed to create note')
  }

  const docData = createdDoc.data() as Record<string, unknown>
  const createdAt = docData.createdAt as Timestamp
  const updatedAt = docData.updatedAt as Timestamp

  if (!createdAt || !updatedAt) {
    throw new Error('Server timestamps not available')
  }

  return {
    id: docRef.id,
    title: data.title,
    description: data.description,
    mood: data.mood,
    createdAt,
    updatedAt,
    userId: user.uid,
  }
}

export async function getNotes(): Promise<Note[]> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to get notes')
  }

  const db = getFirestore()
  const notesRef = collection(db, 'users', user.uid, 'notes')

  // Always fetch all notes sorted by createdAt descending
  const notesQuery = query(notesRef, orderBy('createdAt', 'desc'))

  try {
    const snapshot = await getDocs(notesQuery)

    const notes: Note[] = []
    snapshot.docs.forEach(
      (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = docSnapshot.data()
        // Exclude deleted notes
        if (data?.deletedAt) return
        notes.push({
          id: docSnapshot.id,
          title: data?.title || undefined,
          description: data?.description || undefined,
          mood: data?.mood || undefined,
          createdAt: data?.createdAt,
          updatedAt: data?.updatedAt,
          userId: data?.userId || '',
          deletedAt: data?.deletedAt,
        })
      }
    )

    return notes
  } catch (error) {
    console.error('Error getting notes:', error)
    return []
  }
}

export async function getNote(noteId: string): Promise<Note | null> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to get a note')
  }

  const db = getFirestore()
  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)
  const docSnapshot = await getDoc(noteRef)

  if (!docSnapshot.exists()) {
    return null
  }

  const data = docSnapshot.data()
  if (!data) {
    return null
  }

  return {
    id: docSnapshot.id,
    title: data.title || undefined,
    description: data.description || undefined,
    mood: data.mood || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    userId: data.userId,
    deletedAt: data.deletedAt,
  }
}

export async function updateNote(
  noteId: string,
  data: Partial<CreateNoteData>
): Promise<Note> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to update a note')
  }

  const db = getFirestore()
  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  }

  if (data.title !== undefined) {
    updateData.title = data.title || null
  }
  if (data.description !== undefined) {
    updateData.description = data.description || null
  }
  if (data.mood !== undefined) {
    updateData.mood = data.mood || null
  }

  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)
  await updateDoc(noteRef, updateData)

  const updatedNote = await getNote(noteId)
  if (!updatedNote) {
    throw new Error('Note not found after update')
  }

  return updatedNote
}

export async function deleteNote(noteId: string): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to delete a note')
  }

  const db = getFirestore()
  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)
  // Soft delete: set deletedAt timestamp instead of deleting
  await updateDoc(noteRef, {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteNotes(noteIds: string[]): Promise<void> {
  // Soft delete all notes in parallel
  await Promise.all(noteIds.map((id) => deleteNote(id)))
}

export async function getTrashedNotes(): Promise<Note[]> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to get trashed notes')
  }

  const db = getFirestore()
  const notesRef = collection(db, 'users', user.uid, 'notes')

  // Query notes with deletedAt field, sorted by deletedAt descending
  const trashedQuery = query(
    notesRef,
    where('deletedAt', '!=', null),
    orderBy('deletedAt', 'desc')
  )

  try {
    const snapshot = await getDocs(trashedQuery)
    return snapshot.docs.map(
      (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = docSnapshot.data()
        return {
          id: docSnapshot.id,
          title: data?.title || undefined,
          description: data?.description || undefined,
          mood: data?.mood || undefined,
          createdAt: data?.createdAt,
          updatedAt: data?.updatedAt,
          userId: data?.userId || '',
          deletedAt: data?.deletedAt,
        }
      }
    )
  } catch (error) {
    console.error('Error getting trashed notes:', error)
    // If query fails (e.g., missing index), return empty array
    return []
  }
}

export async function restoreNote(noteId: string): Promise<Note> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to restore a note')
  }

  const db = getFirestore()
  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)

  // Remove deletedAt field to restore the note
  await updateDoc(noteRef, {
    deletedAt: null,
    updatedAt: serverTimestamp(),
  })

  const restoredNote = await getNote(noteId)
  if (!restoredNote) {
    throw new Error('Note not found after restore')
  }

  return restoredNote
}

export async function restoreNotes(noteIds: string[]): Promise<void> {
  // Restore all notes in parallel
  await Promise.all(noteIds.map((id) => restoreNote(id)))
}

export async function permanentlyDeleteNote(noteId: string): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to permanently delete a note')
  }

  const db = getFirestore()
  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)
  await deleteDoc(noteRef)
}

export async function permanentlyDeleteNotes(noteIds: string[]): Promise<void> {
  // Permanently delete all notes in parallel
  await Promise.all(noteIds.map((id) => permanentlyDeleteNote(id)))
}
