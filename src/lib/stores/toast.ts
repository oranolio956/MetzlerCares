import { writable } from 'svelte/store'

type ToastType = 'success' | 'error' | 'info'

export type ToastItem = {
  id: number
  message: string
  type: ToastType
  duration?: number
}

export const toasts = writable<ToastItem[]>([])

export function toast(message: string, type: ToastType = 'info', duration = 4000) {
  const id = Math.floor(Date.now() + Math.random() * 1000)
  toasts.update((list) => [...list, { id, message, type, duration }])
  if (duration > 0) setTimeout(() => dismiss(id), duration)
}

export function dismiss(id: number) {
  toasts.update((list) => list.filter((t) => t.id !== id))
}