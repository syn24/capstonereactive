import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * @param {*} username
 * @param {*} email
 * @returns object with stored flag and populed err
 */
async function storeCredentials(username, email) {
  const storedPayload = {
    firstname: null,
    email: null,
    stored: false,
    err: "",
  };
  try {
    await AsyncStorage.setItem("firstname", username);
    await AsyncStorage.setItem("email", email);
    storedPayload.firstname = username;
    storedPayload.email = email;
    storedPayload.stored = true;
  } catch (error) {
    storedPayload.err = error;
  }

  return storedPayload;
}

export default storeCredentials;