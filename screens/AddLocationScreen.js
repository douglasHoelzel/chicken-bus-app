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

  submitPress = (location, desc, lat, long) => {
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
        }).then(response => console.log(response));

      }
  }

  testSubmit = (location, desc, lat, long) => {
    if(!location || !desc || !lat || !long){
      console.log("Please Complete All Parts Of Form");
    }
    else{
      console.log(location, desc, lat, long);
    }
  }


  render() {
    return (
      //The following is Avery testing native-base for form building
      <Container style={styles.container}>
        <Header><Text>Add Location Form</Text></Header>
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
                <Text>Submit</Text>
            </Button>

          </Form>
        </Content>
      </Container>



      //The Below is Old Code, I'm testing above

      // <View style={styles.container}>
      //       <Text style={styles.getStartedText}>
      //         Add Location Page
      //       </Text>
      //       <Text style={styles.getStartedText}>
      //         Currently being edited by Avery
      //       </Text>
      //     </View>


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
  },
  submitButton: {
    alignSelf: 'center',
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
    marginTop: 30,
    lineHeight: 24,

  }
});
