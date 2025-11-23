export type VisionItem = {
  id: string
  label: string
  content: string
  type: 'text' | 'image' | 'file'
  isUserAsset?: boolean
}
