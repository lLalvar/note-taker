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
  const notesQuery = query(notesRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(notesQuery)

  return snapshot.docs.map(
    (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const data = docSnapshot.data()
      return {
        id: docSnapshot.id,
        title: data?.title || undefined,
        description: data?.description || undefined,
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
