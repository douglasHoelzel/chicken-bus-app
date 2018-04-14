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
  TextInput,
  Switch
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import * as firebase from 'firebase';
import Modal from "react-native-modal";
import { Button, List, ListItem } from 'native-base';
import { TabNavigator } from 'react-navigation';
GLOBAL = require('./Global.js');



{/* Notes:

*/}
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
};
constructor(props){
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.state = {
        showPassword: true,
        isLoggedIn: false,
        email: '',
        password: '',
        userID: '',
        userName: '',
        loading: false,
        isSignUpModalVisible: false,
        isCreateUserNameModalVisible: false,
    };
}
componentWillMount(){
    const firebaseConfig = {
        apiKey: 'AIzaSyCefns5mcZ9SFsC9Jq2IlQnIABSP5hxhgs',
        authDomain: 'chickenbus-6f4aa.firebaseapp.com',
    }
    firebase.initializeApp(firebaseConfig);
}
loginWithGoogle = async() => {
  const result = await Expo.Google.logInAsync({
    androidClientId: '396242534921-ql4pfkgkonbqe357ed9vn3tm2hi5ihoo.apps.googleusercontent.com',
    iosClientId: '396242534921-j13r4u4pfenrqpdmgq0ekgfesuhcrg6d.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  if (result.type === 'success') {

    // Build Firebase credential with the Facebook access token.
    const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);

    // Sign in with credential from the Facebook user.
    this.setState({loading: true});

    firebase.auth().signInWithCredential(credential)
    .then((user) => {
      this.toggleCreateUserNameModal();

      console.log("New User ID: " + JSON.stringify(user));
      GLOBAL.USERID = user.uid;
      GLOBAL.ISLOGGEDIN = true;
      GLOBAL.USERNAME = this.state.userName;
      GLOBAL.EMAIL = user.email;
      this.getUserInfo(user.uid);
    this.setState({loading: false, isLoggedIn: true, email: '', userName: '', userID: '', password: ''});
    this.downloadUserImage();
    this.props.navigation.navigate('Map');

        {/* Sends New User Information to Database*/}
        const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/userapi/adduser";
        console.log("UserID: " + GLOBAL.USERID + " USERNAME: " + GLOBAL.USERNAME );
        fetch(url, {
               method: 'POST',
               headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 userID: GLOBAL.USERID,
                 username: GLOBAL.USERNAME,
               })
          });
      })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("SIGN UP ERROR CODE: " + errorCode + " SIGN UP ERROR MESSAGE: " + errorMessage);
      Alert.alert(errorMessage);
      this.setState({loading: false, isLoggedIn: false, userID: '', email: '', userName: '', password: '', email: ''});
    });
  }
}

loginWithFacebook = async() => {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    '201285720459409',
  {scope: 'email,public_profile'}
  );

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    this.setState({loading: true});

    firebase.auth().signInWithCredential(credential)
    .then(async (user) => {
      this.toggleCreateUserNameModal();
      console.log("New User ID: " + JSON.stringify(user));

      GLOBAL.USERID = user.uid;
      GLOBAL.ISLOGGEDIN = true;
      GLOBAL.EMAIL = user.email;
      //this.getUserInfo(user.uid);
      this.setState({loading: false, isLoggedIn: true, email: '', userName: '', userID: '', password: ''});
      this.downloadUserImage();
      this.props.navigation.navigate('Map');

        {/* Sends New User Information to Database*/}
        const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/userapi/adduser";
        console.log("UserID: " + GLOBAL.USERID + " USERNAME: " + GLOBAL.USERNAME );
        fetch(url, {
               method: 'POST',
               headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 userID: GLOBAL.USERID,
                 username: GLOBAL.USERNAME,
               })
          });
      })for (var i = 0; i < array.length; i++) {
          array[i]
      }
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("SIGN UP ERROR CODE: " + errorCode + " SIGN UP ERROR MESSAGE: " + errorMessage);
      Alert.alert(errorMessage);
      this.setState({loading: false, isLoggedIn: false, userID: '', email: '', userName: '', password: '', email: ''});
    });

  }

}

onEmailSignInPress = (email, password) => {
    console.log("Existing user signing in");
    this.setState({loading: true});
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
        console.log("New User ID: " + JSON.stringify(user));
        GLOBAL.USERID = user.uid;
        GLOBAL.ISLOGGEDIN = true;
        GLOBAL.USERNAME = this.state.userName;
        GLOBAL.EMAIL = user.email;
        this.getUserInfo(user.uid);
        this.setState({loading: false, isLoggedIn: true, email: '', userName: '', userID: '', password: ''});
        this.downloadUserImage();
        this.props.navigation.navigate('Map');
      })
    .catch((error) =>  {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("SIGN UP ERROR CODE: " + errorCode + " SIGN UP ERROR MESSAGE: " + errorMessage);
        Alert.alert(errorMessage);
        this.setState({loading: false, isLoggedIn: false, userID: '', email: '', userName: '', password: '', email: ''});
    })
};

