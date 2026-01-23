import { getAuth } from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

export async function uploadImageToStorage(
  localUri: string,
  path: string
): Promise<string> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to upload images')
  }

  try {
    const reference = storage().ref(path)

    // Upload the file
    await reference.putFile(localUri, {
      contentType: 'image/jpeg',
    })

    // Get download URL
    const downloadURL = await reference.getDownloadURL()
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function uploadProfilePicture(localUri: string): Promise<string> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User must be authenticated to upload profile picture')
  }

  const filename = `profile_${user.uid}_${Date.now()}.jpg`
  const path = `users/${user.uid}/profile/${filename}`

  return uploadImageToStorage(localUri, path)
}

export async function deleteImageFromStorage(path: string): Promise<void> {
  try {
    const reference = storage().ref(path)
    await reference.delete()
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
