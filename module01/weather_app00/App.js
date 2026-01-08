// Basic Components
import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Header
import { StatusBar } from 'expo-status-bar';
import { Appbar, TextInput } from 'react-native-paper';
// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const CustomStatusBar = ({backgroundColor, barStyle = "dark-content"}) => {
	return (
		<View style={{backgroundColor}}>
			<StatusBar animated={true} backgroundColor={backgroundColor} barStyle={barStyle}/>
		</View>
	);
};

function Currently()
{
	return (
		<SafeAreaProvider>
			<View style={styles.tab}>
				<Text style={styles.title}>CURRENTLY</Text>
			</View>
		</SafeAreaProvider>
	);
}

function Today()
{
	return (
		<SafeAreaProvider>
			<View style={styles.tab}>
				<Text style={styles.title}>TODAY</Text>
			</View>
		</SafeAreaProvider>
	);
}

function Weekly()
{
	return (
		<SafeAreaProvider>
			<View style={styles.tab}>
				<Text style={styles.title}>WEEKLY</Text>
			</View>
		</SafeAreaProvider>
	);
}

export default function App() {
	const Tab = createMaterialTopTabNavigator();
	const [searchValue, setSearchValue] = useState("");
	const handleSearchChange = (input) => { setSearchValue(input); };

	return (
		<SafeAreaProvider>
			<CustomStatusBar backgroundColor="red"/>
			<Appbar.Header style={styles.appbar}>
				<Entypo name="magnifying-glass" size={24} color="#9e9e9e" style={styles.headerIcon}/>
				<TextInput style={styles.input} label="Search location..." value={searchValue} onChangeText={handleSearchChange}
					theme={{colors: { text: "white", primary: "white", placeholder: "#9e9e9e"}}}
				/>
				<Pressable style={styles.pressable}>
					<FontAwesome name="location-arrow" size={24} color="white" style={styles.pressableIcon}/>
				</Pressable>
			</Appbar.Header>
			<NavigationContainer style={styles.padding}>
				<Tab.Navigator initalRouteName="Currently" tabBarPosition="bottom" screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color }) => {
					color = "#9e9e9e";
					if (focused)
						color = "#617d8a";
					if (route.name === "Currently")
						return <Ionicons name="settings" size={24} color={color} />;
					else if (route.name === "Today")
						return <MaterialCommunityIcons name="calendar-today" size={24} color={color} />;
					else if (route.name === "Weekly")
						return <MaterialCommunityIcons name="calendar-week" size={24} color={color} />;
					},
					tabBarShowIcon: true,
					tabBarActiveTintColor: "#617d8a",
					tabBarInactiveTintColor: "#9e9e9e",
					swipeEnabled: true
				})}>
					<Tab.Screen name="Currently" component={Currently} />
					<Tab.Screen name="Today" component={Today} />
					<Tab.Screen name="Weekly" component={Weekly} />
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	padding: {
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},
	appbar: {
		backgroundColor: "#617d8a",
		alignItems: "center",
		paddingHorizontal: "1%"
	},
	headerIcon: {
		width: "10%",
		textAlign: "center",
		alignContent: "center"
	},
	pressable: {
		height: "100%",
		width: "10%",
		justifyContent: "center",
		alignItems: "center"
	},
	pressableIcon: {
		width: "100%",
		textAlign: "center",
		alignContent: "center"
	},
	input: {
		width: "78%",
		backgroundColor: "#617d8a",
		borderRightColor: "white",
		borderRightWidth: 2,
		borderTopRightRadius: 0
	},
	tab: {
		flex: 1,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		fontSize: "25",
		fontWeight: "800"
	}
});
