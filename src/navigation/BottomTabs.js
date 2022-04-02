import {TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import TouchID from 'react-native-touch-id';
import FreeDriving from '../pages/FreeDriving';
import Trips from '../pages/Trips';
import Transactions from '../pages/Transactions';
import TaxVault from '../pages/TaxVault';

const Tabs = createBottomTabNavigator();

const BottomTabs = () => {
  const [isAuth, setIsAuth] = useState(false);

  const optionalConfigObject = {
    title: 'Provide Your Touch Id',
    imageColor: '#e00606',
    imageErrorColor: '#ff0000',
    sensorDescription: 'Touch sensor',
    sensorErrorDescription: 'Failed',
    cancelText: 'Cancel',
    fallbackLabel: '',
    unifiedErrors: false,
    passcodeFallback: false,
  };

  const handleBiometric = onPress => {
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        // Success code
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else {
          console.log('TouchID is supported.');
          if (isAuth) {
            return onPress();
          }
          TouchID.authenticate('', optionalConfigObject)
            .then(success => {
              console.log('Success', success);
              setIsAuth(success);
              onPress();
            })
            .catch(err => {
              console.log('Error', err);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const CustomTabBarButton = props => (
    <TouchableOpacity
      {...props}
      onPress={() => handleBiometric(props.onPress)}></TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen
          name="Homepage"
          component={FreeDriving}
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: props => (
              <Ionicons name="ios-home-outline" {...props} />
            ),
            tabBarIconStyle: {fontWeight: '900'},
          }}
        />
        <Tabs.Screen
          name="Trips"
          component={Trips}
          options={{
            title: 'Trips',
            headerShown: false,
            tabBarIcon: props => <MaterialIcons name="car-pickup" {...props} />,
            tabBarIconStyle: {fontWeight: '900'},
            tabBarButton: props => {
              return <CustomTabBarButton {...props} />;
            },
          }}
        />
        <Tabs.Screen
          name="Transactions"
          component={Transactions}
          options={{
            title: 'Transactions',
            headerShown: false,
            tabBarIcon: props => <Feather name="dollar-sign" {...props} />,
            tabBarIconStyle: {fontWeight: '900'},
          }}
        />
        <Tabs.Screen
          name="TaxVault"
          component={TaxVault}
          options={{
            title: 'Tax Vault',
            headerShown: false,
            tabBarIcon: props => (
              <Ionicons name="shield-checkmark-outline" {...props} />
            ),
            tabBarIconStyle: {fontWeight: '900'},
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabs;
