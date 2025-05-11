/////////////////////////////////
//// Local Storage
/////////////////////////////////
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GOOGLE_WEB_CLIENT_ID} from '@env'

export const setInLocalStorage = async (key, value) => {
	try { await AsyncStorage.setItem(key, JSON.stringify(value)) }
	catch (error) { console.error("Failed to set the key", error) }
}

export const getInLocalStorage = async (key) => {
	try
	{
		const value = await AsyncStorage.getItem(key);
		if (value !== null)
			return (JSON.parse(value));
		return (false);
	}
	catch (error)
	{
		console.error("Failed to retrieve the key", error);
		return (false);
	}
}

export const removeInLocalStorage = async (key) => {
	try { await AsyncStorage.removeItem(key) }
	catch(error) { console.error("Failed to remove the key", error) }
}

/////////////////////////////////
//// Firebase
/////////////////////////////////
import { useEffect } from "react";
import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, query, orderByChild, remove } from "firebase/database";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET,
		FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID} from '@env'

const firebaseConfig = {
	apiKey: `${FIREBASE_API_KEY}`,
	authDomain: `${FIREBASE_AUTH_DOMAIN}`,
	projectId: `${FIREBASE_PROJECT_ID}`,
	storageBucket: `${FIREBASE_STORAGE_BUCKET}`,
	messagingSenderId: `${FIREBASE_MESSAGING_SENDER_ID}`,
	appId: `${FIREBASE_APP_ID}`,
	measurementId: `${FIREBASE_MEASUREMENT_ID}`
};

GoogleSignin.configure({
	webClientId: `${GOOGLE_WEB_CLIENT_ID}`,
	scopes: ['https://www.googleapis.com/auth/drive.readonly'],
	offlineAccess: true,
});

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDatabase = getDatabase(firebaseApp);
let firebaseAuth;
if (Platform.OS === "web")
	firebaseAuth = getAuth(firebaseApp);
else
	firebaseAuth = initializeAuth(firebaseApp, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async (navigation) => {
	try
	{
		await GoogleSignin.hasPlayServices();
		const data = await GoogleSignin.signIn();
		setInLocalStorage("isLogged", true);
		setInLocalStorage("data", data.user);
		navigation.navigate("Profile");
	}
	catch (error) { console.error(error) }
};

export const signInWithGoogleWeb = async (navigation) => {
	try
	{
		const data = await signInWithPopup(firebaseAuth, googleProvider);
		setInLocalStorage("isLogged", true);
		setInLocalStorage("data", data.user);
		navigation.navigate("Profile");
	}
	catch (error) { console.error(error); }
};

export const signInWithGitHub = async (navigation) => {
	try
	{
		const data = await signInWithPopup(firebaseAuth, githubProvider);
		setInLocalStorage("isLogged", true);
		setInLocalStorage("data", data.user);
		navigation.navigate("Profile");
	}
	catch (error) { console.error(error); }
}

export const addToDatabase = (path, data) => {
	if (path !== null)
		set(ref(firebaseDatabase, `notes/${path}`), data);
}

export const getFromDatabase = async (uid) => {
	try
	{

		const notesRef = ref(firebaseDatabase, `notes/${uid}`);
		const notesQuery = query(notesRef, orderByChild("date"));
		const snapshot = await get(notesQuery);
		if (snapshot.exists())
		{
			const data = snapshot.val();
			const sortedData = Object.entries(data).sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
			for (let i = 0; i < sortedData.length; i++)
			{
				date = new Date(sortedData[i][1].date);
				sortedData[i][1].date = date.getDate() + " " + date.toLocaleString("en-US", { month: "short" }) + " " + date.getFullYear();
			}
			return (sortedData);
		}
		else
			return ([]);
	}
	catch (error) { console.error("Error fetching data: ", error); }
};

export const removeFromDatabase = (path) => {
	if (path !== null)
		remove(ref(firebaseDatabase, `notes/${path}`));
}

export { firebaseApp, firebaseDatabase };
