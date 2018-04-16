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
import TimerMixin from 'react-timer-mixin';
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
          isBadgeModalVisible: false,
          isUserNameModalVisible2: false,
          isDeleteAccountModalVisible: false,
          newUserName: '',
          image: null,
          base64Image: '',
      };
}
componentWillMount(){
    //this.downloadUserImage();
}

toggleUserNameModal = () => {
  if(!GLOBAL.ISLOGGEDIN){
    Alert.alert("MUST BE LOGGED IN");
    this.props.navigation.navigate('Home');
  }else {
      this.setState({ isUserNameModalVisible: !this.state.isUserNameModalVisible });
    }
}
toggleBadgeModal = () => {
      this.setState({ isBadgeModalVisible: !this.state.isBadgeModalVisible });
}
toggleDeleteAccountModal = () => {
  if(!GLOBAL.ISLOGGEDIN){
    Alert.alert("MUST BE LOGGED IN");
    this.props.navigation.navigate('Home');
  }else {
      this.setState({ isDeleteAccountModalVisible: !this.state.isDeleteAccountModalVisible });
  }
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
  if(!GLOBAL.ISLOGGEDIN){
     Alert.alert("MUST BE LOGGED IN");
     this.props.navigation.navigate('Home');
   }else {
    console.log("User Signing Out");
    this.clearAllData();
}};
onDeleteAccountConfirm = () => {
    console.log("Account Deleted");
    this.clearAllData();
    this.toggleDeleteAccountModal();
};
deleteAccountClicked = () => {
    var user = firebase.auth().currentUser;

    user.delete().then(function() {
      console.log("User deleted");
    }).catch(function(error) {
      console.log("User delete error");
    });
    Alert.alert(
          'Account deleted',
          'successfully',
          [
            {text: 'OK', onPress: () => this.onDeleteAccountConfirm()},
          ],
          { cancelable: false }
      )
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
    console.log("Image uploaded successfully");
};

downloadUserImage = async () => {
    console.log("Downloading user image");
    const downloadUserImageURL = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/imageapi/getuserimage/" + GLOBAL.USERID;
    const response = await fetch(downloadUserImageURL);
    const json = await response.json();

    if(json.doc.userImage === "Default Image" || json.doc.userImage === "" || json.doc.userImage === " "){
        console.log("Defaul user image detected");
    }
    else{
        GLOBAL.USERIMAGEBASE64 = json.doc.userImage;
    }
};

clearAllData = () => {
    console.log("Clearing All User Data on Sign Out");
    this.setState({isLoggedIn: false, userName: '', userID: '', email: '', password: ''});
    GLOBAL.USERID = '';
    GLOBAL.USERNAME = '';
    GLOBAL.EMAIL = '';
    GLOBAL.ISLOGGEDIN = false;
    GLOBAL.USERIMAGEBASE64 = GLOBAL.DEFAULTIMAGE;
    this.props.navigation.navigate('Home');
}

selectPhotoTapped = async () => {
   console.log("Add Photo Button Clicked");
   if(!GLOBAL.ISLOGGEDIN){
     Alert.alert("MUST BE LOGGED IN");
     this.props.navigation.navigate('Home');
   }else {
   let result = await ImagePicker.launchImageLibraryAsync({
     allowsEditing: true,
     aspect: [4, 3],
   });
   if (!result.cancelled) {
     this.setState({ image  : result.uri });
   }
   GLOBAL.USERIMAGEBASE64 = this.state.image;
   this.uploadUserImage();
 }};



