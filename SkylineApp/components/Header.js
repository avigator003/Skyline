import React ,{useEffect} from 'react';
import { withNavigation } from '@react-navigation/compat';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Input, Text, theme } from 'galio-framework';
import Icon from './Icon';
import materialTheme from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as Updates from 'expo-updates';
import Axios from 'axios'

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const LogoutButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => {
    AsyncStorage.removeItem('user')
    AsyncStorage.removeItem('email')
    Axios.get('http://65.1.131.197:3000/api/user/mobile_logout')
    navigation.navigate('Login')
    Updates.reloadAsync()
    }}>
    <Ionicons name="exit-outline" size={width/13} color={"white"}/>
  </TouchableOpacity>
);


const SearchButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      size={16}
      family="entypo"
      name="magnifying-glass"
      color={theme.COLORS[isWhite ? 'WHITE' : 'WHITE']}
    />
  </TouchableOpacity>
);

class Header extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = {
      user:""
    }
  }
  
  async componentDidMount() {
  const user= await AsyncStorage.getItem('user')
    this.setState({ user: user });
  }


  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }



  renderRight = () => {
    const { white, title, navigation } = this.props;



    if (title === 'Title') {
      return [
        <LogoutButton key='chat-title' navigation={navigation} isWhite={white} />,
      ]
    }

    switch (title) {
      case 'Home':
        return ([
          <LogoutButton key='chat-home' navigation={navigation} isWhite={white} />,
        ]);
        case 'My Packages':
        return ([
          <LogoutButton key='chat-home' navigation={navigation} isWhite={white} />,
        ]);
      default:
        break;
    }
  
  }

  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onFocus={() => navigation.navigate('Pro')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
      />
    )
  }

  renderTabs = () => {
    const { navigation, tabTitleLeft, tabTitleRight } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>{tabTitleLeft || 'Categories'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>{tabTitleRight || 'Best Deals'}</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderHeader = () => {
    const { search, tabs } = this.props;
    if (search || tabs) {
      return (
        <Block center>
        </Block>
      )
    }
    return null;
  }

  render() {
    const { back, title, white, transparent, navigation } = this.props;
    // const { routeName } = navigation.state;
    const noShadow = ["Search", "Categories", "Deals", "Pro", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    return (
      <Block style={headerStyles}>
        {this.state.user ?
        <NavBar
          back={back}
          title={title}
          style={styles.navbar}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ flex: 0.5, paddingTop: 2  }}
          leftIconName={(back ? 'chevron-left' : 'navicon')}
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.WHITE}
          titleStyle={[
            styles.title,
            {color: theme.COLORS[white ? 'WHITE' : 'WHITE']},
          ]}
          onLeftPress={this.handleLeftPress}
        />:
        <NavBar
          back={back}
          title={title}
          style={styles.navbar}
          transparent={transparent}
          leftStyle={{ flex: 0.5, paddingTop: 2  }}
          leftIconName={(back ? 'chevron-left' : 'navicon')}
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.WHITE}
          titleStyle={[
            styles.title,
            {color: theme.COLORS[white ? 'WHITE' : 'WHITE']},
          ]}
          onLeftPress={this.handleLeftPress}
        />
  }
        {this.renderHeader()}
      </Block>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 2,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
    backgroundColor: "#1c2a38",
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
})