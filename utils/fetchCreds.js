import AsyncStorage from "@react-native-async-storage/async-storage";

async function fetchCredentials() {
  const response = {};
  response.logged = false; 
  response.error;

  try {
    response.firstname = await AsyncStorage.getItem("firstname");
    response.email = await AsyncStorage.getItem("email");
    if (response.firstname && response.email) {
      response.logged = true;
    }
  } catch (e) {
    response.error = e;
  }
  return response;
}

export default fetchCredentials;