render() {
    let { image } = this.state;
  return (
      <View style={styles.container}>
      <ScrollView>
      <Text style={styles.profileHeader}>{GLOBAL.USERNAME}</Text>
      {/* Badge Information Button */}
      <TouchableOpacity  style={styles.badgeButton} onPress={() => this.toggleBadgeModal()}>
          <Image style={styles.userBadgeImage} source={ GLOBAL.REPUTATION_IMAGE }></Image>
          </TouchableOpacity>
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
                <Text>Reputation: { GLOBAL.REPUTATION } </Text>
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
         {/* Sign Out Button */}
         <Button block
             style={styles.signOutButton}
             onPress={() => this.onSignOutPress()}>
             <Text style={styles.signOutButtonText}> Sign Out </Text>
         </Button>
         {/* Delete Account Button */}
         <Button block style={styles.deleteAccountButton}
          onPress={() => this.toggleDeleteAccountModal()}>
             <Text style={styles.changeUserNameButtonText}>Delete Account</Text>
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
     {/* Delete Account Modal */}
     <Modal style={styles.modal} isVisible={this.state.isDeleteAccountModalVisible}>
       <ScrollView>
       <View style={{width: 372}}>
       {/* Modal Header */}
       <Text style={styles.detailsHeader}>Delete Account </Text>
       <Text style={styles.deleteText}> Are you sure you want to delete your account?</Text>
           {/* Delete Button */}
           <Button block style={styles.deleteYesButton}
            onPress={() => this.deleteAccountClicked()}>
               <Text style={styles.changeUserNameButtonText}>Delete Account</Text>
           </Button>
       {/* Back Button */}
       <Button block style={styles.backButton}
        onPress={() => this.toggleDeleteAccountModal()}>
           <Text style={styles.changeUserNameButtonText}>Back</Text>
       </Button>
      </View>
      </ScrollView>
      </Modal>

      {/* Badge Modal */}
      <Modal style={styles.modal} isVisible={this.state.isBadgeModalVisible}>
        <ScrollView>
        <View style={{width: 372}}>
        {/* Modal Header */}
        <Text style={styles.detailsHeader}>Badge Information </Text>
        <Text style={styles.badgeTopPadder}></Text>
            <ListItem>
              <Text>Under 50: <Image style={styles.badgeInfoButton1} source={require('../assets/images/badge1.png')}/></Text>
            </ListItem>
            <ListItem>
              <Text>10 - 400: <Image style={styles.badgeInfoButton2} source={require('../assets/images/badge2.png')}/></Text>
            </ListItem>
            <ListItem>
              <Text>401 - 600: <Image style={styles.badgeInfoButton3} source={require('../assets/images/badge3.png')}/></Text>
            </ListItem>
            <ListItem>
              <Text>601 - 1200: <Image style={styles.badgeInfoButton4} source={require('../assets/images/badge4.png')}/></Text>
            </ListItem>
            <ListItem>
              <Text>1201 - 1800: <Image style={styles.badgeInfoButton5} source={require('../assets/images/badge5.png')}/></Text>
            </ListItem>
            <ListItem>
              <Text>1800 and up: <Image style={styles.badgeInfoButton6} source={require('../assets/images/badge6.png')}/></Text>
            </ListItem>

        {/* Back Button */}
        <Button block style={styles.backButton}
         onPress={() => this.toggleBadgeModal()}>
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
deleteAccountButton: {
  marginTop: 10,
  borderRadius: 0,
  backgroundColor: '#F25D49',
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
},
userBadgeImage:{
    height: 50,
    width: 50,
    marginLeft: 350,
    marginTop: -55,
},
badgeButton:{
    height: 50,
    width: 50,
},
badgeInfoButton1:{
    marginTop: 10,
    marginLeft: 116,
    height: 30,
    width: 30,
},
badgeInfoButton2:{
    marginTop: 10,
    marginLeft: 122,
    height: 30,
    width: 30,
},
badgeInfoButton3:{
    marginTop: 10,
    marginLeft: 113,
    height: 30,
    width: 30,
},
badgeInfoButton4:{
    marginTop: 10,
    marginLeft: 108,
    height: 30,
    width: 30,
},
badgeInfoButton5:{
    marginTop: 10,
    marginLeft: 102,
    height: 30,
    width: 30,
},
badgeInfoButton6:{
    marginTop: 10,
    marginLeft: 98,
    height: 30,
    width: 30,
},
badgeTopPadder:{
    marginTop: 40,
    marginBottom: 40,
},
deleteText:{
    marginTop: 50,
    marginBottom: 200,
},
deleteYesButton:{
    marginTop: 5,
    borderRadius: 0,
    backgroundColor: '#F25D49',
    height: 50,
}
});
