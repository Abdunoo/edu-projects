// composables/useToast.ts
import type { AvatarProps, ButtonProps, ToastProps } from '@nuxt/ui'

// If you own this type, align it with Nuxt UI Button props.
export type ToastAction = ButtonProps & { label: string } // includes onClick?: (e?: MouseEvent) => any
export type ToastOptions = {
  title?: string
  description?: string
  color?: ToastProps['color']
  icon?: string
  avatar?: AvatarProps
  close?: boolean | Partial<ButtonProps>
  closeIcon?: string
  actions?: ToastAction[]
  orientation?: 'horizontal' | 'vertical'
  progress?: boolean | { color?: ToastProps['color']; ui?: any }
  /** Not native; if provided we’ll remove the toast ourselves after this many ms */
  duration?: number
}

export function useCustomToast() {
  const toast = useToast()

  function showToast(options: ToastOptions) {
    const t = toast.add({
      title: options.title ?? 'Notification',
      description: options.description ?? '',
      color: options.color ?? 'primary',
      icon: options.icon ?? 'i-lucide-info',
      avatar: options.avatar,
      close: options.close ?? true,
      closeIcon: options.closeIcon,
      actions: options.actions,
      orientation: options.orientation ?? 'horizontal',
      progress: options.progress ?? true
    })

    // Optional per-toast duration (Nuxt UI officially recommends global duration)
    if (options.duration && t?.id != null) {
      setTimeout(() => toast.remove(t.id), options.duration)
    }
  }

  function success(description: string, title = 'Success') {
    showToast({ title, description, color: 'success', icon: 'i-lucide-check-circle' })
  }

  function info(description: string, title = 'Info') {
    showToast({ title, description, color: 'primary', icon: 'i-lucide-info' })
  }

  function warning(description: string, title = 'Warning') {
    showToast({ title, description, color: 'warning', icon: 'i-lucide-alert-triangle' })
  }

  function error(description: string, title = 'Error') {
    showToast({ title, description, color: 'error', icon: 'i-lucide-alert-circle' })
  }

  function action(description: string, title = 'Action', actions: ToastOptions['actions']) {
    showToast({
      title,
      description,
      color: 'primary',
      icon: 'i-lucide-info',
      actions,
      orientation: 'horizontal'
    })
  }

  return { showToast, success, info, warning, error, action }
}
