/* eslint-disable @typescript-eslint/no-var-requires */
const { withNxMetro } = require('@nrwl/react-native')
const { getDefaultConfig } = require('metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')
const { path } = require('path')

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig(__dirname)
  console.log('metro root __dirname', __dirname)
  return withNxMetro(
    {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
            resetCache: true,
          },
        }),
      },
      resolver: {
        assetExts: assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg', 'ts'],
        blockList: exclusionList([/^(?!.*node_modules).*\/dist\/.*/])
      },
    },
    {
      // Change this to true to see debugging info.
      // Useful if you have issues resolving modules
      debug: false,
      // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
      extensions: ['ts'],
      // the project root to start the metro server
      projectRoot: __dirname,
      // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
      watchFolders: [],
    },
  )
})()
