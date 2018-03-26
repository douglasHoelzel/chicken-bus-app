import React from 'react';
import {
  AppRegistry,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  View,
  Alert,
  PixelRatio,
  TextInput,
  ImageStore,
  ImageEditor,
} from 'react-native';
import * as firebase from 'firebase';
import { Button, List, ListItem } from 'native-base';
import { MonoText } from '../components/StyledText';
import Modal from "react-native-modal";
import { ImagePicker, WebBrowser } from 'expo';
GLOBAL = require('./Global.js');



{/* Notes:
    Once image can be uploaded to Firebase:
        - Upon creation of account have defauly image be loaded to Account
        - Pull and display profile
*/}

export default class SettingsScreen extends React.Component {

static navigationOptions = {
    header: null,
};
constructor(props){
      super(props);
      this.state = {
          userImage: require('../assets/images/testUserImage.png'),
          isUserNameModalVisible: false,
          newUserName: '',
          image: null,
          base64Image: '',

      };
}
componentWillMount(){
    this.downloadUserImage();
}

toggleUserNameModal = () => {
      this.setState({ isUserNameModalVisible: !this.state.isUserNameModalVisible });
}

onChangeUserNamePress = (newUserName) => {
    if(newUserName === ''){
          Alert.alert("Enter a new screen name");
    }
    else{
      console.log("Chaning screen name to: " + newUserName);
      this.toggleUserNameModal();
      this.setState({newUserName: ''});
   }
};
onSignOutPress = () => {
    console.log("User Signing Out");
    this.clearAllData();
};

uploadUserImage = () => {
    console.log("Uploading user image");

    // Converts image URL to Base64 String
    Image.getSize(this.state.image, (width, height) => {
      let imageSettings = {
        offset: { x: 0, y: 0 },
        size: { width: width, height: height }
      };
      ImageEditor.cropImage(this.state.image, imageSettings, (uri) => {
        ImageStore.getBase64ForTag(uri, (data) => {
          this.setState({base64Image: data});
          GLOBAL.USERIMAGEBASE64 = "data:image/png;base64," + this.state.base64Image;
          console.log("BASE64:  " + GLOBAL.USERIMAGEBASE64);
          const uploadUserImageURL = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/imageapi/uploaduserimage";
          fetch(uploadUserImageURL, {
                 method: 'POST',
                 headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                   userID: GLOBAL.USERID,
                   base64: GLOBAL.USERIMAGEBASE64,
                 })
            })
          .catch((error) => {
          console.log("Error in uploading user image: " + error.code + " USER IMAGE UPLOAD ERROR MESSAGE: " + error.message);
          });
        }, e => console.warn("getBase64ForTag: ", e))
      }, e => console.warn("cropImage: ", e))
    })
};

downloadUserImage = async () => {
    console.log("Downloading user image");
    const downloadUserImageURL = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/imageapi/getuserimage/" + GLOBAL.USERID;
    const response = await fetch(downloadUserImageURL);
    const json = await response.json();

    if(json.doc === "Default Image" || json.doc === "" || json.doc === " "){
        console.log("Defaul user image detected");
    }
    else{
        console.log("json.doc");
        console.log(json.doc);
        GLOBAL.USERIMAGEBASE64 = json.doc;
    }
};

clearAllData = () => {
    console.log("Clearning All User Data on Sign Out");
    this.setState({isLoggedIn: false, userName: '', userID: '', email: '', password: ''});
    GLOBAL.USERID = '';
    GLOBAL.USERNAME = '';
    GLOBAL.EMAIL = '';
    GLOBAL.ISLOGGEDIN = false;
    this.props.navigation.navigate('Home');
}

selectPhotoTapped = async () => {
    console.log("Add Photo Button Clicked");

   let result = await ImagePicker.launchImageLibraryAsync({
     allowsEditing: true,
     aspect: [4, 3],
   });

   console.log(result);

   if (!result.cancelled) {
     this.setState({ image  : result.uri });
   }
   GLOBAL.USERIMAGEBASE64 = this.state.image;
   this.uploadUserImage();
 };



