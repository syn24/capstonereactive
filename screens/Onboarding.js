import React, {useState} from 'react';
import { View, StyleSheet, Text, TextInput, Button, ImageBackground, KeyboardAvoidingView, Pressable} from 'react-native';

function Onboarding() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [visible, setVisible] = useState(true);
    const showDialog = () => setVisible(true);


    const saveInfo = () => {}

    return (
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>

<View style={styles.container0}>
    <View style={styles.container2} accessible={true}>
              <ImageBackground
                    source={require('../assets/Logo.png')}
                    style={styles.backgroundImage}
                    resizeMode="contain"
                >   </ImageBackground>
      </View>
    
      <View style={styles.container} accessible={true}>
      <View>
        <Text style={styles.regularText}>Let us get to know you</Text>
       </View>
       <Text style={styles.regularText}>
          First Name
      </Text>
          <TextInput
            style={styles.inputType}
            placeholder="First name"
            placeholderTextColor={"grey"}
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
            label={
                <Text style={styles.text}>First name</Text>}
            mode="outlined"
          />
                <Text style={styles.regularText}>
          Email
      </Text>
          <TextInput
            style={styles.inputType}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={"grey"}
            placeholder="Your user@anyemail.com"
            keyboardType="email-address"
            label="Email"
            mode="outlined"
          />

        <View style={styles.footerText}>
            <Pressable style={(name != '' && email != '' ) ? styles.button : styles.buttonInactive}
                        onPress={saveInfo}
                     > <Text style={styles.buttonText}>Next</Text>
                                      
                    </Pressable> 
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.85,
        backgroundColor: 'lightgrey',
        padding: 0,
      },
    container0: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      width: '100%',
    },
      container2: {
        flex: 0.15,
        width: '100%',
        backgroundColor: 'grey',
        padding: 0,
      },
        image: {
          width: 400,
          height: 80,
          resizeMode: "center",
          margin: 5,
          marginTop: 35,
          borderRadius: 20,
        },

        regularText: {
          fontSize: 24,
          padding: 5,
          width: '100%',
          marginVertical: 8,
          color: 'black',
          textAlign: 'center',
        },
        inputType: {
          height: 40,
          marginHorizontal: 20,
          borderWidth: 1,
          borderRadius: 15,
          padding: 10,
          fontSize: 16,
          borderColor: 'black',
          backgroundColor: '#EDEFEE',
        },
        footerText: {
          flex: 0.85,
          fontSize: 18,
          color: 'black',
          //textAlign: 'center',
          fontStyle: 'italic',
          //align: 'center',
          //alignItems: 'center',
          //justifyContent: 'center',
        },
        button: {

          fontSize: 22,
          padding: 20,
          marginVertical: 40,
          margin: 100,
          width: 200,
          backgroundColor: 'grey',
          borderWidth: 2,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonInactive: {
          fontSize: 22,
          padding: 20,
          marginVertical: 40,
          margin: 100,
          width: 200,
          backgroundColor: 'lightgrey',
          borderWidth: 2,
          borderColor: 'grey',
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonText: {
          color: 'white',
          textAlign: 'center',
          fontSize: 25,
          justifyContent: 'center',
        },
        buttonText2: {
          color: 'grey',
          textAlign: 'center',
          fontSize: 25,
          marginVertical: 40,
        },
        backgroundImage: {
            flex: 1,
            width: '100%',
        },
    
    
    });



export default Onboarding;