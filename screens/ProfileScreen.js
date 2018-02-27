import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  View,
  Alert,
  TextInput
} from 'react-native';
import { Button, List, ListItem } from 'native-base';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Modal from "react-native-modal";
GLOBAL = require('./Global.js');


{/* Notes:
    In here we will display all pulled data from the individual logged in user
    Make ajax call to change user name

    Bug: Profile picture won't show on iPhone when scanning the published QR code
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

render() {
  return (
      <View style={styles.container}>
      <ScrollView>
      <Text style={styles.profileHeader}>{GLOBAL.USERNAME} </Text>
          <List>
              <ListItem >
                  <Image style={styles.profileImage}
                  source={this.state.testUserImage}
                  />
              </ListItem>
              <ListItem>
                <Text>Email: {GLOBAL.EMAIL}</Text>
              </ListItem>
              <ListItem>
                <Text>Reputation: Power Adder </Text>
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
      {/* Modal Email */}
      <View style={styles.userNameContainer}>
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
          <Text style={styles.changeUserNameButtonText}>Change User Name</Text>
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
  marginTop: 300,
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
}
});
