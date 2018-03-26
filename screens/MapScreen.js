import React from 'react';
import {
  Image, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated
} from 'react-native';
import { WebBrowser } from 'expo';
import { MapView } from 'expo';
import { Marker, Callout } from 'expo';
import { Button, List, ListItem, Header, Left, Body, Right, Icon, Title} from 'native-base';
import Modal from "react-native-modal";
import AwesomeAlert from 'react-native-awesome-alerts';
import { createStore } from 'redux';

GLOBAL = require('./Global.js');
{/* Notes:

*/}
var imageMap = {
  'Food' : require('../assets/images/redMarker.png'),
  'Landmark': require('../assets/images/blueMarker.png'),
  'Other': require('../assets/images/orangeMarker.png'),
  'Nature': require('../assets/images/greenMarker.png'),
  'Entertainment': require('../assets/images/lightBlueMarker.png'),
  'Shopping': require('../assets/images/purpleMarker.png'),
  'Transportation': require('../assets/images/yellowMarker.png')
}
export default class MapScreen extends React.Component {
constructor(props){
    super(props);
    this.state = {
        markers: [],
        isButtonDisabled: false,
        isMainModalVisible: false,
        showAlert: false,
        tempLocation: [],
    };
}

static navigationOptions = {
    header: null,
};

componentWillMount(){
        this.getAllLocations();
}
getAllLocations = async () => {
    const response = await fetch("https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/locationapi/alllocations");
    const json = await response.json();
    this.setState({ markers: json.doc });
};
getSingleLocation = async (location) => {
    const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/locationapi/getlocation/" + location;
    const response = await fetch(url);
    const json = await response.json();
    this.setState({ tempLocation: json.doc });
};
toggleMainModal = (location) => {
    this.setState({ isMainModalVisible: !this.state.isMainModalVisible });
    this.getSingleLocation(location);
}
toggleMainModalNoAjax = (location) => {
    this.setState({ isMainModalVisible: !this.state.isMainModalVisible });
    this.setState({ isButtonDisabled: false});
}
showAlert = () => {
    this.setState({
      showAlert: true
    });
};
userButtonPress = () => {
    this.props.navigation.navigate('Profile');
};
filterButtonPress = () => {
    Alert.alert("Filter Button Pressed");
};
hideAlert = () => {
    this.setState({
      showAlert: false
    });
};
likePress = (location, choice) => {
   const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/locationapi/updatelikes";
   fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: choice,
            title: location,
          })
        });
   if(GLOBAL.ISLOGGEDIN){
   const url2 = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/locationapi/updatelikedlocation";
   fetch(url2, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: GLOBAL.USERID,
            title: location,
          })
        });
    }
   this.setState({ isButtonDisabled: true});
   this.showAlert();
}
  render() {
    return (
      <View style={styles.container}>
            {/* Header */}
            <Header>
                <Left>
                    <TouchableOpacity onPress={() => this.filterButtonPress()}>
                        <Text>Filter</Text>
                    </TouchableOpacity>
                </Left>
                <Right>
                        <TouchableOpacity style={styles.userButton} onPress={() => this.userButtonPress()}>
                           <Icon style={styles.userButtonIcon} name='person'/>
                        </TouchableOpacity>
                </Right>
            </Header>

            {/* Map */}
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 35.889942,
                  longitude: -78.862621,
                  latitudeDelta: 1,
                  longitudeDelta: 1,
                }}>
                  {this.state.markers.map(marker => (
                  <MapView.Marker
                  coordinate={{
                  latitude: marker.latitude,
                  longitude:  marker.longitude}}
                  title={marker.title}
                  description={marker.description}
                  key={marker._id}
                  onCalloutPress={() => this.toggleMainModal(marker.title)}>
                  <Image source={imageMap[marker.category]}
                   style={styles.markers}/>
                  </MapView.Marker>
                  ))}
              </MapView>

              <Modal style={styles.modal}
                isVisible={this.state.isMainModalVisible}>
                <ScrollView>
              <View style={{width: 372}}>
                <Text style={styles.detailsHeader}>Details </Text>

                    <List>
                        <ListItem >
                          <Text>Name: {this.state.tempLocation.title} </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Description: {this.state.tempLocation.description}</Text>
                        </ListItem>
                        <ListItem>
                          <Text>Category: {this.state.tempLocation.category} </Text>
                        </ListItem>
                        <ListItem>
                          <Text>City: Chapel Hill </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Times Visited:  847 </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Comments:  Comments can go here </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Placeholder: Some other data can go here </Text>
                        </ListItem>
                   </List>
                   <View style={styles.rowContainer}>
                    <TouchableOpacity style={styles.thumbButtonOpacityLeft} onPress={() => this.likePress(this.state.tempLocation.title, "like")} disabled={this.state.isButtonDisabled}>
                        <Text style={styles.thumbsIconTextLeft}>  {this.state.tempLocation.likes} </Text>
                        <Image style={styles.thumbsUpIcon} source={require('../assets/images/thumbsUpIcon.png')}/>
                    </TouchableOpacity>
                    <View style={styles.likeImageBuffer}></View>
                    <TouchableOpacity style={styles.thumbButtonOpacityRight}  onPress={() => this.likePress(this.state.tempLocation.title, "dislike")} disabled={this.state.isButtonDisabled}>
                        <Text style={styles.thumbsIconTextRight}>{this.state.tempLocation.dislikes} </Text>
                        <Image style={styles.thumbsDownIcon} source={require('../assets/images/thumbsDownIcon.png')}/>

                    </TouchableOpacity>
                    </View>

                    <Button block style={styles.backButton}
                        onPress={this.toggleMainModalNoAjax}>
                        <Text style={styles.backButtonText}>Back</Text>
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
getStartedText: {
    fontSize: 20,
    color: 'rgba(96,100,109, 1)',
    marginTop: 30,
    lineHeight: 24,
    textAlign: 'center',
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
rowContainer:{
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
    flexDirection: 'row'
},
thumbsIconTextLeft: {
    fontWeight: 'bold',
    fontSize:  21,
    color: '#4B4B4B',
    paddingLeft: 18,
},
thumbsIconTextRight: {
    fontWeight: 'bold',
    fontSize:  21,
    color: '#4B4B4B',
    paddingLeft: 30,
    marginTop: -3,
},
thumbsUpIcon:{
    width: 20,
    height: 20,
    marginTop: -23,
},
thumbsDownIcon:{
    width: 20,
    height: 20,
    marginTop: -23,
},
likeImageBuffer:{
    marginLeft: 20,
    marginRight: 20,
},
modal: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
},
backButton: {
  borderRadius: 0,
  backgroundColor: '#5E8DF7',
  height: 50,
},
backButtonText: {
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize:  18,
},
thumbButtonOpacityLeft:{
    height: 70,
    width: 70,
    borderRadius: 40,
    paddingTop: 22,
    paddingLeft: 9,
    position: 'relative',
    backgroundColor: '#F1F1F1'
},
thumbButtonOpacityRight:{
    height: 70,
    width: 70,
    borderRadius: 40,
    paddingTop: 26,
    paddingLeft: 11,
    position: 'relative',
    backgroundColor: '#F1F1F1'
},
markers:{
    height: 30,
    width: 30,
    position: 'relative',
},
userButton:{
    backgroundColor: '#DDDDDD',
    borderRadius: 90,
    height: 40,
    width: 40
},
userButtonIcon:{
    marginLeft: 10,
    marginTop: 4,
    position: 'relative'
}
});
