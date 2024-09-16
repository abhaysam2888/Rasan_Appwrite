import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import MembersScreen from './MembersScreen';
import Icons from 'react-native-vector-icons/FontAwesome';
import RasanList from './RasanList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddItems from '../stackTabs/AddItems';
import Items from '../stackTabs/Items';
import EditItem from '../stackTabs/EditItem';
import SafiTab from '../stackTabs/SafiTab';
import LoginScreen from '../stackTabs/LoginScreen';
import GenerateOtp from '../stackTabs/GenerateOtp';
import AddMemberContri from '../stackTabs/AddMemberContri';
import ContriList from './ContriList';

// its add item open on click on button using stack navigation
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName={'HomeStack'} screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeStack" component={HomeScreen} />
      <HomeStack.Screen name="AddItem" component={AddItems} />
      <HomeStack.Screen name="Item" component={Items} />
      <HomeStack.Screen name="EditItem" component={EditItem} />
      <HomeStack.Screen name="EditItems" component={RasanList} />
      <HomeStack.Screen name="SafiScreen" component={SafiTab} />
      <HomeStack.Screen name="Login" component={LoginScreen} />
      <HomeStack.Screen name="GenerateOtp" component={GenerateOtp} />
      <HomeStack.Screen name="AddAmount" component={AddMemberContri} />
      <HomeStack.Screen name="memberListItems" component={MembersScreen} />
    </HomeStack.Navigator>
  );
}

export default function AllScreens() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator 
    // initialRouteName='Home' 
    screenOptions={{
      tabBarStyle:{backgroundColor:'#161622'},
      tabBarActiveTintColor: '#AD49E1',
      tabBarInactiveTintColor: '#fff',
      }}>
      <Tab.Screen 
      name="Home" 
      component={HomeStackScreen} 
      options={{
        headerShown: false, 
        tabBarIcon: ({ color, size }) => (
      <Icons name="home" color={color} size={size}/>)
      }} />
      <Tab.Screen 
      name="Members"
      component={MembersScreen} 
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icons name="users" color={color} size={size}/>)
      }}/>
      <Tab.Screen 
      name="Rasan"
      component={RasanList} 
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icons name="shopping-basket" color={color} size={size}/>)
      }}/>
      <Tab.Screen 
      name="Contri"
      component={ContriList} 
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icons name="money" color={color} size={size}/>)
      }}/>
    </Tab.Navigator>
  );
}