onEmailSignUpPress = (userName, email, password) => {
    console.log("New Screen Name Being Entered : " + userName + " email: " + email + " password: " + password);
    this.setState({loading: true});
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
        GLOBAL.USERID = user.uid;
        GLOBAL.ISLOGGEDIN = true;
        GLOBAL.USERNAME = this.state.userName;
        GLOBAL.EMAIL = this.state.email;
        this.setState({loading: false, isLoggedIn: true, isSignUpModalVisible: false, email: '', userName: '', userID: '', password: ''});
        {/* Sends New User Information to Database*/}
        const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/userapi/adduser";
        console.log("UserID: " + GLOBAL.USERID + " USERNAME: " + GLOBAL.USERNAME );
        fetch(url, {
               method: 'POST',
               headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 userID: GLOBAL.USERID,
                 username: GLOBAL.USERNAME,
               })
        });
        this.props.navigation.navigate('Map');
      })
    .catch((error) =>  {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("SIGN UP ERROR CODE: " + errorCode + " SIGN UP ERROR MESSAGE: " + errorMessage);
        Alert.alert(errorMessage);
        this.setState({loading: false, isLoggedIn: false, isSignUpModalVisible: false});
        console.log("end of error message");
    })
    this.toggleSignUpModal();
};

downloadUserImage = async () => {
    console.log("Downloading user image");
    const downloadUserImageURL = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/imageapi/getuserimage/" + GLOBAL.USERID;
    const response = await fetch(downloadUserImageURL);
    const json = await response.json();

    console.log(json.doc.userImage);
    if(json.doc.userImage === "Default Image" || json.doc.userImage === "" || json.doc.userImage === " "){
        console.log("Defaul user image detected");
        console.log(json.doc.userImage);
    }
    else{
        console.log("Cusom user image found");
        GLOBAL.USERIMAGEBASE64 = json.doc.userImage;
    }
};

getUserInfo = async (userID) => {
    const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/userapi/getuser/" + userID;
    const response = await fetch(url);
    const json = await response.json();
    GLOBAL.USERNAME = json.doc.username;
    GLOBAL.USERID = json.doc.userID;
    GLOBAL.ISLOGGEDIN = true;
};

toggleSignUpModal = () => {
    this.setState({ isSignUpModalVisible: !this.state.isSignUpModalVisible });
}
toggleCreateUserNameModal = () => {
    this.setState({ isCreateUserNameModalVisible: !this.state.isCreateUserNameModalVisible });
}

onCreateAccountPress = (userName, email, password) => {
    console.log("Creating New Account");
    this.onEmailSignUpPress(userName, email, password);
}

onCreateUserNamePress = (userName) => {
    console.log("Creating Username");
    console.log("New Screen Name Being Entered : " + userName);
    GLOBAL.USERNAME = this.state.userName;
    this.toggleCreateUserNameModal();


}
clearAllData = () => {
    console.log("Cleaning All User Data on Sign Out");
    this.setState({isLoggedIn: false, userName: '', userID: '', userName: '', email: '', password: ''});
    GLOBAL.USERID = '';
    GLOBAL.USERNAME = '';
    GLOBAL.EMAIL = '';
    GLOBAL.ISLOGGEDIN = false;
}
toggleSwitch() {
   this.setState({ showPassword: !this.state.showPassword });
 }
