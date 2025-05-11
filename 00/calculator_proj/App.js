import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomStatusBar = ({ backgroundColor, barStyle = "dark-content"}) => {
	const insets = useSafeAreaInsets();

	return (
		<View style={{height: insets.top, backgroundColor }}>
			<StatusBar animated={true} backgroundColor={backgroundColor} barStyle={barStyle}/>
		</View>
	)
};

function HomeScreen()
{
	let blank = true;
	const [input, setInput] = useState("0");
	const [output, setOutput] = useState("0");

	function addInput(touch)
	{
		if (input === "0" && blank === true)
		{
			blank = false;
			setInput(touch);
		}
		else
			setInput(input + touch);
	}
	function deleteInput()
	{
		if (input.length > 1)
			setInput(input.substring(0, input.length - 1));
		else
		{
			blank = true;
			setInput("0");
		}
	}
	function calc()
	{
		try
		{
			let tmp = new String(input);

			tmp = tmp.replace('x', "*");
			tmp = eval(tmp);
			if (tmp === Infinity)
				throw (EvalError(""));
			setOutput(tmp);
		}
		catch (e)
		{
			console.error(e);
			setOutput("ERR");
		}
	}
	function	parse(str)
	{
		function	isToken(c)
		{
			if (c === "." || c === "+" || c === "-" || c === "x" || c === "/")
				return (true);
			return (false);
		}
		function	isMinus(c)
		{
			if (c === "-")
				return (true);
			return (false);
		}

		let i = 1;
		if ((isToken(str[0]) && !isMinus(str[0])) || isToken(str[str.length - 1]))
			return (false);
		while (i < str.length)
		{
			if (isMinus(str[i]) && isToken(str[i + 1]) || isToken(str[i]) && !isMinus(str[i]) && isToken(str[i + 1]) && !isMinus(str[i + 1]))
				return (false);
			i++;
		}
		return (true);
	}

	return (
		<SafeAreaProvider style={styles.wrapper}>
			<CustomStatusBar backgroundColor="#495e67"/>
			<View style={styles.screen}>
				<Text numberOfLines={1} ellipsizeMode="head" style={styles.screenText}>{input}</Text>
				<Text numberOfLines={2} ellipsizeMode="tail" style={styles.screenText}>{output}</Text>
			</View>
			<View style={styles.keyboard}>
				<Pressable onPress={() => addInput("7")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>7</Text>
				</Pressable>
				<Pressable onPress={() => addInput("8")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>8</Text>
				</Pressable>
				<Pressable onPress={() => addInput("9")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>9</Text>
				</Pressable>
				<Pressable onPress={() => deleteInput("C")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyRed]}>C</Text>
				</Pressable>
				<Pressable onPress={() => { setInput("0"); setOutput("0") }} style={styles.key}>
					<Text style={[styles.keyText, styles.keyRed]}>AC</Text>
				</Pressable>
				<Pressable onPress={() => addInput("4")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>4</Text>
				</Pressable>
				<Pressable onPress={() => addInput("5")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>5</Text>
				</Pressable>
				<Pressable onPress={() => addInput("6")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>6</Text>
				</Pressable>
				<Pressable onPress={() => addInput("+")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>+</Text>
				</Pressable>
				<Pressable onPress={() => addInput("-")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>-</Text>
				</Pressable>
				<Pressable onPress={() => addInput("1")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>1</Text>
				</Pressable>
				<Pressable onPress={() => addInput("2")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>2</Text>
				</Pressable>
				<Pressable onPress={() => addInput("3")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>3</Text>
				</Pressable>
				<Pressable onPress={() => addInput("x")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>x</Text>
				</Pressable>
				<Pressable onPress={() => addInput("/")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>/</Text>
				</Pressable>
				<Pressable onPress={() => addInput("0")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>0</Text>
				</Pressable>
				<Pressable onPress={() => addInput(".")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>.</Text>
				</Pressable>
				<Pressable onPress={() => addInput("00")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>00</Text>
				</Pressable>
				<Pressable onPress={() => calc()} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>=</Text>
				</Pressable>
				<Pressable style={styles.key}>
					<Text style={styles.keyText}></Text>
				</Pressable>
			</View>
		</SafeAreaProvider>
	);
}

const Stack = createNativeStackNavigator();
export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerTitleAlign: "center", headerStyle: {backgroundColor: "#617d8a"}, headerTintColor: "#fff", headerTitleStyle: { fontWeight: 'bold', },}}>
				<Stack.Screen name="Calculator" component={HomeScreen}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: "white"
	},
	screen: {
		flex: 1,
		backgroundColor: "#37474e",
		overflow: "hidden",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	},
	screenText: {
		padding: "2%",
		color: "#607b88",
		fontSize: "18px",
		textAlign: "right",
		whiteSpace: "nowrap"
	},
	keyboard: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
		height: "45%",
		backgroundColor: "#617d8a"
	},
	key: {
		width: "20%",
		height: "25%",
		justifyContent: "center",
		alignItems: "center"
	},
	keyText: {
		textAlign: "center",
		userSelect: "none"
	},
	keyBlack: { color: "black" },
	keyRed: { color: "red" },
	keyWhite: { color: "white" }
});
