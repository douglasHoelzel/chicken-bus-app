import React from 'react';
import {
  Image,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MapView } from 'expo';
import { Marker, Callout } from 'expo';
import { Button, List, ListItem } from 'native-base';
import Modal from "react-native-modal";


export default class MapScreen extends React.Component {
    
constructor(props){
    super(props);
    this.state = {  
        markers: [] ,
        isModalVisible: false
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
toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
}   
likePress(){
   Alert.alert('Like Clicked');
}
dislikePress(){
    Alert.alert('Dislike Clicked');
}

  render() {
    return (
      <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Map
            </Text>
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
                  onCalloutPress={this.toggleModal}
                  />
                  ))}
              </MapView>
              
              <Modal style={styles.modal}
                isVisible={this.state.isModalVisible}>
                <ScrollView>
              <View style={{width: 372}}>
                <Text style={styles.detailsHeader}>Details </Text>
 
                    <List>
                        <ListItem >
                          <Text>Name: Buns </Text>
                        </ListItem>
                        <ListItem>
                          <Text>Description: Hamburger Restaurant</Text>
                        </ListItem>
                        <ListItem>
                          <Text>Town: Chapel Hill </Text>
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
                    <TouchableOpacity onPress={this.likePress}> 
                        <Text style={styles.thumbsIconText}><Image style={styles.thumbsUpIcon} source={require('../assets/images/thumbsUpIcon.png')}/> 9 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.dislikePress}>
                        <Text style={styles.thumbsIconText}><Image style={styles.thumbsDownIcon} source={require('../assets/images/thumbsDownIcon.png')}/> 2 </Text>
                    </TouchableOpacity>
                    </View>

                <Button block style={styles.backButton}
                    onPress={this.toggleModal}>
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
    marginLeft: 10,
},
thumbsDownIcon:{
    width: 20,
    height: 20,
    marginLeft: 10,
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
}
});
