import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    typescript: true
  },
  {
    rules: {
      'style/no-extra-semi': 'error',
      'style/comma-dangle': ['error', 'never']
    }
  }
)
