import React, { useEffect,useState } from "react";
import { TouchableWithoutFeedback, ScrollView, StyleSheet, Image, View, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";

import { Icon, Drawer as DrawerCustomItem } from '../components/';
import { Images, materialTheme } from "../constants/";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialIconsIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-community/async-storage";


function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const [user,setUser]=useState()
  const[screens,setScreens]=useState()
  const insets = useSafeArea();
  useEffect(()=>{

    async function fetchMyUser() {
     const user= await AsyncStorage.getItem('email')
      setUser(user)
      if(user)
      setScreens([
        "Home",
        "My Packages",
      ])

      else
      setScreens([
        "Home",
        'Login'
      ])
    }

    fetchMyUser()
  
  },[])


  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.25} style={styles.header}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Profile")}
        >
          <Block style={styles.profile}>
          <Text h5 color={"white"}>
            HELLO,
            </Text>
            <Text  color={"white"} style={{marginTop:10}}>
              {user?user:""}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
        
      </Block>

      <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
        <View
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === "left" ? insets.left : 0,
              paddingRight: drawerPosition === "right" ? insets.right : 0
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {screens?.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </View>
      </Block>
      
    </Block>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151f2b",
    elevation: 54,
    shadowOffset: {
      height: 9,
      width: 3
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.4,
    shadowRadius: 18,
  
  },
  header: {
    backgroundColor: "#151f2b",
    elevation: 54,
    shadowOffset: {
      height: 9,
      width: 3
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.4,
    shadowRadius: 18,
  
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: 'center',
    marginBottom: 20
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: 'flex-end'
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: 16,
  },
  button: {
    width: 228,
    height: 25
  },
  text4: {
    color: "#fefefe",
    fontSize: 18,
    lineHeight: 20,
    marginTop: 3,
    marginLeft: 43
  },
  icon4: {
    color: "#8899a6",
    fontSize: 25,
    marginTop: -3
  },
  rect8: {
    width: 137,
    height: 25
  },
  text5: {
    color: "#fefefe",
    fontSize: 18,
    lineHeight: 20,
    marginTop: 3,
    marginLeft: 43
  },
  icon5: {
    color: "#8899a6",
    fontSize: 25,
    marginTop: -3
  },
  rect9: {
    width: 137,
    height: 25
  },
  text6: {
    color: "#fefefe",
    fontSize: 18,
    lineHeight: 20,
    marginTop: 3,
    marginLeft: 43
  },
  icon6: {
    color: "#8899a6",
    fontSize: 25,
    marginTop: -3
  },
  rect10: {
    width: 137,
    height: 25
  },
  text7: {
    color: "#fefefe",
    fontSize: 18,
    lineHeight: 20,
    marginTop: 3,
    marginLeft: 43
  },
  icon7: {
    color: "#8899a6",
    fontSize: 25,
    marginTop: -3
  },
  container1: {
    justifyContent: "space-around",
  },
 
});

export default CustomDrawerContent;
