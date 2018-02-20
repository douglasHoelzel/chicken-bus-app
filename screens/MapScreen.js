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
  static navigationOptions = {
    header: null,
  };
  
  fetchAllLocations = async () => {
        const response = await fetch("https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/alllocations");
        const json = await response.json();
        this.setState({ data: json });
        console.log("AJAX RETURNS: " , json);
    };

  render() {
      console.log("inside of render function");
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
