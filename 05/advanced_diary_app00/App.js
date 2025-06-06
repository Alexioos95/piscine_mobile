/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import React from 'react';
// My components
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/////////////////////////////////
//// Application
/////////////////////////////////
export default function App() {
	const Stack = createNativeStackNavigator();
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
				<Stack.Screen name="Home" component={Home}/>
				<Stack.Screen name="Login" component={Login}/>
				<Stack.Screen name="Profile" component={Profile}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
