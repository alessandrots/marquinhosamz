import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import React, {useEffect} from 'react';
import { View, StatusBar } from 'react-native';
import Routes from './src/routes/index';

import { initScanbotSdk } from './src/util/util';

import AuthProvider from './src/contexts/auth';

{/**
  https://blog.rocketseat.com.br/react-native-camera/

  https://github.com/malsapp/react-native-photo-upload

  https://pt.stackoverflow.com/questions/286895/qual-a-diferen%C3%A7a-entre-function-e-class-no-react

  https://pt.stackoverflow.com/questions/286895/qual-a-diferen%C3%A7a-entre-function-e-class-no-react

#F0B42F
#0EABB5
#c8f5f7

https://stackoverflow.com/questions/48111041/logout-using-react-native-drawernavigator
https://reactnative.dev/docs/
https://snack.expo.io/@atsantos/16c137?platform=android&name=Hello%20React%20Navigation%20%7C%20React%20Navigation&dependencies=%40react-native-community%2Fmasked-view%40%5E0.1.7%2C%40react-navigation%2Fbottom-tabs%40%5E5.4.5%2C%40react-navigation%2Fdrawer%40%5E5.7.5%2C%40react-navigation%2Fmaterial-bottom-tabs%40%5E5.2.5%2C%40react-navigation%2Fmaterial-top-tabs%40%5E5.2.5%2C%40react-navigation%2Fnative%40%5E5.4.0%2C%40react-navigation%2Fstack%40%5E5.3.7%2Creact-native-paper%40%5E3.10.1%2Creact-native-reanimated%40%5E1.7.0%2Creact-native-safe-area-context%40%5E0.7.3%2Creact-native-screens%40%5E2.4.0%2Creact-native-tab-view%40%5E2.14.0&sourceUrl=https%3A%2F%2Freactnavigation.org%2Fexamples%2F5.x%2Fcustom-drawer-content.js
https://snack.expo.io/@atsantos/16c137?platform=android&name=Hello%20React%20Navigation%20%7C%20React%20Navigation&dependencies=%40react-native-community%2Fmasked-view%40%5E0.1.7%2C%40react-navigation%2Fbottom-tabs%40%5E5.4.5%2C%40react-navigation%2Fdrawer%40%5E5.7.5%2C%40react-navigation%2Fmaterial-bottom-tabs%40%5E5.2.5%2C%40react-navigation%2Fmaterial-top-tabs%40%5E5.2.5%2C%40react-navigation%2Fnative%40%5E5.4.0%2C%40react-navigation%2Fstack%40%5E5.3.7%2Creact-native-paper%40%5E3.10.1%2Creact-native-reanimated%40%5E1.7.0%2Creact-native-safe-area-context%40%5E0.7.3%2Creact-native-screens%40%5E2.4.0%2Creact-native-tab-view%40%5E2.14.0&sourceUrl=https%3A%2F%2Freactnavigation.org%2Fexamples%2F5.x%2Fanimated-drawer-content.js


*/}

console.disableYellowBox=true;

export default function AizonApp() {
  useEffect(() => {
    //console.log('route ScanbotManager = ', route);

    initScanbotSdk();


  }, []);


  return (
   <NavigationContainer>
     <AuthProvider>
        <StatusBar backgroundColor="#0EABB5" barStyle="light-content"/>
        <Routes />
     </AuthProvider>
   </NavigationContainer>
  );
}