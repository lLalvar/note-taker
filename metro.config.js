const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)
const { transformer, resolver } = config

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('@lingui/metro-transformer/expo'),
}

config.resolver = {
  ...resolver,
  sourceExts: [...resolver.sourceExts, 'po', 'pot'],
}

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
})
