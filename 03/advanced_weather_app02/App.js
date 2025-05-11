// Basic Components
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, FlatList, ImageBackground, Text, Pressable } from 'react-native';
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
import Feather from '@expo/vector-icons/Feather';
// Geolocation
import * as Location from 'expo-location';

export default function App() {
	// Logic
	const Tab = createMaterialTopTabNavigator();
	const [searchValue, setSearchValue] = useState("");
	const [currData, setcurrData] = useState("");
	const [todayData, settodayData] = useState("");
	const [weeklyData, setweeklyData] = useState("");
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
						setcurrData("Geolocation is not available, please enable it in your App settings")
						settodayData("Geolocation is not available, please enable it in your App settings")
						setweeklyData("Geolocation is not available, please enable it in your App settings")
						setGetLocation(false);
						return ;
					}
				}
				const location = await Location.getCurrentPositionAsync({});
				const res = location.coords.latitude + " " + location.coords.longitude;
				setcurrData(res);
				settodayData(res);
				setweeklyData(res);
				fetchWeather(location, location.coords.latitude, location.coords.longitude);
				setGetLocation(false);
			}
		})()
	}, [getLocation]);

	// Fetch of data
	async function fetchSuggestions(input)
	{
		try
		{
			if (input.length < 3)
				return ;
			const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`);
			const data = await res.json();
			if (data.results !== undefined)
				data.results.splice(5, 9);
			setSuggestionList(data.results);
		}
		catch(e)
		{
			console.error(e);
			setcurrData("A critical error occured while fetching data from open-meteo.com");
			settodayData("A critical error occured while fetching data from open-meteo.com");
			setweeklyData("A critical error occured while fetching data from open-meteo.com");
		}
	}
	async function fetchWeather(name, lat, lon)
	{
		try
		{
			setSuggestionList([]);
			const forecast = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,cloud_cover,wind_speed_10m`);
			const forecastData = await forecast.json();

			let cityInfo = "";
			if (name.name != undefined)
				cityInfo = name.name + "\n" + name.admin1 + "\n" + name.country + "\n";
			else
				cityInfo = "Your position\n\n\n";
			const currRes = cityInfo + getCurrentWeather(forecastData.hourly, forecastData.hourly_units);
			const todayRes = cityInfo + getTodayWeather(forecastData.hourly, forecastData.hourly_units);
			const weekRes = cityInfo + getWeeklyWeather(forecastData.hourly, forecastData.hourly_units);

			setcurrData(currRes);
			settodayData(todayRes);
			setweeklyData(weekRes);
		}
		catch (e)
		{
			console.error(e);
			setcurrData("A critical error occured while fetching data from open-meteo.com");
			settodayData("A critical error occured while fetching data from open-meteo.com");
			setweeklyData("A critical error occured while fetching data from open-meteo.com");
		}
	}
	function getWeatherDescription(data, index)
	{
		if (data.rain[index] > 1)
			return ("Rainy");
		else if (data.cloud_cover[index] > 50)
			return ("Cloudy");
		return ("Sunny");
	}
	function getCurrentWeather(data, type)
	{
		res = data.temperature_2m[0] + type.temperature_2m + "\n" + getWeatherDescription(data, 0) + "\n" + data.wind_speed_10m[0] + type.wind_speed_10m;
		return (res);
	}
	function getTodayWeather(data, type)
	{
		let res = "";
		for (let i = 0; i < 24; i++)
		{
			let len = data.time[i].length;
			res = res + data.time[i].substring(len - 5, len) + " " + data.temperature_2m[i] + type.temperature_2m + " " + getWeatherDescription(data, i) + " " + data.wind_speed_10m[i] + type.wind_speed_10m + "\n";
		}
		return (res);
	}
	function getWeeklyWeather(data, type)
	{
		let days = [
			{ date: data.time[0], startIndex: 0, endIndex: 24 },
			{ date: data.time[24], startIndex: 24, endIndex: 48 },
			{ date: data.time[48], startIndex: 48, endIndex: 72 },
			{ date: data.time[72], startIndex: 72, endIndex: 96 },
			{ date: data.time[96], startIndex: 96, endIndex: 120 },
			{ date: data.time[120], startIndex: 120, endIndex: 144 },
			{ date: data.time[144], startIndex: 144, endIndex: 168 }
		]
		let res = "";

		for (let i = 0; i < 7; i++)
			res = res + days[i].date.substring(0, 10) + " " + getMinTemp(data.temperature_2m, days[i]) + type.temperature_2m + " " + getMaxTemp(data.temperature_2m, days[i]) + type.temperature_2m + " " + getWeatherDescription(data, (11 * i)) + "\n";
		return (res);
	}
	function getMinTemp(data, day)
	{
		let i = day.startIndex;
		let min = data[i];

		while (i < day.endIndex)
		{
			if (data[i] < min)
				min = data[i];
			i++;
		}
		return (min);
	}
	function getMaxTemp(data, day)
	{
		let i = day.startIndex;
		let max = data[i];

		while (i < day.endIndex)
		{
			if (data[i] > max)
				max = data[i];
			i++;
		}
		return (max);
	}

	// Components' creation
	function CurrentlyData()
	{
		if (currData.indexOf("\n") === -1)
		{
			return (
				<View style={styles.tab}>
					<Text style={styles.tabText}>{currData}</Text>
				</View>
			)
		}
		// City
		const words = currData.split("\n");
		const cityName = words[0];
		let cityInfo = "";
		if (words[1] !== "undefined" && words[1] !== "")
			cityInfo = words[1] + ", ";
		if (words[2] !== "")
			cityInfo = cityInfo + words[2];
		// Temperature
		const temp = words[3];
		// General condition
		const condition = words[4]
		let conditionIcon;
		if (words[4] === "Cloudy")
			conditionIcon = <Feather name="cloud" size={40} color="#3FABDA"/>
		else if (words[4] === "Cloudy")
			conditionIcon = <Feather name="cloud-rain" size={40} color="#3FABDA"/>
		else
			conditionIcon = <Feather name="sun" size={40} color="#3FABDA"/>
		// Wind
		const wind = words[5];
		return (
				<View style={styles.tab}>
					<View style={styles.tabBlock}>
						<Text style={[styles.tabText, styles.tabCity]}>{cityName}</Text>
						<Text style={styles.tabText}>{cityInfo}</Text>
					</View>
					<View>
						<View style={styles.tabBlock}>
							<Text style={[styles.tabText, styles.tabTemp]}>{temp}</Text>
						</View>
						<View style={styles.tabBlock}>
							<Text style={styles.tabText}>{condition}</Text>
							<View>{conditionIcon}</View>
						</View>
					</View>
					<View style={styles.tabBlock}>
						<Feather name="wind" size={20} color="#3FABDA"/>
						<Text style={styles.tabText}>{wind}</Text>
					</View>
				</View>
		)
	}
	function TodayData()
	{
		if (todayData.indexOf("\n") === -1)
		{
			return (
				<View style={styles.tab}>
					<Text style={styles.tabText}>{todayData}</Text>
				</View>
			)
		}
	}
	function WeeklyData()
	{
		if (weeklyData.indexOf("\n") === -1)
		{
			return (
				<View style={styles.tab}>
					<Text style={styles.tabText}>{weeklyData}</Text>
				</View>
			)
		}
	}

	// Components
	function Currently()
	{
		return (
			<View style={styles.tab}>
				<CurrentlyData/>
			</View>
		);
	}
	function Today()
	{
		return (
			<View style={styles.tab}>
				<TodayData/>
			</View>
		);
	}
	function Weekly()
	{
		return (
			<View style={styles.tab}>
				<WeeklyData/>
			</View>
		);
	}

	// Render
	return (
		<SafeAreaProvider>
			<ImageBackground source={require("./assets/background.png")} style={styles.background}>
				<Appbar.Header style={styles.appbar}>
					<Entypo name="magnifying-glass" size={24} color="orange" style={styles.headerIcon}/>
					<TextInput style={styles.input} label="Search location..." value={searchValue}
						onChangeText={(input) => {
							if (searchValue.length < 3)
								setSuggestionList([]);
							setSearchValue(input);
							fetchSuggestions(input);
						}}
						onFocus={() => {
							if (searchValue.length < 3)
								setSuggestionList([]);
							fetchSuggestions(searchValue);
						}}
						onSubmitEditing={() => {
							if (suggestionList === undefined)
							{
								setcurrData("Could not find any result for the supplied address or coordinates");
								settodayData("Could not find any result for the supplied address or coordinates");
								setweeklyData("Could not find any result for the supplied address or coordinates");
								return ;
							}
							if (searchValue.length < 3 || suggestionList.length === 0)
								return ;
							fetchWeather(suggestionList[0],suggestionList[0].latitude, suggestionList[0].longitude);
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
								if (item.admin1 === undefined)
									setSearchValue(`${item.name}, ${item.country}`)
								else
									setSearchValue(`${item.name}, ${item.admin1}, ${item.country}`)
								fetchWeather(item, item.latitude, item.longitude);
							}}>
								<Text style={styles.listItemText}> {item.name}, {item.admin1}, {item.country}</Text>
							</Pressable>
						)
				}}/>
				<NavigationContainer style={styles.padding} onStateChange={() => setSuggestionList([])}>
					<Tab.Navigator initalRouteName="Currently" tabBarPosition="bottom" screenOptions={({route}) => ({
							tabBarIcon: ({ focused, color }) => {
							color = focused ? "white" : "#9E9E9E";
							if (route.name === "Currently")
								return (<Ionicons name="settings" size={24} color={color}/>);
							else if (route.name === "Today")
								return (<MaterialCommunityIcons name="calendar-today" size={24} color={color}/>);
							else if (route.name === "Weekly")
								return (<MaterialCommunityIcons name="calendar-week" size={24} color={color}/>);
						},
						onTabPress: () => setSuggestionList([]),
						tabBarShowIcon: true,
						tabBarStyle: { backgroundColor: 'transparent' },
						tabBarActiveTintColor: "white",
						tabBarInactiveTintColor: "#9E9E9E",
						tabBarIndicatorStyle: { backgroundColor: "orange", height: 5 },
						swipeEnabled: true,
						sceneStyle: {backgroundColor: "transparent"}
					})} >
						<Tab.Screen name="Currently" component={Currently} />
						<Tab.Screen name="Today" component={Today} />
						<Tab.Screen name="Weekly" component={Weekly} />
					</Tab.Navigator>
				</NavigationContainer>
			</ImageBackground>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	appbar: {
		backgroundColor: "transparent",
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
		height: "100%",
		backgroundColor: "black",
		borderColor: "orange",
		borderWidth: 2
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
		fontSize: 14,
		fontWeight: 800
	},
	tab: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "space-around",
		padding: "2%"
	},
	tabBlock: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center"
	},
	tabText: {
		color: "#FBFAF5",
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center"
	},
	tabCity: {
		fontWeight: "900",
		fontSize: 20
	},
	tabTemp: {
		color: "orange",
		fontWeight: "900",
		fontSize: 50
	},
	background: {
		flex: 1,
		height: "100%",
		width: "100%",
		resizeMode: "cover"
	},
	padding: {
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	}
});
