export interface Mood {
  emoji: string
  name: string
  category: 'positive' | 'neutral' | 'negative'
}

export const MOODS: Mood[] = [
  { emoji: '😐', name: 'Neutral', category: 'neutral' },
  { emoji: '😊', name: 'Happy', category: 'positive' },
  { emoji: '😂', name: 'Very Happy', category: 'positive' },
  { emoji: '😍', name: 'In Love', category: 'positive' },
  { emoji: '😌', name: 'Content', category: 'positive' },
  { emoji: '😟', name: 'Worried', category: 'negative' },
  { emoji: '😠', name: 'Angry', category: 'negative' },
  { emoji: '😢', name: 'Sad', category: 'negative' },
  { emoji: '😭', name: 'Crying', category: 'negative' },
  { emoji: '🤢', name: 'Sick', category: 'negative' },
]

export const DEFAULT_MOOD = MOODS[0] // Neutral emoji (😐)

export function getMoodByEmoji(emoji: string): Mood | undefined {
  return MOODS.find((mood) => mood.emoji === emoji)
}
