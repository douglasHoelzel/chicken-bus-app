import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button
} from 'native-base';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class AddLocation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        location: '',
        desc: '',
        lat: '',
        long: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

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

      }
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
      //The following is native-base to create the form itself, written by Avery
      <Container style={styles.container}>
        <Header><Text style={styles.getStartedText}>Add Location Form</Text></Header>
        <Content>
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
      </Container>

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
  formText: {
    alignSelf: 'center',
  },
  label: {
    textAlign: 'center',
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
  }
});
