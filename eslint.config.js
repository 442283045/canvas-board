import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    typescript: true,
    vue: true
  },
  {
    rules: {
      'style/no-extra-semi': 'error',
      'style/comma-dangle': ['error', 'never'],
      'antfu/if-newline': 'off',
      'curly': ['error', 'multi-line'],
      'no-console': 'off',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        }
      }],
      'style/brace-style': ['error', '1tbs']
    }
  }
)
