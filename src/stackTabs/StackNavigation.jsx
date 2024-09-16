import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import GenerateOtp from './GenerateOtp';
import AllScreens from '../bottomTabs/AllScreens';
import { useSelector } from 'react-redux';
import IstScreen from './IstScreen';

// its add item open on click on button using stack navigation
const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {
    const authStatus = useSelector((state) => state.userData.authStatus)
  return (
    <HomeStack.Navigator initialRouteName={'IstScreen'} screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeStack" component={AllScreens} />
      {!authStatus && <HomeStack.Screen name="Login" component={LoginScreen} />}
      {!authStatus && <HomeStack.Screen name="GenerateOtp" component={GenerateOtp} />}
      <HomeStack.Screen name="IstScreen" component={IstScreen} />
    </HomeStack.Navigator>
  );
}