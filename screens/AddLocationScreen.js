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
  Picker,
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
        cat: '',
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
  submitPress = (location, desc, lat, long, cat) => {
    //Check if parts of form are empty, alert user to complete form.
      if(!location || !desc || !lat || !long || !cat){
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
        const url = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/locationapi/addlocation";
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
                category: cat,
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
        this.setState({cat: clearState});
        this.setState({markerVisible: false});
        this.setState({markerLat: 0});
        this.setState({markerLong: 0});
        this.uploadLocationImage();
      }
  }
  uploadLocationImage = () => {
      console.log("Uploading default location image");
            const uploadLocationImageURL = "https://nodejs-mongo-persistent-nmchenry.cloudapps.unc.edu/imageapi/uploadlocationimage";
            fetch(uploadLocationImageURL, {
                   method: 'POST',
                   headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                     location: this.state.desc,
                     base64: GLOBAL.DEFAULTLOCATIONIMAGE,
                   })
              })
            .catch((error) => {
            console.log("Error in uploading user image: " + error.code + " USER IMAGE UPLOAD ERROR MESSAGE: " + error.message);
            })
  };
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

  render() {
    return (

      <View style={styles.container}>
        <Header><Text style={styles.getStartedText}>Add a location</Text></Header>
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
                 <Button block
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

            <Item style={styles.formText}>
              <Label style={styles.label}>Category: </Label>
              <Picker
                selectedValue={this.state.cat}
                style={{width: 200}}
                onValueChange={(itemValue, itemIndex) => this.setState({cat: itemValue})}>
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Nature" value="Nature" />
                <Picker.Item label="Landmark" value="Landmark" />
                <Picker.Item label="Entertainment" value="Entertainment" />
                <Picker.Item label="Shopping" value="Shopping" />
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Transportation" value="Transportation" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </Item>

            <Button block
              style={styles.mapButton}
              onPress={() => this.openModal()}>
                <Text style={styles.buttonText}>Select Location</Text>
            </Button>


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


            <Button block
              style={styles.submitButton}
              onPress={() => this.submitPress(
                this.state.location,
                this.state.desc,
                this.state.lat,
                this.state.long,
                this.state.cat,
              )}>
                <Text style={styles.buttonText}>SUBMIT</Text>
            </Button>

          </Form>
        </Content>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  formText: {

  },
  label: {
    fontSize: 15,
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
    flex: 8,
  },
  lowerModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  submitButton: {
    borderRadius: 0,
    backgroundColor: '#5E8DF7',
    height: 50,
  },
  mapButton: {
    borderRadius: 0,
    backgroundColor: '#5E8DF7',
    height: 50,
  },
  mapModalButton: {
    flex: 1,
    borderRadius: 0,
    backgroundColor: '#5E8DF7',
    height: 50,
  },
});
