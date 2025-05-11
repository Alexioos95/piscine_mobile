/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Authentification
import { signInWithGoogle, signInWithGoogleWeb, signInWithGitHub } from './Auth.js'

/////////////////////////////////
//// Application
/////////////////////////////////
export default function Login() {
	const navigation = useNavigation();
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<SafeAreaProvider style={styles.container}>
			<SafeAreaView style={styles.container}>
				<FontAwesome6 name="database" size={50} color="#5473F7"/>
				<Text style={[styles.text, styles.title]}>Welcome</Text>
				<Text style={styles.text}>Log in to continue to Diary_app</Text>
				<View style={styles.pressableContainer}>
					<Pressable style={styles.pressable} onPress={() => {
						if (Platform.OS === "web")
							signInWithGoogleWeb(navigation);
						else
							signInWithGoogle(navigation);
					}}>
						<FontAwesome6 name="google" size={15} color="white"/>
						<Text style={styles.text}>Continue with Google</Text>
					</Pressable>
					<Pressable style={styles.pressable} onPress={() => signInWithGitHub(navigation)}>
						<FontAwesome6 name="github" size={15} color="white"/>
						<Text style={styles.text}>Continue with GitHub</Text>
					</Pressable>
				</View>
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
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		backgroundColor: "black",
		gap: 25,
		padding: 20
	},
	text: {
		color: "white"
	},
	title: {
		fontSize: 25,
		fontWeight: 700
	},
	pressableContainer: {
		width: "100%",
		gap: 10
	},
	pressable: {
		width: "100%",
		flexDirection: "row",
		gap: 10,
		padding: 10,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5
	}
});
