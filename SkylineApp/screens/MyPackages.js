import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, Image ,FlatList,ActivityIndicator, View} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import Carousel from 'react-native-snap-carousel';
import { Icon, Product } from '../components/';
import Axios from 'axios';
const { width } = Dimensions.get('screen');
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import { HeaderHeight } from "../constants/utils";
import { Images, materialTheme } from '../constants';
import { Snackbar, Dialog, Portal,Paragraph ,Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {  TouchableOpacity } from 'react-native-gesture-handler';
import { isLoaded } from 'expo-font';

const height = Dimensions.get('window').height
const thumbMeasure = (width - 48 - 32) / 3;


export default class MyPackages extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      isLoaded: false,
      isSuccess: false,
      visible:false,
      elementData:{},
    }
  }


  async componentDidMount() {
    const userId=await AsyncStorage.getItem('user')
    const response = await fetch(`http://65.1.131.197:3000/api/sellvoucher/sell_voucher_mobile_list/${userId}`);
    const json = await response.json();
    this.setState({ packages: json.voucher, isLoaded: true });
  }

   showDialog = (ele) => {
     this.setState({elementData:ele.element},()=>{
        this.setState({visible:true})
   })

    }

   hideDialog = () => this.setState({visible:false})

   handleSellVoucher = async (id) => {
     this.setState({isLoaded:false},() => {
      Axios.get(`http://65.1.131.197:3000/api/sellvoucher/mobile_user_sellvoucher/${id}`)
      .then((response) => {
        this.setState({isLoaded:true})
        this.props.navigation.navigate('UserPackage',{voucher:JSON.stringify(response.data),name:"akshat"})
      })
      .catch(function (error) {
        console.log(error);
      });
    
  })
    
    
  };

  

  renderSearch = () => {
    const { navigation } = this.props;
    const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconCamera}
        placeholder="What are you looking for?"
        onFocus={() => navigation.navigate('Pro')}
      />
    )
  }

  renderTabs = () => {
    const { navigation } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Categories</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Best Deals</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderProducts = ({ item, index }) => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          <Block flex row>
            <Card style={{ borderRadius: 20 }}>
              <CardImage
                style={{ height: height / 3 }}
                source={{ uri: `http://65.1.131.197:3000/${item.package?.filepath}` }}
              />
              <CardTitle
                title={item.package?.packageName}
                subtitle={item.package?.packageRemarks}
              />



                <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                  <Block row space="around" style={{ flexWrap: 'wrap' }} >

                  {item.package?.Element?.map((ele, eleIndex) => (
                      <TouchableOpacity onPress={()=>this.showDialog(ele)}>
                        <Image
                          source={{ uri: `http://65.1.131.197:3000/${ele.element.filepath}` }}
                          key={`viewed-http://65.1.131.197:3000/${ele.element.filepath}`}
                          resizeMode="cover"
                          style={styles.thumb}
                        />
                      </TouchableOpacity>
                    ))}
                  </Block>
                </Block>
              <CardAction
                separator={true}
                inColumn={true}>


                <Button  style={styles.tab} onPress={() => this.handleSellVoucher(item._id)} >
                  <Block row middle >
                    <Text size={16} style={styles.tabTitle}>SHOW COUPONS</Text>
                  </Block>
                </Button>
              </CardAction>

            </Card>

          </Block>
        </Block>
      </ScrollView>

    )
  }


  render() {



    return (
      <PaperProvider style={styles.provider}>
        <Snackbar style={styles.snackbar}
          visible={this.state.isSuccess}
          onDismiss={() => this.setState({ isSuccess: false })}
          action={{ label: "close", onPress: () => this.setState({ isSuccess: false }) }}>
          <Text>{this.state.successText}</Text>
        </Snackbar>

          <Portal>
           <Dialog visible={this.state.visible} onDismiss={this.hideDialog}>
            <Dialog.Title>{this.state.elementData?.name}</Dialog.Title>
            <Dialog.Content>
            <Image
                source={{ uri: `http://65.1.131.197:3000/${this.state.elementData.filepath}` }}
                resizeMode="cover"
                style={styles.thumb}
              />

              <Paragraph>{this.state.elementData.remarks}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.hideDialog}>CLOSE</Button>
            </Dialog.Actions>
           </Dialog>
          </Portal>

         <Block flex center style={styles.home}>
           {!this.state.isLoaded?
           <View style={{marginTop:height/3}}>
         <ActivityIndicator size="large" color="#00ff00" style={{fontSize:1000}} />
         </View>:
  
          <Carousel
            layout="default"
            ref={(c) => { this._carousel = c; }}
            data={this.state.packages}
            renderItem={this.renderProducts}
            sliderWidth={width}
            itemWidth={(width * 92) / 100}
          />
           }
        </Block>

        </PaperProvider>


    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: "rgba(20,31,40,1)",
  },
  provider:{
    alignItems:"center",
    justifyContent:"center",
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 5,
    padding: 25,
    margin: 20,
    borderWidth: 1,
    height: 24,
    elevation: 0,
    marginLeft: width / 5
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
    margin: 3
  },
  snackbar: {
    borderRadius: 20,
    fontSize: 10,
    marginBottom:height-95
  }
});
