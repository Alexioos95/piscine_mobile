/////////////////////////////////
//// Imports
/////////////////////////////////
// Basic Components
import { useState, useEffect } from 'react';
import { Modal, View, ScrollView, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Calendar
import { Calendar } from 'react-native-calendars';
// Icons
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// Navigation
import { useIsFocused } from '@react-navigation/native';
// Authentification
import { getInLocalStorage, getFromDatabase, removeFromDatabase } from './Auth.js'

/////////////////////////////////
//// Application
/////////////////////////////////
export default function Agenda() {
	/////////////////////////////////
	//// Variables
	/////////////////////////////////
	const iconColors = {
		'emoticon-happy-outline': "blue",
		'emoticon-neutral-outline': 'orange',
		'emoticon-frown-outline': 'red',
		'emoticon-sick': 'purple'
	};
	const isFocused = useIsFocused();
	const [dataUser, setDataUser] = useState(null);
	const [arrayEntries, setArrayEntries] = useState([]);
	const [selectedDate, setSelectedDate] = useState("");
	const [entryVisible, setEntryVisible] = useState(false);
	const [entryVisibleData, setEntryVisibleData] = useState({
		uuid: null,
		date: null,
		icon: null,
		text: ""
	});
	/////////////////////////////////
	//// User Datas
	/////////////////////////////////
	useEffect(() => {
		const getUID = async () => {
			try
			{
				if (isFocused)
				{
					const data = await getInLocalStorage("data");
					setDataUser(data);
					if (data === null)
						return ;
					const setOfEntries = await getFromDatabase(data.uid);
					setArrayEntries(setOfEntries);
				}
			}
			catch (error) { console.error(error) }
		};
		getUID();
	}, [isFocused]);

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
				<View style={styles.fullWidth}>
					<Calendar
						monthFormat={"MMMM yyyy"}
						current={Date()}
						enableSwipeMonths={true}
						showWeekNumbers={true}
						onDayPress={(day) => {
							setSelectedDate(day.dateString);
						}}
						markedDates={{
							[selectedDate]: {
								selected: true,
								selectedColor: "blue",
							},
						}}
					/>
				</View>
				<View style={styles.entriesContainer}>
					<ScrollView style={styles.scrollViewEntries}>
						{arrayEntries.map((item) => {
							if (selectedDate === "")
								return ;
							const itemDate = new Date(item[1].date);
							const calendarDate = new Date(selectedDate);
							const gmtPlus1Date = new Date(itemDate.getTime() + 60 * 60 * 1000);
							if (gmtPlus1Date.getTime() !== calendarDate.getTime())
								return ;
							return (
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
							)
						})}
					</ScrollView>
				</View>
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
		alignItems: "center",
		justifyContent: "space-between"
	},
	entriesContainer: {
		height: "45%",
		width: "100%",
		padding: 10,
	},
	fullWidth: {
		width: "100%"
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
});
