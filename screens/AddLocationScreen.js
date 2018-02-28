import React, { Component } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Form,
  Header,
  Item,
  Input,
  Label,
} from 'native-base';
import { MapView } from 'expo';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';

export default class AddLocation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        markers: [],
        modalVisible: false,
        markerVisible: false,
        location: '',
        desc: '',
        lat: '',
        long: '',
        markerLat: 0,
        markerLong: 0,
    };
  }

  static navigationOptions = {
    header: null,
  };

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

//Takes input from form, sends to api
  submitPress = (location, desc, lat, long) => {
    //Check if parts of form are empty, alert user to complete form.
      if(!location || !desc || !lat || !long){
        console.log("Please fill out entire form before submitting.")
        Alert.alert(
          'Form Incomplete',
          'Please complete form before submitting.',
          [
            {text: 'OK', onPress: () => console.log('OK pressed')},
          ],
        )
      }
      else{
        //If form is complete, send post to api
        const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/api/addlocation";
        fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: location,
                description: desc,
                latitude: lat,
                longitude: long,
                category: 'purpleMarker'
              })
        }).then(response => {
          //if response is 200 (success), alert user and log response
          if(response.status === 200) {
            Alert.alert(
              'SUBMISSION SUCCESSFUL',
              'Thank you for your submission!',
              [
                {text: 'OK', onPress: () => console.log('OK pressed')},
              ],
            )
              console.log("The Submission Was Successful");
          }
          //if response is status 400 (key not unique), alert user location exists and log response
          else if(response.status === 400){
            Alert.alert(
              'SUBMISSION FAILED',
              'A location with this name has already been added!',
              [
                {text: 'OK', onPress: () => console.log('OK pressed')},
              ],
            )
              console.log("An Error Has Occurred: Duplicate Key Error");

          }
          //if any other response is received, alert user something went wrong and log response
          else{
            Alert.alert(
              'SUBMISSION FAILED',
              'Unfortunately, we cannot accept this submission at this time.',
              [
                {text: 'OK', onPress: () => console.log('OK pressed')},
              ],
            )
              console.log("An Unknown Error Has Occurred");
          }
          console.log("Response status: " + response.status)

        }).catch(err => {
          //for if something goes wrong contacting the api
          Alert.alert(
            'UNABLE TO SUBMIT',
            'Something is preventing submission. Please try again later.',
            [
              {text: 'OK', onPress: () => console.log('OK pressed')},
            ],
          )
          console.log(err);
        });
        clearState = '';
        this.setState({location: clearState});
        this.setState({desc: clearState});
        this.setState({lat: clearState});
        this.setState({long: clearState});
        this.setState({markerVisible: false});
        this.setState({markerLat: 0});
        this.setState({markerLong: 0});

      }
  }

  mapPress = (event) => {
    console.log("Latitude: " + event.nativeEvent.coordinate.latitude
     + " Longitude: " + event.nativeEvent.coordinate.longitude);
     elat = event.nativeEvent.coordinate.latitude;
     this.setState({markerLat: elat});
     elat = elat.toString();
     elon = event.nativeEvent.coordinate.longitude;
     this.setState({markerLong: elon});
     elon = elon.toString();
     this.setState({markerVisible: true});
     this.setState({lat: elat});
     this.setState({long: elon});
  }

//the following code was used to test the form before testing it with the api
//It is no longer necessary, but left here for documentation purposes.
  // testSubmit = (location, desc, lat, long) => {
  //   if(!location || !desc || !lat || !long){
  //     console.log("Please Complete All Parts Of Form");
  //   }
  //   else{
  //     console.log(location, desc, lat, long);
  //   }
  // }


  render() {
    return (

      <View style={styles.container}>
        <Header><Text style={styles.getStartedText}>Add Location Form</Text></Header>
        <Content>
          <Modal
               visible={this.state.modalVisible}
               animationType={'slide'}
               onRequestClose={() => this.closeModal()}
           >
             <View style={styles.modalContainer}>
               <View style={styles.upperModalContainer}>
                 <MapView
                     style={{ flex: 1 }}
                     initialRegion={{
                       latitude: 35.889942,
                       longitude: -78.862621,
                       latitudeDelta: 1,
                       longitudeDelta: 1,
                     }}
                     onPress = {(event) => this.mapPress(event)}>

                     <MapView.Marker
                     visible={this.state.markerVisible}
                     coordinate={{
                     latitude: this.state.markerLat,
                     longitude: this.state.markerLong}}
                     />

                  </MapView>
               </View>
               <View style={styles.lowerModalContainer}>
                 <Text>Press on map to select location, then press DONE below.</Text>
                 <Text>You have selected the following values:</Text>
                 <Text>Latitude: {this.state.lat.toString()}</Text>
                 <Text>Longitude: {this.state.long.toString()}</Text>
                 <Button info
                   style={styles.mapModalButton}
                   onPress={() => this.closeModal()}>
                     <Text style={styles.buttonText}>DONE</Text>
                 </Button>
               </View>
             </View>
           </Modal>

          <Form>

            <Item style={styles.formText}>
              <Label style={styles.label}>Title: </Label>
              <Input
                value={this.state.location}
                onChangeText={(l) => this.setState({location: l})}
              />
            </Item>


            <Item style={styles.formText}>
              <Label style={styles.label}>Description: </Label>
              <Input
                value={this.state.desc}
                onChangeText={(d) => this.setState({desc: d})}
              />
            </Item>


            <Button info
              style={styles.mapButton}
              onPress={() => this.openModal()}>
                <Text style={styles.buttonText}>MAP</Text>
            </Button>

            <Item style={styles.infoLabel}>
              <Label style={styles.infoLabelText}>Select Latitude and Longitude with button above or input manually below.</Label>
            </Item>


            <Item style={styles.formText}>
              <Label style={styles.label}>Latitude: </Label>
              <Input
                value={this.state.lat}
                onChangeText={(la) => this.setState({lat: la})}
              />
            </Item>


            <Item style={styles.formText}>
              <Label style={styles.label}>Longitude: </Label>
              <Input
                value={this.state.long}
                onChangeText={(lo) => this.setState({long: lo})}
              />
            </Item>


            <Button info
              style={styles.submitButton}
              onPress={() => this.submitPress(
                this.state.location,
                this.state.desc,
                this.state.lat,
                this.state.long
              )}>
                <Text style={styles.buttonText}>SUBMIT</Text>
            </Button>

          </Form>
        </Content>

      </View>



      //The following is native-base to create the form itself, written by Avery
      // <Container style={styles.container}>
      // </Container>

    );
  }
}

      //Comment code below is the previous AddLocation.js code, current code is above.
      //This is left here for documentation purposes only.

      // <View style={styles.container}>
      //       <Text style={styles.getStartedText}>
      //         Add Location Page
      //       </Text>
      //       <Text style={styles.getStartedText}>
      //         Currently being edited by Avery
      //       </Text>
      //     </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
  },
  submitButton: {
    alignSelf: 'center',
    marginTop: 30,
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButton: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30,
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapModalButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formText: {
    alignSelf: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 15,
  },
  infoLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabelText: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
  },
  getStartedText: {
    fontSize: 20,
    color: 'rgba(96,100,109, 1)',
    marginTop: 20,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  upperModalContainer: {
    flex: 3,
  },
  lowerModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c1f0ff',
  },
});
