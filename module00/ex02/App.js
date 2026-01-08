import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
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

function HomeScreen() {
	return (
		<SafeAreaProvider style={styles.wrapper}>
			<CustomStatusBar backgroundColor="#495e67"/>
			<View style={styles.screen}>
				<Text style={styles.screenText}>0</Text>
				<Text style={styles.screenText}>0</Text>
			</View>
			<View style={styles.keyboard}>
				<Pressable onPress={() => console.debug("Button pressed :7")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>7</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :8")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>8</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :9")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>9</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :C")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyRed]}>C</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :AC")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyRed]}>AC</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :4")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>4</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :5")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>5</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :6")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>6</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :+")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>+</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :-")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>-</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :1")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>1</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :2")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>2</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :3")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>3</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :x")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>x</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :/")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyWhite]}>/</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :0")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>0</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :.")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>.</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :00")} style={styles.key}>
					<Text style={[styles.keyText, styles.keyBlack]}>00</Text>
				</Pressable>
				<Pressable onPress={() => console.debug("Button pressed :=")} style={styles.key}>
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
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	},
	screenText: {
		padding: "2%",
		color: "#607b88",
		textAlign: "right",
		fontSize: "2rem"
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
	textAlign: "center"
  },
	keyBlack: { color: "black" },
	keyRed: { color: "red" },
	keyWhite: { color: "white" }
});
