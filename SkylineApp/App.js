/*!

 =========================================================
 * Material Kit React Native - v1.4.0
 =========================================================
 * Product Page: https://demos.creative-tim.com/material-kit-react-native/
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-kit-react-native/blob/master/LICENSE)
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useEffect, useRef } from 'react';
import { Platform, StatusBar, Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import { Images, products, materialTheme } from './constants/';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import Screens from './navigation/Screens';
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';
import  Constants  from 'expo-constants';
import { useState } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Axios from 'axios';
import { addPushTokenListener } from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage';
enableScreens();

// cache app images
const assetImages = [
  Images.Pro,
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
];

// cache product images
products.map(product => assetImages.push(product.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App(props){


 
  const[isLoadingComplete,setIsLoadingComplete]=useState()

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    registerForPushNotificationsAsync().then(token =>{
        setExpoPushToken(token)}
      );

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

    if (isLoadingComplete && !props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={_loadResourcesAsync}
          onError={_handleLoadingError}
          onFinish={_handleFinishLoading}
        />
      );
    } else {
      return (
        <NavigationContainer>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <Screens />
            </Block>
          </GalioProvider>
        </NavigationContainer>
      );
    }
  

 const _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

 const _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

 const _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    AsyncStorage.setItem("token",token)
    
    Axios({
      method:"POST",
      url:"http://65.1.131.197:3000/api/token/token_add",
      data:{
         token:token
      }
    }).then(response=>{
     console.log("Token Registered")
     })
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
}