renderCurrentState(){
    if(this.state.loading){
        return(
            <View>
                <ActivityIndicator size = 'large' style={styles.loader}/>
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
                  source={require('../assets/images/chickenBusLogo3.png')}
                  />
            </View>
            {/* Email */}
            <View style={styles.emailContainer}>
                <TextInput
                    style={{height: 50,
                        paddingLeft: 10,
                        backgroundColor: '#ECE8E8',
                        borderRadius: 3,}}
                    placeholder="Email"
                    onChangeText={(email) => this.setState({email})}
                    value = {this.state.email}
                />
            </View>
            {/* Password Field */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={{height: 50,
                        paddingLeft: 10,
                        backgroundColor: '#ECE8E8',
                        borderRadius: 3,}}
                    secureTextEntry={this.state.showPassword}
                    placeholder="Password"
                    onChangeText={(password) => this.setState({password})}
                    value = {this.state.password}
                />
            </View>
            {/* Standard Sign In Button */}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonCell}
                        onPress={() => this.onEmailSignInPress(this.state.email, this.state.password)}>
                    <Text style={styles.buttonText}> Sign In</Text>
                    </TouchableOpacity>
            </View>
            {/* Create Account Button */}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonCell}
                        onPress={() => this.toggleSignUpModal()}>
                    <Text style={styles.buttonText}> Create Account </Text>
                    </TouchableOpacity>
            </View>
            {/* Google Sign In Button */}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonCell}
                        onPress={() => this.loginWithGoogle()}>
                    <Text style={styles.buttonText}> Sign In With Google </Text>
                    </TouchableOpacity>
            </View>
            {/*Facebook Button*/}
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonCell}
                        onPress={() => this.loginWithFacebook()}>
                    <Text style={styles.buttonText}> Sign In With Facebook </Text>
                    </TouchableOpacity>
            </View>
          </ScrollView>
          {/* Create Account Modal */}
          <Modal style={styles.modal} isVisible={this.state.isSignUpModalVisible}>
            <ScrollView>
            <View style={{width: 372}}>
            {/* Modal Header */}
            <Text style={styles.detailsHeader}>Create your account </Text>
                {/* Modal Username */}
                <View style={styles.userNameContainer}>
                    <TextInput
                        style={{height: 50,
                            paddingLeft: 10,
                            marginLeft: 20,
                            backgroundColor: '#E4E4E4',
                            borderRadius: 6}}
                        placeholder="Screen Name"
                        onChangeText={(userName) => this.setState({userName})}
                        value = {this.state.userName}
                    />
                </View>
            {/* Modal Email */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={{height: 50,
                        paddingLeft: 10,
                        marginLeft: 20,
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
                    style={{height: 50,
                        paddingLeft: 10,
                        marginLeft: 20,
                        backgroundColor: '#E4E4E4',
                        borderRadius: 6}}
                    secureTextEntry={this.state.showPassword}
                    placeholder="Password"
                    onChangeText={(password) => this.setState({password})}
                    value = {this.state.password}
                />
                <Text style={styles.showPasswordTextModal}>Show Password</Text>

                <Switch
                  style={{marginTop:-25,
                    marginLeft:130}}
                  onValueChange={this.toggleSwitch}
                  value={!this.state.showPassword}
                />
            </View>
            {/* Modal Sign Up Button */}
            <Button block style={styles.signUpModalButton}
             onPress={() => this.onCreateAccountPress(this.state.userName, this.state.email, this.state.password)}
             >
                <Text style={styles.signUpModalButtonText}>Sign Up</Text>
            </Button>
            <Button block style={styles.backModalButton}
             onPress={() => this.toggleSignUpModal()}
             >
                <Text style={styles.signUpModalButtonText}>Back</Text>
            </Button>

           </View>
           </ScrollView>
           </Modal>

           <Modal style={styles.modal} isVisible={this.state.isCreateUserNameModalVisible}>
             <ScrollView>
             <View style={{width: 372}}>
             {/* Modal Header */}
             <Text style={styles.detailsHeader}>Create your screen name </Text>
                 {/* Modal Username */}
                 <View style={styles.userNameContainer}>
                     <TextInput
                         style={{height: 50,
                             paddingLeft: 10,
                             marginLeft: 20,
                             backgroundColor: '#E4E4E4',
                             borderRadius: 6}}
                         placeholder="Screen Name"
                         onChangeText={(userName) => this.setState({userName})}
                         value = {this.state.userName}
                     />
                 </View>

             {/* Modal Sign Up Button */}
             <Button block style={styles.signUpModalButton}
              onPress={() => this.onCreateUserNamePress(this.state.userName)}
              >
                 <Text style={styles.signUpModalButtonText}>Create</Text>
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
    paddingTop: 0,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',

  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,

  },
  welcomeImage: {
    width: 600,
    height: 300,
    resizeMode: 'contain',
    marginLeft: -10,
 },
 emailContainer:{
     marginTop: -50,
     width: 350,
     paddingTop: 0,
 },
 passwordContainer:{
     width: 350,
     paddingTop: 20,
 },
 showPasswordText:{
   marginTop: 20,
 },
 showPasswordTextModal:{
   marginTop: 20,
   marginLeft:20,
 },
 userNameContainer:{
     width: 350,
     paddingTop: 50,
 },
 buttonContainer:{
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 15,
},
buttonText:{
    color: '#fff'
},
buttonCell:{
     alignItems: 'center',
     padding: 10,
     paddingTop: 10,
     backgroundColor: '#ffab00',
     borderRadius: 6,
     width: 200,
 },
 loader:{
     alignItems: 'center',
     marginTop: 350,
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
   marginTop: 200,
   borderRadius: 0,
   backgroundColor: '#5E8DF7',
   height: 50,
 },
 backModalButton: {
   marginTop: 5,
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
