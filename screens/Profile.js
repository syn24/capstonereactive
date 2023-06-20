import { useEffect, useState, useContext } from "react";
import * as ImagePicker from 'expo-image-picker';
import Checkbox from "expo-checkbox";
import { View, StyleSheet, Text, TextInput, ScrollView,  Pressable, Image} from 'react-native';
import Avatar from 'react-avatar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../store/AppContext";

import validEmail from "../utils/validate.email";
import validateName from "../utils/validate.name";
import validatePhone from "../utils/validate.phone";
import fetchCredentials from "../utils/fetchCreds";

function Profile() {

    const [isSavingEdit, setIsSavingEdits] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [profileLoadFinish, setProfileLoadFinish] = useState(false);

    // track name and email are spected requirements
    const [inputError, setInputError] = useState({
      name: false,
      email: false,
      phone: false,
    });

 
  
    useEffect(() => {
      (async () => {
        try {

          let profileTemp = await AsyncStorage.getItem("profileData");
          //console.log(typeof profileTemp);
          profileTemp = JSON.parse(profileTemp);
          //console.log({ ...profileTemp});
          setProfileData((profileData) => ({ ...profileTemp}));
          setProfileLoadFinish(true);
        } catch (error) {
          console.log(error);
        }
      })();
    
    

    }, []);

    useEffect(() => {
    (async () => {
      try {
        if (profileLoadFinish) {
          const onboardingData = await fetchCredentials();
          if (!profileData || !profileData?.firstname) {
            
            const userData = {
              firstname: onboardingData.firstname,
              lastname: "",
              email: onboardingData.email,
              phone: "(000)000-0000",
              orderstatus: false,
              passwordchange: false,
              specialoffer: false,
              newsletter: false,
              avatar: "",
            };   
            setProfileData({ ...userData });
            
          } 
        }
       
      } catch (error) {
        console.log(error);
      }
    })();

  }, [profileData]);



  
    function updateFirstName(str) {
      profileData.firstname = str;
    }
  
    function updateLastName(str) {
      profileData.lastname = str;
    }
  
    function updateEmail(str) {
      profileData.email = str;
    }
  
    function updatePhone(str) {
      profileData.phone = str;
    }

    function toggleOrderStatusesCheckbox() {
      setProfileData({ ...profileData, orderstatus: !profileData.orderstatus });
    }
  
    function togglePasswordChangesCheckbox() {
      setProfileData({ ...profileData, passwordchange: !profileData.passwordchange });
    }
    
    function toggleSpecialOffersCheckbox() {
      setProfileData({ ...profileData, specialoffer: !profileData.specialoffer });
    }
  
    function toggleNewsletterCheckbox() {
      setProfileData({ ...profileData, newsletter: !profileData.newsletter });
    }
  
    function resetAvatar() {
      setProfileData({ ...profileData, avatar: "null" });
    }
  
    async function doLogout() {
      try {
        await AsyncStorage.clear();
        setIsOnboardingCompleted(false)
      } catch (error) {
        console.error(error);
      }
    }
  
    /**
     * save changes to the database
     */
    function saveChanges() {
      (async () => {
        try {
          const email_isvalid = validEmail(profileData.email);
          const name_isvalid = validateName(profileData.firstname);
          const phone_n_valid = validatePhone(profileData.phone);
  
          await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
          console.log(profileData);
          console.log("saved");  

        } catch (error) {
          console.log(error);
        }
      })();
    }
  
    /**
     * discard all updates
     */
    function discardEdits() {
      (async () => {
        try {
         setProfileData({});
        } catch (error) {
          console.log(error);
        }
      })();
    }
  
    async function imagePicker() {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setProfileData({ ...profileData, avatar: result.assets[0].uri });
      }
    }
 
    const avatar =
      (profileData !== null && profileData?.avatar) ? (
        <Image
          style={styles.profileAvatar}
          source={{ uri: profileData.avatar }}
        />
      ) : (
       <View>
         <Avatar  size={styles.profileAvatar.height}  name={
            !profileData && !profileData?.lastname 
              ? `${profileData?.firstname} ${profileData?.lastname}`
              : "Karl Meier"
          } />
       </View>
      );
  
    if (isSavingEdit) {
      return <SplashScreen />;
    }
  
    return (

       <ScrollView>
        <View style={styles.profileContainer}>
          <View>
            <Text style={styles.profileText}>Personal information</Text>
            <Text style={styles.profileText}>Avatar</Text>
          </View>
          <View style={styles.avatarContainer}>
            {avatar}
            <Pressable
              style={styles.avatarButtonChange}
              onPress={imagePicker}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonTextBright}>Change</Text>
            </Pressable>
            <Pressable
              style={styles.avatarButtonRemove}
              onPress={resetAvatar}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonTextDark}>Remove</Text>
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.profileText}>First name</Text>
            <View style={inputError.name ? styles.inputErr : styles.inputInner}>
              <TextInput
                onChangeText={updateFirstName}
                placeholder={profileData?.firstname}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="off"
              />
            </View>
            <Text style={styles.profileText}>Last name</Text>
            <View style={styles.inputInner}>
              <TextInput
                onChangeText={updateLastName}
                style={styles.input}
                placeholder={profileData?.lastname}
                autoCapitalize="none"
                autoComplete="off"
              />
            </View>
            <Text style={styles.profileText}>Email</Text>
            <View style={inputError.email ? styles.inputErr : styles.inputInner}>
              <TextInput
                onChangeText={updateEmail}
                placeholder={profileData?.email}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="off"
              />
            </View>
            <Text style={styles.profileText}>Phone number</Text>
            <View style={inputError.phone ? styles.inputErr : styles.inputInner}>
              <TextInput
                style={styles.input}
                onChangeText={updatePhone}
                placeholder={profileData?.phone || "US phone"}
                keyboardType="numeric"
              />
            </View>
          </View>
  
          <View style={styles.notifications}>
            <Text style={styles.profileText}>Email notifications</Text>
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={profileData.orderstatus || false}
                onValueChange={toggleOrderStatusesCheckbox}
              />
              <Text style={styles.profileText}>Order status</Text>
            </View>
  
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={profileData.passwordchange || false}
                onValueChange={togglePasswordChangesCheckbox}
              />
              <Text style={styles.profileText}>Password changes</Text>
            </View>
  
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={profileData.specialoffer || false}
                onValueChange={toggleSpecialOffersCheckbox}
              />
              <Text style={styles.profileText}>Special offers</Text>
            </View>
  
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={profileData.newsletter || false}
                onValueChange={toggleNewsletterCheckbox}
              />
              <Text style={styles.profileText}>Newsletter</Text>
            </View>
          </View>
          <Pressable
            style={styles.logoutButton}
            onPress={doLogout}
            activeOpacity={0.5}
          >
            <Text style={styles.buttonTextDark}>Log Out</Text>
          </Pressable>
          <View style={styles.doubleButton}>
            <Pressable
              style={styles.buttonDiscard}
              onPress={discardEdits}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonTextDark}>Discard changes</Text>
            </Pressable>
            <Pressable
              style={styles.buttonSave}
              onPress={saveChanges}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonTextBright}>Save changes</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

