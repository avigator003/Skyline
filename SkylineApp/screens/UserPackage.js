import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, TextInput,Alert } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import Carousel from 'react-native-snap-carousel';
import { Icon, Product } from '../components/';
import Axios from 'axios';
const { width } = Dimensions.get('screen');
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import { HeaderHeight } from "../constants/utils";
import { Images, materialTheme } from '../constants';
import { Snackbar, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CircularSlider } from 'react-native-elements-universe';


const height = Dimensions.get('window').height
const thumbMeasure = (width - 48 - 32) / 3;




export default class UserPackage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      isLoaded: false,
      isSuccess: false,
      visible: false,
      elementData: {},
      user: "",
      sellvoucherid: "",
      quantity: 0
    }
  }

  async componentDidMount() {
    const voucher = JSON.parse(this.props.route?.params.voucher)
    this.setState({ packages: voucher.package.userpackage[0], isLoaded: true, sellvoucherid: voucher.package.userpackage[0].id });
  }

  showDialog = (ele) => {
    this.setState({ elementData: ele.element }, () => {
      this.setState({ visible: true })
    })

  }


  hideDialog = () => this.setState({ visible: false })

  handleSellVoucher = async (id) => {
    Axios.post(`http://65.1.131.197:3000/api/user/mobile_send_otp/${id}`, {
      sellvoucherid: this.state.sellvoucherid,
      quantity: this.state.quantity,
      token:await AsyncStorage.getItem("token")
    })
      .then((response) => {
        Alert.alert(JSON.stringify(response.data.message));
       
      })
      .catch(function (error) {
        console.log(error);
      });
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
                source={{ uri: `http://65.1.131.197:3000/${item.element?.filepath}` }}
              />
              <CardTitle
                title={item.element?.name}
                subtitle={item.element?.packageRemarks}
              />
              <Text style={{ margin: width / 20, fontSize: width / 20, marginTop: width / 60 }}>Quantity : {item.quantity}</Text>
              <TextInput
                 style={{ 
                  height: height/20,
                  width:width/2, 
                  borderColor: 'gray', 
                  borderWidth: 1,
                  placeholderTextColor: 'gray',
                  borderRadius:10,
                  margin:10,padding:10
                }}
                placeholder="Number of Coupon to Use"
                keyboardType='numeric'
                onChangeText={(value) => this.setState({quantity:value})}
                value={this.state.quantity}
                maxLength={10}  //setting limit of input
              />
              <CardAction
                separator={true}
                inColumn={true}>
                <Button shadowless style={styles.tab} onPress={() => this.handleSellVoucher(item.element?._id)} >
                  <Block row middle >
                    <Text size={16} style={styles.tabTitle}>USE COUPON</Text>
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
              <Paragraph>{this.state.elementData.remarks}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.hideDialog}>CLOSE</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Block flex center style={styles.home}>
          <Carousel
            layout="default"
            ref={(c) => { this._carousel = c; }}
            data={this.state.packages.coupon}
            renderItem={this.renderProducts}
            sliderWidth={width}
            itemWidth={(width * 92) / 100}
          />
        </Block>

      </PaperProvider>


    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: "#2E2E3D",
    marginTop: Platform.OS === 'android' ? HeaderHeight * 1.5 : 0,

  },
  provider: {
    alignItems: "center",
    justifyContent: "center",

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
    marginBottom: height - 95
  }
});
