import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import NeumorphismButton from '../components/NeuromorphismButton';
const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default class Onboarding extends React.Component {
  async componentDidMount(){
    console.log("user",await AsyncStorage.getItem('user'))
  }
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex center>
          <ImageBackground
            source={{ uri: Images.Onboarding }}
            style={{ height: height, width: width, marginTop: '0%', zIndex: 1 }}
          />
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 2 }}>
            <Block>
              <Block>
                <Text color="white" size={60}>SKYLINE</Text>
              </Block>
              <Text size={16} color='rgba(255,255,255,0.6)'>
                Be at Pleasure from Our Service.
              </Text>
            </Block>
            <Block center>
              <TouchableOpacity style={styles.container1} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.text2}> GET STARTED</Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(21,31,40,1)"

  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: theme.SIZES.BASE,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  container1: {
    backgroundColor: "rgba(29,161,242,1)",
    borderRadius: 100,
    width: width/1.2,
    height: height/15,
    justifyContent: "center"
  },
  text2: {
    color: "rgba(255,255,255,1)",
    fontSize: width/25,
    fontWeight:"bold",
    alignSelf: "center"
  }
});