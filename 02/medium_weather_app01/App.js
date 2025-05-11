// Basic Components
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, FlatList } from 'react-native';
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
// Geolocation
import * as Location from 'expo-location';

export default function App() {
	// Code
	const Tab = createMaterialTopTabNavigator();
	const [searchValue, setSearchValue] = useState("");
	const [searchedFor, setSearchedFor] = useState("");
	const [getLocation, setGetLocation] = useState(true);
	const [suggestionList, setSuggestionList] = useState();

	useEffect(() => {
		(async() => {
			if (getLocation)
			{
				const currPerm = await Location.getForegroundPermissionsAsync();
				if (currPerm.granted === false)
				{
					const newPerm = await Location.requestForegroundPermissionsAsync();
					if (newPerm.granted === false)
					{
						setSearchedFor("Geolocation is not available, please enable it in your App settings");
						setGetLocation(false);
						return ;
					}
				}
				const location = await Location.getCurrentPositionAsync({});
				setSearchedFor(location.coords.latitude + " " + location.coords.longitude);
				fetchWeather(location.coords.latitude, location.coords.longitude);
				setGetLocation(false);
			}
		})()
	}, [getLocation]);

	async function fetchSuggestions(input)
	{
		try
		{
			if (input.length < 4)
				return ;
			const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`);
			const data = await res.json();
			setSuggestionList(data.results);
		}
		catch(e) {
			console.error(e);
			setSearchedFor("A critical error occured while fetching data from open-meteo.com");
		}
	}
	async function fetchWeather(lat, lon)
	{
		setSuggestionList([]);
		try
		{
			const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,cloud_cover,wind_speed_10m`);
			const data = await res.json();
			console.log(data);
		}
		catch (e) { console.error(e) }
	}

	// Tabs
	function Currently()
	{
		return (
			<SafeAreaProvider>
				<View style={styles.tab}>
					<Text style={styles.title}>CURRENTLY</Text>
					<Text style={styles.title}>{searchedFor}</Text>
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
					<Text style={styles.title}>{searchedFor}</Text>
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
					<Text style={styles.title}>{searchedFor}</Text>
				</View>
			</SafeAreaProvider>
		);
	}

	// Render
	return (
		<SafeAreaProvider>
			<Appbar.Header style={styles.appbar}>
				<Entypo name="magnifying-glass" size={24} color="#9e9e9e" style={styles.headerIcon}/>
				<TextInput style={styles.input} label="Search location..." value={searchValue}
					onChangeText={(input) => {
						if (searchValue.length < 5)
							setSuggestionList([]);
						setSearchValue(input);
						fetchSuggestions(input);
					}}
					onFocus={() => {
						if (searchValue.length < 5)
							setSuggestionList([]);
						fetchSuggestions(searchValue);
					}}
					onSubmitEditing={() => {
						if (searchValue.length < 5 || suggestionList.length === 0)
							return ;
						fetchWeather(suggestionList[0].latitude, suggestionList[0].longitude);
					}}
					theme={{colors: { text: "white", primary: "white", placeholder: "#9e9e9e"}}}
				/>
				<Pressable style={styles.pressable} onPress={() => {
					setGetLocation(true);
					setSuggestionList([]);
				}}>
					<FontAwesome name="location-arrow" size={24} color="white" style={styles.pressableIcon}/>
				</Pressable>
			</Appbar.Header>
			<FlatList style={styles.flatlist} data={suggestionList} renderItem={({item}) => {
					return (
						<Pressable style={styles.listItem} onPress={() => {
							setSearchValue(`${item.name}, ${item.admin1}, ${item.country}`)
							fetchWeather(item.latitude, item.longitude);
						}}>
							<Text style={styles.listItemText}> {item.name}, {item.admin1}, {item.country}</Text>
						</Pressable>
					)
			}}/>
			<NavigationContainer style={styles.padding} onStateChange={() => setSuggestionList([])}>
				<Tab.Navigator initalRouteName="Currently" tabBarPosition="bottom" screenOptions={({route}) => ({
						tabBarIcon: ({ focused, color }) => {
						color = focused ? "#617d8a" : "#9e9e9e";
						if (route.name === "Currently")
							return <Ionicons name="settings" size={24} color={color} />;
						else if (route.name === "Today")
							return <MaterialCommunityIcons name="calendar-today" size={24} color={color} />;
						else if (route.name === "Weekly")
							return <MaterialCommunityIcons name="calendar-week" size={24} color={color} />;
					},
					onTabPress: () => setSuggestionList([]),
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
	flatlist: {
		width: "100%",
		backgroundColor: "white",
		marginTop: "30%",
		position: "absolute",
		zIndex: 1
	},
	listItem: {
		height: 65,
		padding: "3%",
		borderBottomColor: "#d0cdd8",
		borderBottomWidth: 2,
		justifyContent: "center",
	},
	listItemText: {
		fontSize: "18",
		fontWeight: 800
	},
	tab: {
		flex: 1,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		fontSize: "25",
		fontWeight: "800",
		textAlign: "center"
	}
});
