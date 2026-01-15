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

export async function getNotes(searchQuery?: string): Promise<Note[]> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to get notes')
  }

  const db = getFirestore()
  const notesRef = collection(db, 'users', user.uid, 'notes')

  // If search query is provided and has at least 3 characters, perform search
  const trimmedQuery = searchQuery?.trim()
  const shouldSearch = trimmedQuery && trimmedQuery.length >= 3

  if (shouldSearch) {
    // Normalize query to lowercase for case-insensitive prefix matching
    const normalizedQuery = trimmedQuery!.toLowerCase()
    // Create prefix bounds for Firestore range query
    const startAt = normalizedQuery
    const endAt = normalizedQuery + '\uf8ff' // \uf8ff is a high Unicode character for range queries

    // Query title field (prefix match)
    const titleQuery = query(
      notesRef,
      where('title', '>=', startAt),
      where('title', '<=', endAt)
    )

    // Query description field (prefix match)
    const descriptionQuery = query(
      notesRef,
      where('description', '>=', startAt),
      where('description', '<=', endAt)
    )

    try {
      // Execute both queries in parallel
      const [titleSnapshot, descriptionSnapshot] = await Promise.all([
        getDocs(titleQuery).catch(() => ({ docs: [] })),
        getDocs(descriptionQuery).catch(() => ({ docs: [] })),
      ])

      // Combine results and deduplicate by note ID
      const noteMap = new Map<string, Note>()

      // Process title matches
      titleSnapshot.docs.forEach(
        (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
          const data = docSnapshot.data()
          // Only include if title actually contains the query (case-insensitive check)
          const title = data?.title || ''
          if (title.toLowerCase().startsWith(normalizedQuery)) {
            noteMap.set(docSnapshot.id, {
              id: docSnapshot.id,
              title: data?.title || undefined,
              description: data?.description || undefined,
              mood: data?.mood || undefined,
              createdAt: data?.createdAt,
              updatedAt: data?.updatedAt,
              userId: data?.userId || '',
            })
          }
        }
      )

      // Process description matches
      descriptionSnapshot.docs.forEach(
        (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
          const data = docSnapshot.data()
          // Only include if description actually contains the query (case-insensitive check)
          const description = data?.description || ''
          if (description.toLowerCase().startsWith(normalizedQuery)) {
            // Only add if not already in map (deduplication)
            if (!noteMap.has(docSnapshot.id)) {
              noteMap.set(docSnapshot.id, {
                id: docSnapshot.id,
                title: data?.title || undefined,
                description: data?.description || undefined,
                mood: data?.mood || undefined,
                createdAt: data?.createdAt,
                updatedAt: data?.updatedAt,
                userId: data?.userId || '',
              })
            }
          }
        }
      )

      // Convert map to array and sort by createdAt descending
      const results = Array.from(noteMap.values())
      results.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0
        const bTime = b.createdAt?.toMillis() || 0
        return bTime - aTime
      })

      return results
    } catch (error) {
      console.error('Error searching notes:', error)
      // If queries fail (e.g., missing indexes), return empty array
      return []
    }
  }

  // Default: return all notes sorted by createdAt descending
  const notesQuery = query(notesRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(notesQuery)

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
      }
    }
  )
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
  await deleteDoc(noteRef)
}
