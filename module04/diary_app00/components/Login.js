/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import React from 'react';
import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// Authentification
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import "firebase/compat/auth";
import { setIsLogged  } from './Auth.js'
// Navigation
import { useNavigation } from '@react-navigation/native';
// Env
import {GOOGLE_WEB_CLIENT_ID, FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID} from '@env'

/////////////////////////////////
//// Application
/////////////////////////////////
export default function Login() {
	const navigation = useNavigation();
	/////////////////////////////////
	//// Firebase
	/////////////////////////////////
	const firebaseConfig = {
		apiKey: `${FIREBASE_API_KEY}`,
		authDomain: `${FIREBASE_AUTH_DOMAIN}`,
		projectId: `${FIREBASE_PROJECT_ID}`,
		// databaseURL: `${FIREBASE_DATABASE_URL}`,
		storageBucket: `${FIREBASE_STORAGE_BUCKET}`,
		messagingSenderId: `${FIREBASE_MESSAGING_SENDER_ID}`,
		appId: `${FIREBASE_APP_ID}`,
		measurementId: `${FIREBASE_MEASUREMENT_ID}`
	};
	if (!firebase.apps.length)
		firebase.initializeApp(firebaseConfig);
	const firebaseAuth = firebase.auth();
	const googleProvider = new firebase.auth.GoogleAuthProvider();
	const githubProvider = new firebase.auth.GithubAuthProvider();
	const firebaseApp = initializeApp(firebaseConfig);
	let auth;
	if (Platform.OS === "web")
		auth = getAuth(firebaseApp);
	else
		auth = initializeAuth(firebaseApp, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
	///////////////////////////////////
	//// Google and GitHub Sign In
	///////////////////////////////////
	useEffect(()=>{
		GoogleSignin.configure({
			webClientId: `${GOOGLE_WEB_CLIENT_ID}`,
			scopes: ['https://www.googleapis.com/auth/drive.readonly'],
			offlineAccess: true,
		});
	}, []);
	async function signInWithGoogle()
	{
		try
		{
			await GoogleSignin.hasPlayServices();
			const data = await GoogleSignin.signIn();
			console.log(data);
			setIsLogged(true);
			navigation.navigate("Profile");
		}
		catch (error) { console.error(error) }
	};
	async function signInWithGoogleWeb()
	{
		try
		{
			const data = await firebaseAuth.signInWithPopup(googleProvider);
			console.log(data);
			setIsLogged(true);
			navigation.navigate("Profile");
		}
		catch (error) { console.error(error); }
	};
	async function signInWithGitHub()
	{
		try
		{
			const data = await firebaseAuth.signInWithPopup(githubProvider);
			console.log(data);
			setIsLogged(true);
			navigation.navigate("Profile");
		}
		catch (error) { console.error(error); }
	}
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
							signInWithGoogleWeb();
						else
							signInWithGoogle();
					}}>
						<FontAwesome6 name="google" size={15} color="white"/>
						<Text style={styles.text}>Continue with Google</Text>
					</Pressable>
					<Pressable style={styles.pressable} onPress={() => {signInWithGitHub()}}>
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
