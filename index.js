/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import store from './store/store';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background! opened app index.js', remoteMessage);
  });

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
