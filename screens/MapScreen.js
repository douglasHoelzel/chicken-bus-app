import React from 'react';
import {
  Image, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MapView } from 'expo';
import { Marker, Callout } from 'expo';
import { Button, List, ListItem } from 'native-base';
import Modal from "react-native-modal";

{/* Notes:
    Like and dislike need update ajax calls,
    You need a get ajax call for a single object given a title,
    If time: animation on like, make a cusom modal popup
    
    Later:
    Custom modal for like / dislike (cool animation)
    Fix spacing between like / dislike buttons
    Share on facebook button
    
    Other: 
    API key for Google geocoding: AIzaSyBF6LAi7J1sHx6Xsd5m-praYGy6Ys6R0eI
*/}
export default class MapScreen extends React.Component {
    
constructor(props){
    super(props);
    this.state = {  
        markers: [],
        isButtonDisabled: false,
        isMainModalVisible: false,
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
    const response = await fetch("https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/alllocations");
    const json = await response.json();
    this.setState({ markers: json.doc });
};
getSingleLocation = async (location) => {
    const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/getlocation/" + location;
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
}   
likePress = (location) => {
   const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/updatelikes";
   Alert.alert('Like Added');
   fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'like',
            title: location,
          })
        });
   this.setState({ isButtonDisabled: true});
}
dislikePress = (location) => {
    const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/updatelikes";
    Alert.alert('Dislike Added');
    fetch(url, {
           method: 'POST',
           headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             type: 'dislike',
             title: location,
           })
         });
    this.setState({ isButtonDisabled: true});
}

  render() {
    return (
      <View style={styles.container}>
            <Text style={styles.getStartedText}> Map </Text>
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
                  onCalloutPress={() => this.toggleMainModal(marker.title)}
                  />
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
                          <Text>City: Chapel Hill </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Times Visited:  847 </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Comments:  Comments can go here, they might be long and overflow </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Placeholder: Data can go here </Text>
                        </ListItem>
                   </List>
                   <View style={styles.rowContainer}>
                    <TouchableOpacity onPress={() => this.likePress(this.state.tempLocation.title)} disabled={this.state.isButtonDisabled}> 
                        <Text style={styles.thumbsIconText}>
                            <Image style={styles.thumbsUpIcon} source={require('../assets/images/thumbsUpIcon.png')}/> 
                            {this.state.tempLocation.likes} </Text>
                    </TouchableOpacity>
                    <View style={styles.likeImageBuffer}></View>
                    <TouchableOpacity onPress={() => this.dislikePress(this.state.tempLocation.title)} disabled={this.state.isButtonDisabled}>
                        <Text style={styles.thumbsIconText}>
                        <Image style={styles.thumbsDownIcon} source={require('../assets/images/thumbsDownIcon.png')}/>
                         {this.state.tempLocation.dislikes} </Text>
                    </TouchableOpacity>
                    </View>

                    <Button block style={styles.backButton} 
                        onPress={this.toggleMainModalNoAjax}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Button>
              </View>
              </ScrollView>
              </Modal>
              <Modal style={styles.likeModal}
                isVisible={this.state.isLikeModalVisible}>
                <Text> Like Modal </Text>
 
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
thumbsIconText: {
    fontWeight: 'bold',
    fontSize:  21,
    color: '#4B4B4B',
    paddingLeft: 10,
},
thumbsUpIcon:{
    width: 20,
    height: 20,
},
thumbsDownIcon:{
    width: 20,
    height: 20,
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
likeModal:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2BD228',
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
}
});
