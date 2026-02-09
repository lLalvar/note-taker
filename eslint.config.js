// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const linguiPlugin = require('eslint-plugin-lingui')

module.exports = defineConfig([
  expoConfig,
  linguiPlugin.configs['flat/recommended'],
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'web-build/**',
      'expo-env.d.ts',
    ],
  },
])