render() {
    let { image } = this.state;
  return (
      <View style={styles.container}>
      <ScrollView>
      <Text style={styles.profileHeader}>{GLOBAL.USERNAME} </Text>
          <List>
              <ListItem >
                  <Image style={styles.profileImage} source={{ uri: GLOBAL.USERIMAGEBASE64 }}/>
              {/* Add Photo Button */}
              <TouchableOpacity style={styles.addPhotoButton}  onPress={this.selectPhotoTapped.bind(this)}>
                  <Image style={styles.plusSignIcon} source={require('../assets/images/plusSignIcon.png')}/>
              </TouchableOpacity>


              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
              {/* Profile Details */}
              </ListItem>
              <ListItem>
                <Text>Email: {GLOBAL.EMAIL}</Text>
              </ListItem>
              <ListItem>
                <Text>Reputation: 63 </Text>
              </ListItem>
              <ListItem>
                <Text>Locations Added:  11 </Text>
              </ListItem>
              <ListItem>
                <Text>Liked Locations:  23 </Text>
              </ListItem>
              <ListItem>
                <Text>Comments:  Comments can go here </Text>
              </ListItem>
              <ListItem>
                <Text>Placeholder: Some other data can go here </Text>
              </ListItem>
              <ListItem>
                <Text>Placeholder: Some other data can go here </Text>
              </ListItem>
              <ListItem>
                <Text>Placeholder: Some other data can go here </Text>
              </ListItem>
         </List>
         {/* Change Screen Name Button */}
         <Button block style={styles.backButton}
          onPress={() => this.toggleUserNameModal()}>
             <Text style={styles.changeUserNameButtonText}>Change Screen Name</Text>
         </Button>
         <Button block
             style={styles.signOutButton}
             onPress={() => this.onSignOutPress()}>
             <Text style={styles.signOutButtonText}> Sign Out </Text>
         </Button>
    </ScrollView>



    {/* Create Account Modal */}
    <Modal style={styles.modal} isVisible={this.state.isUserNameModalVisible}>
      <ScrollView>
      <View style={{width: 372}}>
      {/* Modal Header */}
      <Text style={styles.detailsHeader}>Change your screen name </Text>
      {/* Modal Screen Name Field */}
      <View style={styles.userNameContainer}>
          <Text style={styles.currentUserName}>Current Screen Name: </Text>
          <Text style={styles.userNameText}>{GLOBAL.USERNAME}</Text>
          <TextInput
              style={{height: 50,
                  paddingLeft: 10,
                  marginLeft: 20,
                  marginBottom: 10,
                  backgroundColor: '#E4E4E4',
                  borderRadius: 6}}
              placeholder="New Screen name"
              onChangeText={(newUserName) => this.setState({newUserName})}
              value = {this.state.newUserName}/>
      </View>
      {/* Modal Sign Up Button */}
      <Button block style={styles.changeUserNameButton}
       onPress={() => this.onChangeUserNamePress(this.state.newUserName)}>
          <Text style={styles.changeUserNameButtonText}>Submit</Text>
      </Button>
      {/* Back Button */}
      <Button block style={styles.backButton}
       onPress={() => this.toggleUserNameModal()}>
          <Text style={styles.changeUserNameButtonText}>Back</Text>
      </Button>

     </View>
     </ScrollView>
     </Modal>
      </View>
    );
 }
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
},
profileHeader:{
    marginTop: 30,
    paddingTop: 20,
    paddingLeft: 10,
    backgroundColor: '#5A87ED',
    height: 60,
    fontSize: 25,
    fontWeight: 'bold',
    color: "#fff"
},
profileImage:{
    height: 300,
    width: 300,
    marginLeft: 40,
    borderRadius: 150,
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
userNameContainer:{
    marginTop: 130,
    width: 350,
    paddingTop: 10,
},
changeUserNameButton: {
  marginTop: 240,
  borderRadius: 0,
  backgroundColor: '#5E8DF7',
  height: 50,
},
backButton: {
  marginTop: 5,
  borderRadius: 0,
  backgroundColor: '#5E8DF7',
  height: 50,
},
changeUserNameButtonText: {
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize:  18,
},
userNameText:{
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
},
currentUserName:{
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 10,
},
addPhotoButton:{
    backgroundColor: '#E0E0E0',
    width: 50,
    height: 50,
    marginTop: 280,
    marginLeft: -80,
    borderRadius: 100
},
plusSignIcon:{
    width: 20,
    height: 20,
    marginTop: 15,
    marginLeft: 15,
},
signOutButton:{
    marginTop: 10,
    borderRadius: 0,
    backgroundColor: '#5E8DF7',
    height: 50,
},
signOutButtonText:{
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize:  18,
}
});
