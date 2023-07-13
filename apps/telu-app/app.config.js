import CONFIG from 'react-native-config'

import { version } from './package.json'

export default {
  // app
  name: CONFIG.APP_MODULE_NAME,
  displayName: CONFIG.APP_DISPLAY_NAME,
  projectCode: 'telu',
  version,
  scheme: CONFIG.URL_SCHEME,
  clientId: 0,
}
