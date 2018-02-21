import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddLocationScreen from '../screens/AddLocationScreen';

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Map: {
      screen: MapScreen,
    },
    Add: {
      screen: AddLocationScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName =
              Platform.OS === 'ios'
                ? `ios-home${focused ? '' : '-outline'}`
                : 'md-home';
            break;
          case 'Map':
            iconName = Platform.OS === 'ios' ? `ios-map${focused ? '' : '-outline'}` : 'md-map';
            break;
            case 'Add':
              iconName = Platform.OS === 'ios' ? `ios-add${focused ? '' : '-outline'}` : 'md-add';
              break;
          case 'Settings':
            iconName =
              Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
