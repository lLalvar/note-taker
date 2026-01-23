import { Timestamp } from '@react-native-firebase/firestore'

export interface Note {
  id: string
  title?: string
  description?: string
  mood?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  userId: string
  deletedAt?: Timestamp
}

export interface CreateNoteData {
  title?: string
  description?: string
  mood?: string
}
