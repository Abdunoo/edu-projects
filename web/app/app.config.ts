export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'sky',
      secondary: 'violet',
      gray: 'gray',
      success: 'green',
      warning: 'yellow',
      error: 'red',
      info: 'blue',
    },
    button: {
      defaultVariants: {
        // Set default button color to neutral
        color: 'neutral'
      },
      variants: {
        color: {
          neutral: 'neutral',
          primary: 'primary',
          secondary: 'secondary',
          success: 'success',
          warning: 'warning',
          error: 'error',
          info: 'info'
        }
      }
    }
  },
})