const styles = StyleSheet.create({
    profileContainer: {
      flex: 1,
      backgroundColor: 'lightgrey',
      gap: 15,
    },
    notifications: {
      gap: 6,
    },
    avatarContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "10%",
      gap: 20,
    },
    profileAvatar: {
      width: 63,
      height: 63,
      borderRadius: 30,
    },
    avatarButtonChange: {
      alignItems: "center",
      padding: 20,
      marginVertical: 40,
      margin: 60,
      width: 150,
      borderWidth: 2,
      backgroundColor: 'darkgreen',
      borderColor: 'grey',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarButtonRemove: {
      alignItems: "center",
      fontSize: 16,
      padding: 20,
      marginVertical: 40,
      margin: 60,
      width: 150,
      borderWidth: 2,
      borderColor: 'grey',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "10%",
    },
    profileText: {
        fontSize: 24,
        padding: 5,
        width: '100%',
        marginVertical: 8,
        color: 'black',
        textAlign: 'left',
        paddingHorizontal: '10%',
    },
    inputContainer: {},
    inputInner: {
      alignSelf: "center",
      width: "80%",
      backgroundColor: "lightgrey",
      borderRadius: 10,
      padding: 2,
      margin: 5,
    },
    inputErr: {
      alignSelf: "center",
      width: "80%",
      backgroundColor: "#ea1313a6",
      borderRadius: 10,
      padding: 2,
      margin: 5,
    },
    input: {
        height: 40,
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        fontSize: 16,
        borderColor: 'black',
        backgroundColor: '#EDEFEE',
    },
    logoutButton: {
      width: "60%",
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: "#F4CE14",
      fontSize: 22,
      padding: 20,
      marginVertical: 40,
      margin: 100,
      borderWidth: 2,
      borderColor: 'grey',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    doubleButton: {
      marginTop: 15,
      paddingBottom: 15,
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },
    buttonDiscard: {
      width: "35%",
      backgroundColor: "lightgrey",
      fontSize: 22,
      padding: 20,
      marginVertical: 40,
      margin: 100,
      width: 200,
      borderWidth: 2,
      borderColor: 'grey',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSave: {
      alignItems: "center",
      width: "35%",
      backgroundColor: "darkgreen",
      fontSize: 22,
      padding: 20,
      marginVertical: 40,
      margin: 100,
      width: 200,
      borderWidth: 2,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonTextBright: {
      color: "white",
    },
    buttonTextDark: {
        color: "black",
      },
  });

export default Profile;