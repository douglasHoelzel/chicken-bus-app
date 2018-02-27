import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import * as firebase from 'firebase';
import Modal from "react-native-modal";
import { Button, List, ListItem } from 'native-base';



export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
};
constructor(props){
    super(props);
    this.state = {  
        isLoggedIn: false,
        email: '',
        password: '',
        userID: '',
        loading: false,
        isSignUpModalVisible: false,
    };
}
componentWillMount(){
    const firebaseConfig = {
        apiKey: 'AIzaSyCefns5mcZ9SFsC9Jq2IlQnIABSP5hxhgs',
        authDomain: 'chickenbus-6f4aa.firebaseapp.com',
    }
    firebase.initializeApp(firebaseConfig);
}
onEmailSignInPress = (email, password) => {
    console.log("Existing user signing in");
    this.setState({loading: true});
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
        console.log('User successfully logged in', user);
        this.setState({userID: user});
        console.log("User ID: " + this.state.userID.G); 
        this.setState({loading: false, isLoggedIn: true});
      })
    .catch((error) =>  { 
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("SIGN IN ERROR CODE: " + errorCode);
        console.log("SIGN IN ERROR MESSAGE: " + errorMessage);
        Alert.alert(errorMessage);
        this.setState({loading: false, isLoggedIn: false, password: '', email: ''});
    })    
};

onEmailSignUpPress = (email, password) => {
    console.log("New User Being Entered");
    this.setState({loading: true});
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
        console.log('User successfully logged in', user);
        this.setState({userID: user});
        console.log("User ID: " + this.state.userID.G); 
        this.setState({loading: false, isLoggedIn: true});
      })
    .catch((error) =>  { 
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("SIGN IN ERROR CODE: " + errorCode);
        console.log("SIGN IN ERROR MESSAGE: " + errorMessage);
        Alert.alert(errorMessage);
        this.setState({loading: false, isLoggedIn: false, password: '', email: ''});
    })   
};

onSignOutPress = () => {
    console.log("User being logged out");
    this.setState({isLoggedIn: false, email: '', password: ''});
};

toggleSignUpModal = () => {
    this.setState({ isSignUpModalVisible: !this.state.isSignUpModalVisible });
}

onCreateAccountPress = (email, password) => {
    console.log("Creating New Account");
    this.toggleSignUpModal();
    this.onEmailSignUpPress(email, password);
}

renderCurrentState(){
    if(this.state.loading){
        return(
            <View>
                <ActivityIndicator size = 'large' style={styles.loader}/>
            </View>
        );
    }
    if(this.state.isLoggedIn){
    return(
        <View style={styles.container}>
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={() => this.onSignOutPress()}
                >
                <Text style={styles.signOutButtonText}> Sign Out </Text>
                </TouchableOpacity>
        </View>
    );
    }
    return (
        <View style={styles.container}>
            {/* Logo Image */}
            <ScrollView style={styles.container} 
                  contentContainerStyle={styles.contentContainer}>
                  <View style={styles.welcomeContainer}>
                  <Image style={styles.welcomeImage}
                  source={require('../assets/images/chickenBusLogo1.png')}
              />
            </View>
            {/* Email */}
            <View style={styles.emailContainer}>
                <TextInput
                    style={{height: 40,
                        paddingLeft: 10,
                        backgroundColor: '#DFDFDF',
                        borderRadius: 6,}}
                    placeholder="Email"
                    onChangeText={(email) => this.setState({email})}
                    value = {this.state.email}
                />
            </View>
            {/* Password */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={{height: 40,
                        paddingLeft: 10,
                        backgroundColor: '#DFDFDF',
                        borderRadius: 6,}}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(password) => this.setState({password})}
                    value = {this.state.password}
                />
            </View>
            {/* Sign In Button */}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonCell}
                        onPress={() => this.onEmailSignInPress(this.state.email, this.state.password)}
                    >
                    <Text style={styles.buttonText}> Sign In </Text>
                    </TouchableOpacity>
            </View>
            {/* Create Account Button */}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonCell}
                        onPress={() => this.toggleSignUpModal()}
                    >
                    <Text style={styles.buttonText}> Create Account </Text>
                    </TouchableOpacity>
            </View>
          </ScrollView>
          {/* Create Account Modal */}
          <Modal style={styles.modal} isVisible={this.state.isSignUpModalVisible}>
            <ScrollView>
            <View style={{width: 372}}>
            {/* Modal Header */}
            <Text style={styles.detailsHeader}>Create your account </Text>
            {/* Modal Email */}
            <View style={styles.emailContainer}>
                <TextInput
                    style={{height: 40,
                        paddingLeft: 10,
                        marginLeft: 50,
                        marginBottom: 10,
                        backgroundColor: '#E4E4E4',
                        borderRadius: 6}}
                    placeholder="Email"
                    onChangeText={(email) => this.setState({email})}
                    value = {this.state.email}
                />
            </View>
            {/* Modal Password */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={{height: 40,
                        paddingLeft: 10,
                        marginLeft: 50,
                        backgroundColor: '#E4E4E4',
                        borderRadius: 6}}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(password) => this.setState({password})}
                    value = {this.state.password}
                />
            </View>
            {/* Modal Sign Up Button */}
            <Button block style={styles.signUpModalButton}
             onPress={() => this.onCreateAccountPress(this.state.email, this.state.password)}
             >
                <Text style={styles.signUpModalButtonText}>Sign Up</Text>
            </Button>
            
           </View>
           </ScrollView>
           </Modal>
        </View>
    );
}

render() {
    return (
        <View style={styles.container}>
            {this.renderCurrentState()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginTop: 30,
    marginLeft: -10,
 },
 emailContainer:{
     marginTop: 100,
     width: 300,
     paddingTop: 10,
 },
 passwordContainer:{
     width: 300,
     paddingTop: 10,
 },
 buttonContainer:{
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
},
buttonText:{
    color: '#fff'
},
buttonCell:{
     alignItems: 'center',
     padding: 10,
     backgroundColor: '#F69134',
     borderRadius: 10,
     width: 200,
 },
 loader:{
     alignItems: 'center',
     marginTop: 350,
 },
 signOutButton:{
     alignItems: 'center',
     backgroundColor: '#3F62CB',
     marginTop: 350,
     marginLeft: 110,
     height: 50,
     width: 200,
     padding: 10,
     borderRadius: 10,
 },
 signOutButtonText:{
     fontSize: 20,
     color: '#fff',
 },
 modal: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: '#FFFFFF',
 },
 detailsHeader:{
     paddingTop: 20,
     paddingLeft: 10,
     backgroundColor: '#5E8DF7',
     height: 60,
     fontSize: 25,
     fontWeight: 'bold',
     color: "#fff"
 },
 signUpModalButton: {
   marginTop: 100,
   borderRadius: 0,
   backgroundColor: '#5E8DF7',
   height: 50,
 },
 signUpModalButtonText: {
     justifyContent: 'center',
     color: '#fff',
     fontWeight: 'bold',
     fontSize:  18,
 }
});