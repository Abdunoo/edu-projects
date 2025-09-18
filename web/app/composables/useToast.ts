// composables/useToast.ts
import type { ToastOptions } from '~~/types/toast'

export function useCustomToast() {
  const toast = useToast()

  function showToast(options: ToastOptions) {
    toast.add({
      title: options.title ?? 'Notification',
      description: options.description ?? '',
      color: options.color ?? 'primary',
      icon: options.icon ?? 'i-lucide-info',
      avatar: options.avatar,
      close: options.close ?? true,
      closeIcon: options.closeIcon,
      actions: options.actions,
      orientation: options.orientation ?? 'vertical',
      progress: options.progress ?? true,
      duration: options.duration,
    })
  }

  function success(description: string, title = 'Success') {
    showToast({ title, description, color: 'success', icon: 'i-lucide-check-circle' })
  }

  function info(description: string, title = 'Info') {
    showToast({ title, description, color: 'primary', icon: 'i-lucide-info-circle' })
  }

  function warning(description: string, title = 'Warning') {
    showToast({ title, description, color: 'warning', icon: 'i-lucide-alert-circle' })
  }

  function error(description: string, title = 'Error') {
    showToast({ title, description, color: 'error', icon: 'i-lucide-alert-circle' })
  }

  return {
    showToast,
    success,
    info,
    warning,
    error,
  }
}
