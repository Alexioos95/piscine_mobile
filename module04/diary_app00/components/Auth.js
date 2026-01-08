import AsyncStorage from '@react-native-async-storage/async-storage';
/////////////////////////////////
//// Store log in state
/////////////////////////////////
export const setIsLogged = async (value) => {
	try { await AsyncStorage.setItem("isLogged", JSON.stringify(value)) }
	catch (error) { console.error(error) }
}

/////////////////////////////////
//// Get log in state
/////////////////////////////////
export const isLogged = async () => {
	try
	{
		const value = await AsyncStorage.getItem("isLogged");
		if (value !== null)
			return (JSON.parse(value));
		return (false);
	}
	catch (error)
	{
		console.error('Failed to retrieve login state', error);
		return (false);
	}
}

export const removeIsLogged = async () => {
	try { await AsyncStorage.removeItem("isLogged") }
	catch(error) { console.log(error) }
}
