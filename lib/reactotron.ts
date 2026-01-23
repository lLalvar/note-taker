import Reactotron from 'reactotron-react-native'
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query'

import { queryClient } from './query-client'

const queryClientManager = new QueryClientManager({ queryClient })

Reactotron.configure({
  name: 'Note Taker',
  onDisconnect: () => {
    queryClientManager.unsubscribe()
  },
})
  .use(reactotronReactQuery(queryClientManager))
  .useReactNative()
  .connect()

// Log connection status (only in development)
if (__DEV__) {
  console.log('🔌 Reactotron: Connecting to desktop app...')
  console.log('📱 Reactotron: Make sure the Reactotron desktop app is running!')
}

export default Reactotron
