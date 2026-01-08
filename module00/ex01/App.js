import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Platform } from 'react-native';

export default function App() {
	const [string, setString] = useState("A   simple text");

	function changeText()
	{
		if (string === "A   simple text")
			setString("Hello word!");
		else
			setString("A   simple text");
	}

	return (
		<SafeAreaView style={styles.wrapper}>
			<View style={styles.container}>
				<Text style={styles.text}>{string}</Text>
				<Pressable onPress={changeText} style={styles.button}>
					<Text style={styles.buttonText}>Click me</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: "white"
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
	},
	text: {
		backgroundColor: "#646414",
		color: "white",
		fontSize: "25px",
		padding: "5px",
		borderRadius: "5px",
	},
	button: {
		justifyContent: "center",
		marginTop: "10px",
		backgroundColor: "#e0e0dd",
		color: "#646414",
		borderRadius: "100px",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	buttonText: {
		fontSize: "18px",
		color: "#646414",
		textAlign: "center",
		padding: "5px",
		userSelect: "none"
	}
});
