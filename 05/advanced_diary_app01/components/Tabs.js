/////////////////////////////////
//// Imports
/////////////////////////////////
// My components
import Profile from './Profile';
import Agenda from './Agenda';
// Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Icons
import FontAwesome from '@expo/vector-icons/FontAwesome';

/////////////////////////////////
//// Application
/////////////////////////////////
export default function Tabs() {
	const NestedTabs = createMaterialTopTabNavigator();
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<NestedTabs.Navigator initalRouteName="Currently" tabBarPosition="bottom" screenOptions={({route}) => ({
				tabBarIcon: () => {
					if (route.name === "Profile")
						return (<FontAwesome name="user" size={24} color="black"/>);
					else
						return (<FontAwesome name="calendar-o" size={24} color="black"/>);
				},
				tabBarStyle: { backgroundColor: "transparent" },
				tabBarShowIcon: true,
				tabBarIndicatorStyle: { backgroundColor: "rgb(173,216,230)", height: 2 },
				sceneStyle: {backgroundColor: "transparent"},
				swipeEnabled: false,
			})}
		>
			<NestedTabs.Screen name="Profile">{() => <Profile/>}</NestedTabs.Screen>
			<NestedTabs.Screen name="Agenda">{() => <Agenda/>}</NestedTabs.Screen>
		</NestedTabs.Navigator>
	);
}

/////////////////////////////////
//// Styles
/////////////////////////////////
// const styles = StyleSheet.create({

// });
