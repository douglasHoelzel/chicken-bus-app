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
import { WebBrowser } from 'expo';
import { MapView } from 'expo';

export default class MapScreen extends React.Component {
constructor(props){
    super(props);
    this.state = {
        rovers: [],
        data: []
    }
}


  static navigationOptions = {
    header: null,
  };

  componentWillMount(){
        this.fetchAllLocations();
        this.getRovers();

  }
  getRovers = async () =>{
      var url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/alllocations";
      return fetch(url).then((res) => res.json());
      this.setState({ rovers: res.rovers});
      console.log("inside of rovers function");
  };
  fetchAllLocations = async () => {
        const response = await fetch("https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/alllocations");
        const json = await response.json();
        this.setState({ data: json });
    };

  render() {
      console.log("Data[]: " , this.state.data);
      console.log("Rovers[]: " , this.state.rovers);
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
                }}
                />
                  {/*{this.state.data.map(marker => (
                  <Marker
                  coordinate={{
                  latitude: marker.latitude,
                  longitude:  marker.longitude}}
                  title={marker.title}
                  description={marker.description}
                  onCalloutPress={this.toggleModal}
                  />
                  ))}
              </MapView>*/}
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
  }
});
