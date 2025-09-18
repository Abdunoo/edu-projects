// types/toast.ts

// Available colors in Nuxt UI toast
export type ToastColor = 'primary' | 'success' | 'error' | 'warning' | 'neutral'

// Available toast orientation
export type ToastOrientation = 'horizontal' | 'vertical'

// Minimal toast options
export interface ToastOptions {
  title?: string
  description?: string
  color?: ToastColor
  icon?: string
  avatar?: never
  close?: boolean
  closeIcon?: string
  actions?: never[] // Nuxt UI actions (buttons, slots, etc.)
  orientation?: ToastOrientation
  progress?: boolean
  duration?: number
}
