/////////////////////////////////
//// Imports
/////////////////////////////////
import { View, Text, Pressable, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Authentification
import { removeIsLogged } from './Auth.js'

/////////////////////////////////
//// Application
/////////////////////////////////
export default function Profile() {
	const navigation = useNavigation();
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<SafeAreaProvider style={{flex: 1, width: "100%", height: "100%", alignItems: "center"}}>
			<SafeAreaView style={{flex: 1, width: "100%", height: "100%", justifyContent: "space-around", alignContent: "center", paddingHorizontal: 60, paddingVertical: 50}}>
				<Text style={{fontSize: 50, fontWeight: 40, textAlign: "center"}}>PROFILE</Text>
				<Pressable style={{borderColor: "black", borderWidth: 1, borderRadius: 15}} onPress={() => navigation.navigate("Home")}>
					<Text style={{textAlign: "center"}}>Go Home</Text>
				</Pressable>
				<Pressable style={{width: "100%", borderColor: "black", borderWidth: 1, borderRadius: 15}} onPress={() => removeIsLogged()}>
					<Text style={{textAlign: "center"}}>Clear storage</Text>
				</Pressable>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/////////////////////////////////
//// Styles
/////////////////////////////////
// const styles = StyleSheet.create({

// });
