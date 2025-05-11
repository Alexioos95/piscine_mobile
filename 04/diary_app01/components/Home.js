/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import { useState, useEffect } from 'react';
import { Text, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Authentification
import { getInLocalStorage } from './Auth.js'
// Navigation
import { useNavigation } from '@react-navigation/native';

/////////////////////////////////
//// Application
/////////////////////////////////
export default function Home() {
	const navigation = useNavigation();
	const [logState, setLogState] = useState(false);
	useEffect(() => {
		const updateLogState = async () => {
			try
			{
				const value = await getInLocalStorage("isLogged");
				if (value !== null)
					setLogState(JSON.parse(value));
				else
					setLogState(false);
			}
			catch (error) { console.error(error) }
		};
		updateLogState();
	}, []);
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<SafeAreaProvider style={styles.container}>
			<SafeAreaView style={styles.container}>
				<ImageBackground style={styles.background} source={require("../assets/background.png")}>
					<Text style={styles.title}>Welcome to your Diary</Text>
					<Pressable style={styles.button} onPress={() => {
						if (logState === true)
							navigation.navigate("Profile");
						else
							navigation.navigate("Login");
					}}>
						<Text style={styles.buttonText}>Login</Text>
					</Pressable>
				</ImageBackground>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/////////////////////////////////
//// Styles
/////////////////////////////////
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	background: {
		height: null,
		width: null,
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		textAlign: "center",
		padding: 15,
		gap: 50
	},
	title: {
		fontSize: 40,
		fontWeight: 800,
		textAlign: "center",
		flexWrap: "wrap",
		width: "80%"
	},
	button: {
		alignItems: "center",
		width: "20%",
		backgroundColor: "#4DAE56",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5
	},
	buttonText: {
		color: "white",
		fontSize: 18
	}
});
