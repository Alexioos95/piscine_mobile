/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import { View, ScrollView, Text, Pressable, FlatList, ImageBackground, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
// Header
import { Appbar, TextInput } from 'react-native-paper';
// Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
// Icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
// Features
import * as Location from 'expo-location';
import { LineChart } from 'react-native-chart-kit';

/////////////////////////////////
//// Application
/////////////////////////////////
export default function App() {
	/////////////////////////////////
	//// Variables
	/////////////////////////////////
	const Tab = createMaterialTopTabNavigator();
	const [searchValue, setSearchValue] = useState("");
	const [currData, setcurrData] = useState("");
	const [todayData, settodayData] = useState("");
	const [weeklyData, setweeklyData] = useState("");
	const [getLocation, setGetLocation] = useState(true);
	const [suggestionList, setSuggestionList] = useState();
	/////////////////////////////////
	//// useEffect (Geolocation)
	/////////////////////////////////
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
				fetchWeather(location, location.coords.latitude, location.coords.longitude);
				setGetLocation(false);
			}
		})()
	}, [getLocation]);
	/////////////////////////////////
	//// Fetch of data
	/////////////////////////////////
	async function fetchSuggestions(input)
	{
		try
		{
			if (input.length > 2)
			{
				const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`);
				const data = await res.json();
				if (data.results !== undefined)
					data.results.splice(5, 9);
				setSuggestionList(data.results);
			}
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
			if (name.name !== undefined)
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
	/////////////////////////////////
	//// Create weather's strings
	/////////////////////////////////
	function getCurrentWeather(data, type)
	{
		let res = data.temperature_2m[0] + type.temperature_2m + "\n" + getWeatherDescription(data, 0) + "\n" + data.wind_speed_10m[0] + type.wind_speed_10m;
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
	/////////////////////////////////
	//// Utils for weather's strings
	/////////////////////////////////
	function getWeatherDescription(data, index)
	{
		if (data.rain[index] > 1)
			return ("Rainy");
		else if (data.cloud_cover[index] > 50)
			return ("Cloudy");
		return ("Sunny");
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
	/////////////////////////////////
	//// Getting infos for components
	/////////////////////////////////
	function CurrentlyTabCreation()
	{
		// Error
		if (currData.indexOf("\n") == -1)
			return (<TabWrapper Component={() => <Text style={styles.tabText} selectable={false}>{currData}</Text>}/>);
		// Variables
		const words = currData.split("\n");
		const city = getCity(words);
		const cityName = city[0];
		const cityInfo = city[1];
		const temperature = words[3];
		const condition = words[4];
		const conditionIcon = getConditionIcon(condition, 40, "#3FABDA");
		const wind = words[5];
		// JSX
		return (<CurrentlyTab cityName={cityName} cityInfo={cityInfo} temperature={temperature} condition={condition} conditionIcon={conditionIcon} wind={wind}/>);
	}
	function TodayTabData()
	{
		// Error
		if (todayData.indexOf("\n") == -1)
			return (<TabWrapper Component={() => <Text style={styles.tabText} selectable={false}>{todayData}</Text>}/>);
		// Variables
		const split = todayData.split("\n");
		const city = getCity(currData.split("\n"));
		const cityName = city[0];
		const cityInfo = city[1];
		const temperatures = getTemperatures(split, 27, 6, "°", 6, 0);
		const winds = getWinds(split);
		const conditions = getConditionsIcons(split, "#3FABDA");
		const data = {
			legend: ["Temperatures"],
			labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
			datasets: [{data: [...temperatures]}],
		};
		const width = Dimensions.get("window").width
		const height = Dimensions.get("window").height / 4;
		for (i = 0; i < 24; i++)
			temperatures[i] = temperatures[i] + "°C";
		// JSX
		return (<TodayTab cityName={cityName} cityInfo={cityInfo} width={width} height={height} data={data} conditions={conditions} temperatures={temperatures} winds={winds}/>);
	}
	function WeeklyTabData()
	{
		// Error
		if (weeklyData.indexOf("\n") == -1)
			return (<TabWrapper Component={() => <Text style={styles.tabText} selectable={false}>{weeklyData}</Text>}/>);
		// Variables
		const city = getCity(currData.split("\n"));
		const cityName = city[0];
		const cityInfo = city[1];
		const temp = getTemperatures(weeklyData.split("\n"), 10, 11, "°", 11 + 6, 2);
		let lowTemp = [];
		let highTemp = [];
		for (let i = 0; i < 6; i++)
			lowTemp.push(temp[i].substring(0, temp[i].indexOf("°")));
		for (let i = 0; i < 6; i++)
			highTemp.push(temp[i].substring(temp[i].indexOf(" ") + 1, temp[i].length - 2));
		const dates = getDates(weeklyData.split("\n"));
		const conditions = getConditionsIcons(todayData.split("\n"), "white");
		const data = {
			legend: ["Min temperatures", "Max temperatures"],
			labels: [...dates],
			datasets: [
				{data: [...lowTemp], color: () => "#68B6F3"},
				{data: [...highTemp], color: () => "#E47576"}
			],
		};
		const width = Dimensions.get("window").width
		const height = Dimensions.get("window").height / 4;
		for (i = 0; i < 24; i++)
		{
			lowTemp[i] = lowTemp[i] + "°C";
			highTemp[i] = highTemp[i] + "°C";
		}
		// JSX
		return (<WeeklyTab cityName={cityName} cityInfo={cityInfo} width={width} height={height} data={data} dates={dates} conditions={conditions} lowTemp={lowTemp} highTemp={highTemp}/>);
	}
	/////////////////////////////////
	//// Utils for tab infos
	/////////////////////////////////
	function getCity(words)
	{
		let res = [];
		let cityName = words[0];
		let cityInfo = " ";

		if (words[1] !== "undefined" && words[1] !== "")
			cityInfo = words[1] + ", ";
		if (words[2] !== "")
			cityInfo = cityInfo + words[2];
		res.push(cityName);
		res.push(cityInfo);
		return (res);
	}
	function getDates(data)
	{
		let res = [];
		for (let i = 3; i < 10; i++)
			res.push(data[i].substring(5, data[i].indexOf(" ")));
		for (let i = 0; i < 6; i++)
			res[i] = res[i].replace("-", "/");
		return (res);
	}
	function getTemperatures(data, maxIteration, indexStart, indexOfStr, indexOfEnd, plusIndex)
	{
		let res = [];

		for (let i = 3; i < maxIteration - 1; i++)
    {
      let str = data[i].substring(indexStart, data[i].indexOf(indexOfStr, indexOfEnd) + plusIndex);
	  	res.push(str);
    }
		return (res);
	}
	function getConditionIcon(condition, size, color)
	{
		if (condition === "Rainy")
			return (<Feather name="cloud-rain" size={size} color={color}/>);
		else if (condition === "Cloudy")
			return (<Feather name="cloud" size={size} color={color}/>);
		else
			return (<Feather name="sun" size={size} color={color}/>);
	}
	function getConditionsIcons(data, color)
	{
		let res = [];
		let index = 0;
		let condition;

		for (let i = 3; i < 27; i++)
		{
			index = data[i].indexOf("°C") + 3;
			condition = data[i].substring(index, data[i].indexOf(" ", index));
			res.push(getConditionIcon(condition, 22, color));
		}
		return (res);
	}
	function getWinds(data)
	{
		let res = [];
		let firstIndex = 0;
		let secondIndex = 0;

		for (let i = 3; i < 27; i++)
		{
			firstIndex = data[i].indexOf("°C", 0) + 3;
			secondIndex = data[i].indexOf(" ", firstIndex) + 1;
			res.push(data[i].substring(secondIndex, data[i].length));
		}
		return (res);
	}
	/////////////////////////////////
	//// Components
	/////////////////////////////////
	const tabs = [
		{name: "Currently", component: CurrentlyTabCreation},
		{name: "Today", component: TodayTabData},
		{name: "Weekly", component: WeeklyTabData}
	];
	const CurrentlyTab = ({...props}) => (
		<View style={styles.tab}>
			<View style={styles.tabBlock}>
				<Text style={[styles.tabText, styles.tabCity]}>{props.cityName}</Text>
				<Text style={styles.tabText}>{props.cityInfo}</Text>
			</View>
			<View>
				<View style={styles.tabBlock}>
					<Text style={[styles.tabText, styles.tabTemp]} selectable={false}>{props.temperature}</Text>
				</View>
				<View style={styles.tabBlock}>
					<Text style={styles.tabText} selectable={false}>{props.condition}</Text>
					<View>{props.conditionIcon}</View>
				</View>
			</View>
			<View style={styles.tabBlock}>
				<Feather name="wind" size={20} color="#3FABDA"/>
				<Text style={styles.tabText} selectable={false}>{props.wind}</Text>
			</View>
		</View>
	);
	const TodayTab = ({cityName, cityInfo, width, height, data, conditions, temperatures, winds}) => (
		<View style={styles.tab}>
			<View style={styles.tabBlock}>
				<Text style={[styles.tabText, styles.tabCity]}>{cityName}</Text>
				<Text style={styles.tabText}>{cityInfo}</Text>
			</View>
			<View>
				<Text style={[styles.tabText, {padding: 8}]}>Today Temperatures</Text>
				<LineChart style={{borderRadius: 16, padding: 0}} width={width} height={height} data={data} yAxisSuffix="°C" fromZero={true} withVerticalLines={false}
					chartConfig={{
						backgroundGradientFrom: "#FFA500",
						backgroundGradientFromOpacity: 0.2,
						backgroundGradientTo: "#FFA500",
						backgroundGradientToOpacity: 0.2,
						decimalPlaces: 0,
						color: () => "white",
						labelColor: () => "white",
						propsForDots: {r: "4", stroke: "orange", strokeWidth: "2"},
						propsForBackgroundLines: {},
					}}
				/>
			</View>
			<ScrollView style={styles.scrollList} horizontal={true} nestedScrollEnabled={true} contentContainerStyle={{flexGrow: 1}}>
				<HourlyWeatherItem hour={"00:00"} condition={conditions[0]} temperature={temperatures[0]} wind={winds[0]}/>
				<HourlyWeatherItem hour={"01:00"} condition={conditions[1]} temperature={temperatures[1]} wind={winds[1]}/>
				<HourlyWeatherItem hour={"02:00"} condition={conditions[2]} temperature={temperatures[2]} wind={winds[2]}/>
				<HourlyWeatherItem hour={"03:00"} condition={conditions[3]} temperature={temperatures[3]} wind={winds[3]}/>
				<HourlyWeatherItem hour={"04:00"} condition={conditions[4]} temperature={temperatures[4]} wind={winds[4]}/>
				<HourlyWeatherItem hour={"05:00"} condition={conditions[5]} temperature={temperatures[5]} wind={winds[5]}/>
				<HourlyWeatherItem hour={"06:00"} condition={conditions[6]} temperature={temperatures[6]} wind={winds[6]}/>
				<HourlyWeatherItem hour={"07:00"} condition={conditions[7]} temperature={temperatures[7]} wind={winds[7]}/>
				<HourlyWeatherItem hour={"08:00"} condition={conditions[8]} temperature={temperatures[8]} wind={winds[8]}/>
				<HourlyWeatherItem hour={"09:00"} condition={conditions[9]} temperature={temperatures[9]} wind={winds[9]}/>
				<HourlyWeatherItem hour={"10:00"} condition={conditions[10]} temperature={temperatures[10]} wind={winds[10]}/>
				<HourlyWeatherItem hour={"11:00"} condition={conditions[11]} temperature={temperatures[11]} wind={winds[11]}/>
				<HourlyWeatherItem hour={"12:00"} condition={conditions[12]} temperature={temperatures[12]} wind={winds[12]}/>
				<HourlyWeatherItem hour={"13:00"} condition={conditions[13]} temperature={temperatures[13]} wind={winds[13]}/>
				<HourlyWeatherItem hour={"14:00"} condition={conditions[14]} temperature={temperatures[14]} wind={winds[14]}/>
				<HourlyWeatherItem hour={"15:00"} condition={conditions[15]} temperature={temperatures[15]} wind={winds[15]}/>
				<HourlyWeatherItem hour={"16:00"} condition={conditions[16]} temperature={temperatures[16]} wind={winds[16]}/>
				<HourlyWeatherItem hour={"17:00"} condition={conditions[17]} temperature={temperatures[17]} wind={winds[17]}/>
				<HourlyWeatherItem hour={"18:00"} condition={conditions[18]} temperature={temperatures[18]} wind={winds[18]}/>
				<HourlyWeatherItem hour={"19:00"} condition={conditions[19]} temperature={temperatures[19]} wind={winds[19]}/>
				<HourlyWeatherItem hour={"20:00"} condition={conditions[20]} temperature={temperatures[20]} wind={winds[20]}/>
				<HourlyWeatherItem hour={"21:00"} condition={conditions[21]} temperature={temperatures[21]} wind={winds[21]}/>
				<HourlyWeatherItem hour={"22:00"} condition={conditions[22]} temperature={temperatures[22]} wind={winds[22]}/>
				<HourlyWeatherItem hour={"23:00"} condition={conditions[23]} temperature={temperatures[23]} wind={winds[23]}/>
			</ScrollView>
		</View>
	);
	const WeeklyTab = ({cityName, cityInfo, data, width, height, dates, conditions, lowTemp, highTemp}) => (
			<View style={styles.tab}>
			<View style={styles.tabBlock}>
				<Text style={[styles.tabText, styles.tabCity]}>{cityName}</Text>
				<Text style={styles.tabText}>{cityInfo}</Text>
			</View>
			<View>
				<Text style={[styles.tabText, {padding: 8}]}>Weekly Temperatures</Text>
				<LineChart
					data={data}
					width={width}
					height={height}
					yAxisSuffix="°C"
					fromZero={true}
					withVerticalLines={false}
					style={{borderRadius: 16, padding: 0}}
					chartConfig={{
						backgroundGradientFrom: "#ffa500",
						backgroundGradientFromOpacity: 0.2,
						backgroundGradientTo: "#ffa500",
						backgroundGradientToOpacity: 0.2,
						decimalPlaces: 0,
						color: () => "white",
						labelColor: () => "white",
						propsForDots: {r: "4", stroke: "white", strokeWidth: "2"},
						propsForBackgroundLines: {},
					}}
				/>
			</View>
			<ScrollView style={styles.scrollList} horizontal={true} nestedScrollEnabled={true} contentContainerStyle={{flexGrow: 1}}>
				<DailyWeatherItem date={dates[0]} condition={conditions[0]} lowTemperature={lowTemp[0]} highTemperature={highTemp[0]}/>
				<DailyWeatherItem date={dates[1]} condition={conditions[1]} lowTemperature={lowTemp[1]} highTemperature={highTemp[1]}/>
				<DailyWeatherItem date={dates[2]} condition={conditions[2]} lowTemperature={lowTemp[2]} highTemperature={highTemp[2]}/>
				<DailyWeatherItem date={dates[3]} condition={conditions[3]} lowTemperature={lowTemp[3]} highTemperature={highTemp[3]}/>
				<DailyWeatherItem date={dates[4]} condition={conditions[4]} lowTemperature={lowTemp[4]} highTemperature={highTemp[4]}/>
				<DailyWeatherItem date={dates[5]} condition={conditions[5]} lowTemperature={lowTemp[5]} highTemperature={highTemp[5]}/>
				<DailyWeatherItem date={dates[6]} condition={conditions[6]} lowTemperature={lowTemp[6]} highTemperature={highTemp[6]}/>
			</ScrollView>
		</View>
	);
	const HourlyWeatherItem = ({hour, condition, temperature, wind}) => (
		<View style={styles.scrollListItem}>
			<Text style={styles.tabText} selectable={false}>{hour}</Text>
			{condition}
			<Text style={[styles.tabTemp, styles.scrollListTemp]} selectable={false}>{temperature}</Text>
			<View style={styles.scrollListWind}>
				<Feather name="wind" size={15} color="white"/>
				<Text style={styles.tabText} selectable={false}>{wind}</Text>
			</View>
		</View>
	);
	const DailyWeatherItem = ({date, condition, highTemperature, lowTemperature}) => (
		<View style={styles.scrollListItem}>
			<Text style={styles.tabText} selectable={false}>{date}</Text>
			{condition}
			<View style={{flexDirection: "row", gap: 2}}>
				<Text style={[styles.tabTemp, styles.scrollListTemp, {color: "#E47576"}]} selectable={false}>{highTemperature}</Text>
				<Text style={{color: "#E47576"}}>max</Text>
			</View>
			<View style={{flexDirection: "row", gap: 2}}>
				<Text style={[styles.tabTemp, styles.scrollListTemp, {color: "#68B6F3"}]} selectable={false}>{lowTemperature}</Text>
				<Text style={{color: "#68B6F3"}}>min</Text>
			</View>
		</View>
	);
	const TabWrapper = ({Component}) => (
		<View style={styles.tab}>
			<Component/>
		</View>
	);
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<SafeAreaProvider>
			<ImageBackground style={styles.background} source={require("./assets/background.png")}>
				<Appbar.Header style={styles.appbar}>
					<Entypo style={styles.headerIcon} name="magnifying-glass" size={24} color="orange"/>
					<TextInput style={styles.input} label="Search location..." value={searchValue} theme={{colors: { text: "white", primary: "white", placeholder: "#9e9e9e"}}}
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
							else if (searchValue.length > 2 && suggestionList.length > 0)
								fetchWeather(suggestionList[0],suggestionList[0].latitude, suggestionList[0].longitude);
						}}
					/>
					<Pressable style={styles.pressable} onPress={() => {
						setGetLocation(true);
						setSuggestionList([]);
					}}>
						<FontAwesome style={styles.pressableIcon} name="location-arrow" size={24} color="white"/>
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
								<Text style={styles.listItemText}>{item.name}, {item.admin1}, {item.country}</Text>
							</Pressable>
						);
					}}
				/>
				<NavigationContainer onStateChange={() => setSuggestionList([])}>
					<Tab.Navigator initalRouteName="Currently" tabBarPosition="bottom" screenOptions={({route}) => ({
							tabBarIcon: ({focused, color}) => {
								color = focused ? "white" : "#9E9E9E";
								if (route.name === "Currently")
									return (<Ionicons name="settings" size={24} color={color}/>);
								else if (route.name === "Today")
									return (<MaterialCommunityIcons name="calendar-today" size={24} color={color}/>);
								else if (route.name === "Weekly")
									return (<MaterialCommunityIcons name="calendar-week" size={24} color={color}/>);
							},
							onTabPress: () => setSuggestionList([]),
							tabBarStyle: { backgroundColor: 'transparent' },
							tabBarShowIcon: true,
							tabBarActiveTintColor: "white",
							tabBarInactiveTintColor: "#9E9E9E",
							tabBarIndicatorStyle: { backgroundColor: "orange", height: 5 },
							sceneStyle: {backgroundColor: "transparent"},
							swipeEnabled: true
						})}
					>
						{tabs.map(({name, component}) => (<Tab.Screen name={name} component={() => <TabWrapper Component={component}/>}/>))}
					</Tab.Navigator>
				</NavigationContainer>
			</ImageBackground>
		</SafeAreaProvider>
	);
}

/////////////////////////////////
//// Styles
/////////////////////////////////
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
	scrollList: {
		flexGrow: 0,
		height: Dimensions.get("window").height / 4,
		backgroundColor: "rgba(255, 165, 0, 0.2)",
	},
	scrollListItem: {
		justifyContent: "space-around",
		alignItems: "center",
		padding: 15,
		width: 100
	},
	scrollListTemp: {
		fontSize: 16
	},
	scrollListWind: {
		flexDirection: "row",
		gap: 10
	},
	background: {
		flex: 1,
		height: "100%",
		width: "100%",
		resizeMode: "cover"
	}
});
