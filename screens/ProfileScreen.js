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
  TextInput
} from 'react-native';
import { Button, List, ListItem } from 'native-base';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Modal from "react-native-modal";
import { ImagePicker } from 'expo';
GLOBAL = require('./Global.js');


{/* Notes:
    In here we will display all pulled data from the individual logged in user

*/}

export default class SettingsScreen extends React.Component {

static navigationOptions = {
    header: null,
};
constructor(props){
      super(props);
      this.state = {
          testUserImage: require('../assets/images/testUserImage.png'),
          isUserNameModalVisible: false,
          newUserName: '',
          image: null,
      };
}
componentWillMount(){
}

toggleUserNameModal = () => {
      this.setState({ isUserNameModalVisible: !this.state.isUserNameModalVisible });
}

onChangeUserNamePress = (newUserName) => {
    if(newUserName === ''){
          Alert.alert("Enter a new user name");
    }
    else{
      console.log("Chaning user name to: " + newUserName);
      this.toggleUserNameModal();
      this.setState({newUserName: ''});
   }
};
selectPhotoTapped = async () => {
    console.log("Add Photo Button Clicked");

   let result = await ImagePicker.launchImageLibraryAsync({
     allowsEditing: true,
     aspect: [4, 3],
   });

   console.log(result);

   if (!result.cancelled) {
     this.setState({ image: result.uri });
   }
 };


addPicturePress = () => {
    console.log("CLicked add picture");

}
render() {
    let { image } = this.state;
  return (
      <View style={styles.container}>
      <ScrollView>
      <Text style={styles.profileHeader}>{GLOBAL.USERNAME} </Text>
          <List>
              <ListItem >
                  <Image style={styles.profileImage}
                  source={this.state.testUserImage}
                  />
              {/* Add Photo Button */}
              <TouchableOpacity style={styles.addPhotoButton}  onPress={this.selectPhotoTapped.bind(this)}>
                  <Image style={styles.plusSignIcon} source={require('../assets/images/plusSignIcon.png')}/>
              </TouchableOpacity>


              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
         {/* Change User Name Button */}
         <Button block style={styles.backButton}
          onPress={() => this.toggleUserNameModal()}>
             <Text style={styles.changeUserNameButtonText}>Change User Name</Text>
         </Button>
    </ScrollView>



    {/* Create Account Modal */}
    <Modal style={styles.modal} isVisible={this.state.isUserNameModalVisible}>
      <ScrollView>
      <View style={{width: 372}}>
      {/* Modal Header */}
      <Text style={styles.detailsHeader}>Change your user name </Text>
      {/* Modal User Name Field */}
      <View style={styles.userNameContainer}>
          <Text style={styles.currentUserName}>Current User Name: </Text>
          <Text style={styles.userNameText}>{GLOBAL.USERNAME}</Text>
          <TextInput
              style={{height: 50,
                  paddingLeft: 10,
                  marginLeft: 20,
                  marginBottom: 10,
                  backgroundColor: '#E4E4E4',
                  borderRadius: 6}}
              placeholder="New user name"
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
    marginLeft: 40
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
}
});
