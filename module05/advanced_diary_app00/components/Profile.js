/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import { useState, useEffect } from 'react';
import { Modal, View, ScrollView, Text, TextInput, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Select
import RNPickerSelect from 'react-native-picker-select';
// Icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Authentification
import { getInLocalStorage, removeInLocalStorage, addToDatabase, getFromDatabase, removeFromDatabase } from './Auth.js'
import { v4 as uuidv4 } from 'uuid';
/////////////////////////////////
//// Application
/////////////////////////////////
export default function Profile() {
	/////////////////////////////////
	//// Variables
	/////////////////////////////////
	const navigation = useNavigation();
	const iconColors = {
		'emoticon-happy-outline': "blue",
		'emoticon-neutral-outline': 'orange',
		'emoticon-frown-outline': 'red',
		'emoticon-sick': 'purple'
	};
	const [percentFeelings, setPercentFeelings] = useState([0, 0, 0, 0]);
	const [arrayEntries, setArrayEntries] = useState([]);
	const [entryVisible, setEntryVisible] = useState(false);
	const [entryVisibleData, setEntryVisibleData] = useState({
		uuid: null,
		date: null,
		icon: null,
		text: ""
	});
	const [newEntryVisible, setNewEntryVisible] = useState(false);
	const [newEntryIcon, setNewEntryIcon] = useState("emoticon-happy-outline");
	const [newEntryTitle, setNewEntryTitle] = useState("");
	const [newEntryText, setNewEntryText] = useState("");
	const [dataUser, setDataUser] = useState(null);
	/////////////////////////////////
	//// User Datas
	/////////////////////////////////
	useEffect(() => {
		const getUID = async () => {
			try
			{
				const data = await getInLocalStorage("data");
				setDataUser(data);
				if (data === null)
					return ;
				const setOfEntries = await getFromDatabase(data.uid);
				setArrayEntries(setOfEntries);
			}
			catch (error) { console.error(error) }
		};
		getUID();
	}, []);

	useEffect(() => {
		calculateFeelings(arrayEntries);
	}, [arrayEntries]);

	async function updateEntries()
	{
		if (dataUser === null)
			return ;
		const array = await getFromDatabase(dataUser.uid);
		setArrayEntries(array);
	}

	function calculateFeelings(array)
	{
		if (array.length > 0)
		{
			let happy = 0;
			let neutral = 0;
			let unhappy = 0;
			let sick = 0;

			for (let i = 0; i < array.length; i++)
			{
				if (array[i][1].icon === "emoticon-happy-outline")
					happy++;
				else if (array[i][1].icon === "emoticon-neutral-outline")
					neutral++;
				else if (array[i][1].icon === "emoticon-frown-outline")
					unhappy++;
				else
					sick++;
			}
			happy = (happy / array.length) * 100;
			neutral = (neutral / array.length) * 100;
			unhappy = (unhappy / array.length) * 100;
			sick = (sick / array.length) * 100;
			setPercentFeelings([happy.toFixed(2), neutral.toFixed(2), unhappy.toFixed(2), sick.toFixed(2)]);
		}
		else
			setPercentFeelings([0, 0, 0, 0])
	}

	function deleteEntry(prevArray, uuid)
	{
		let array = [];
		for (let i = 0; i < prevArray.length; i++)
		{
			if (prevArray[i][0] !== uuid)
				array.push(prevArray[i]);
		}
		setArrayEntries(array);
	}
	/////////////////////////////////
	//// Render
	/////////////////////////////////
	return (
		<SafeAreaProvider style={styles.container}>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<View style={styles.photoWrapper}>
						{dataUser && dataUser.photoURL ? (<Image source={{ uri: dataUser.photoURL }} style={styles.photo}/>) : (<Text>No image available</Text>)}
					</View>
					{dataUser && dataUser.displayName ? (<Text style={styles.text}>{dataUser.displayName}</Text>) : (<Text>Loading</Text>)}
					<Pressable onPress={() => {
						removeInLocalStorage("isLogged");
						navigation.navigate("Home");
					}}>
						<FontAwesome6 name="arrow-right-to-bracket" size={24} color="black"/>
					</Pressable>
				</View>
				<View style={styles.body}>
					<Modal animationType="fade" transparent={true} visible={newEntryVisible} onRequestClose={() => setNewEntryVisible(false)}>
						<Pressable style={styles.modalOverlay} onPress={() => setNewEntryVisible(false)}>
							<Pressable style={styles.modalStop} onPress={() => {}}>
								<View style={styles.modalView}>
									<Text>Add an entry</Text>
									<TextInput style={styles.textInput} placeholder="Title" multiline onChangeText={(value) => {setNewEntryTitle(value)}}></TextInput>
									<RNPickerSelect style={styles.select} placeholder={{ label: "Select an item", value: "" }} value={newEntryIcon} onValueChange={(value) => setNewEntryIcon(value)} items={[
										{ label: "🙂", value: "emoticon-happy-outline", icon: () => <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="blue"/>},
										{ label: "😐", value: "emoticon-neutral-outline", icon: () => <MaterialCommunityIcons name="emoticon-neutral-outline" size={24} color="orange"/>},
										{ label: "🙁", value: "emoticon-frown-outline", icon: () => <MaterialCommunityIcons name="emoticon-frown-outline" size={24} color="red"/>},
										{ label: "😵", value: "emoticon-sick", icon: () => <MaterialCommunityIcons name="emoticon-sick" size={24} color="purple"/>}
									]}/>
									<TextInput style={[styles.textInput, styles.largeTextInput]} placeholder="Text" multiline onChangeText={(value) => setNewEntryText(value)}></TextInput>
									<TouchableOpacity onPress={() => {
										if (newEntryTitle === "" || newEntryText === "" || newEntryIcon === "")
											return ;
										const obj = {
											"date": new Date().toString(),
											"icon": newEntryIcon,
											"text": newEntryText,
											"title": newEntryTitle,
											"usermail": dataUser.email
										};
										const uuid = uuidv4();
										addToDatabase(`${dataUser.uid}/${uuid}`, obj);
										setNewEntryIcon("emoticon-happy-outline");
										setNewEntryText("");
										setNewEntryTitle("");
										setNewEntryVisible(false);
										updateEntries();
									}}>
										<Text style={styles.modalAddButton}>Add</Text>
									</TouchableOpacity>
								</View>
							</Pressable>
						</Pressable>
					</Modal>
					<Modal animationType="fade" transparent={true} visible={entryVisible} onRequestClose={() => setEntryVisible(false)}>
						<Pressable style={styles.modalOverlay} onPress={() => setEntryVisible(false)}>
							<Pressable style={styles.modalStop} onPress={() => {}}>
								<View style={[styles.modalView, styles.modalViewEntryVisible]}>
									<Text style={styles.entryVisibleTitle}>{entryVisibleData.date}</Text>
									<View style={styles.entryVisibleFeeling}>
										<Text style={styles.entryVisibleFeelingText}>My feeling : </Text>
										<MaterialCommunityIcons name={entryVisibleData.icon} size={24} color={iconColors[entryVisibleData.icon]}></MaterialCommunityIcons>
									</View>
									<Text style={styles.entryVisibleText}>{entryVisibleData.text}</Text>
									<TouchableOpacity style={styles.modalDeletePress} onPress={() => {
										setEntryVisible(false);
										removeFromDatabase(`${dataUser.uid}/${entryVisibleData.uuid}`);
										deleteEntry(arrayEntries, entryVisibleData.uuid);
									}}>
										<Text style={styles.modalDeleteButton}>Delete this entry</Text>
									</TouchableOpacity>
								</View>
							</Pressable>
						</Pressable>
					</Modal>
					<View style={[styles.bodyView, styles.latest]}>
						<Text style={styles.text}>Your last diary entries</Text>
						<ScrollView style={styles.scrollViewEntries}>
							{arrayEntries.map((item) => (
								<Pressable key={item[0]} style={styles.entryCard} onPress={() => {
									setEntryVisibleData({
										uuid: item[0],
										date: item[1].date,
										icon: item[1].icon,
										text: item[1].text
									});
									setEntryVisible(true);
								}}>
									<View style={styles.entryCardLeft}>
										<Text>{item[1].date}</Text>
										<MaterialCommunityIcons name={item[1].icon} size={24} color={iconColors[item[1].icon]}></MaterialCommunityIcons>
									</View>
									<View style={styles.entryCardRight}>
										<Text>{item[1].title}</Text>
									</View>
								</Pressable>
							))}
						</ScrollView>
					</View>
					<View style={[styles.bodyView, styles.feelingWrapper]}>
						<Text style={styles.text}>Your feel for your {arrayEntries.length} entries</Text>
						<ScrollView style={styles.scrollView}>
							<View style={styles.feelingView}>
								<MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="blue"/>
								<Text>{percentFeelings[0]}%</Text>
							</View>
							<View style={styles.feelingView}>
								<MaterialCommunityIcons name="emoticon-neutral-outline" size={24} color="orange"/>
								<Text>{percentFeelings[1]}%</Text>
							</View>
							<View style={styles.feelingView}>
								<MaterialCommunityIcons name="emoticon-frown-outline" size={24} color="red"/>
								<Text>{percentFeelings[2]}%</Text>
							</View>
							<View style={styles.feelingView}>
								<MaterialCommunityIcons name="emoticon-sick" size={24} color="purple"/>
								<Text>{percentFeelings[3]}%</Text>
							</View>
						</ScrollView>
					</View>
					<View style={[styles.bodyView]}>
						<Pressable style={styles.newEntryButton} onPress={() => setNewEntryVisible(true)}>
							<Text style={[styles.text, styles.whiteText]}>New diary entry</Text>
						</Pressable>
					</View>
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
		width: "100%",
		height: "100%",
		alignItems: "center"
	},
	header: {
		height: "20%",
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 2,
		borderBottomColor: "rgba(128, 128, 128, 0.5)",
		paddingVertical: 5,
		paddingHorizontal: 20,
		overflow: "hidden"
	},
	photoWrapper: {
		height: "100%",
		aspectRatio: 1,
		borderColor: "green",
		borderWidth: 2,
		borderRadius: "100%",
		overflow: "hidden"
	},
	photo: {
		height: "100%",
		width: "100%",
	},
	text: {
		fontSize: 20,
		fontWeight: 700,
		textAlign: "center"
	},
	whiteText: {
		color: "white"
	},
	body: {
		height: "80%",
		width: "100%",
		justifyContent: "space-between",
		padding: 10,
		gap: 5
	},
	bodyView: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		padding: 5,
		borderRadius: 5,
	},
	scrollView: {
		flex: 1,
		width: "100%",
		gap: 25,
		padding: 10,
		backgroundColor: "white"
	},
	latest: {
		height: "55%",
		gap: 5,
		backgroundColor: "#6CEEB0",
	},
	scrollViewEntries: {
		width: "100%",
		flex: 1,
		padding: 0
	},
	entryCard: {
		width: "100%",
		flexDirection: "row",
		backgroundColor: "white",
		marginBottom: 5,
		padding: 5,
		borderRadius: 3
	},
	entryCardLeft: {
		width: "40%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		gap: 5,
		borderRightWidth: 2,
		borderRightColor: "black"
	},
	entryCardRight: {
		width: "60%",
		justifyContent: "center",
		alignContent: "center",
		textAlign: "center",
		padding: 10
	},
	feelingWrapper: {
		height: "30%",
		backgroundColor: "#B1F86D"
	},
	feelingView: {
		flexDirection: "row",
		alignItems: "center",
		gap: 15
	},
	newEntryButton: {
		width: "50%",
		backgroundColor: "#4CAB54",
		padding: 8,
		borderRadius: 5
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalStop: {
		width: "70%",
		height: "70%",
		alignItems: "center",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
		elevation: 5,
	},
	modalView: {
		flex: 1,
		justifyContent: "space-between"
	},
	modalViewEntryVisible: {
		flex: 1,
		width: "100%",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
		textAlign: "center",
		gap: 10,
		padding: 10
	},
	modalAddButton: {
		color: "blue",
		alignSelf: "flex-end"
	},
	modalDeletePress: {
		marginTop: "auto",
		alignSelf: "flex-start"
	},
	modalDeleteButton: {
		color: "orange"
	},
	entryVisibleTitle: {
		fontSize: 20,
		fontWeight: 800
	},
	entryVisibleFeeling: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	entryVisibleFeelingText: {
		textAlign: "center"
	},
	entryVisibleText: {
		flex: 1,
		width: "100%",
		textAlign: "left",
		marginTop: 10
	},
	textInput: {
		height: "8%",
		width: "100%",
		backgroundColor: "white",
		color: "black",
		padding: 5,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		borderRadius: 3,
	},
	largeTextInput: {
		height: "65%"
	}
});
