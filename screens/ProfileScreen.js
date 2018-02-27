import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, List, ListItem } from 'native-base';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';


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
          testUserImage: require('../assets/images/testUserImage.png')
      };
  }
  
  render() {
    return (
      <View style={styles.container}>
      <ScrollView>
      <Text style={styles.profileHeader}>UserName </Text>
          <List>
              <ListItem >
                  <Image style={styles.profileImage}
                  source={require('../assets/images/testUserImage.png')}
                  />
              </ListItem>
              <ListItem >
                <Text>Name: John Doe </Text>
              </ListItem>
              <ListItem>
                <Text>Email: testemail@gmail.com</Text>
              </ListItem>
              <ListItem>
                <Text>Reputation: Power Adder </Text>
              </ListItem>
              <ListItem>
                <Text>Locations Added:  11 </Text>
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
    </ScrollView>
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
    backgroundColor: '#5E8DF7',
    height: 60,
    fontSize: 25,
    fontWeight: 'bold',
    color: "#fff"
},
profileImage:{
    height: 300,
    width: 300,
    marginLeft: 40
}
});
