{
    /**
     * configurações de rota q o cara vai estar logadas
     *
     * rotas logadas
     *
    */
}

import React, {useContext} from 'react';
import { Alert, Image, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';


import Home from '../pages/Home';
import ViewData from '../pages/ViewData';
import Profile from '../pages/Profile';

import { AuthContext } from '../contexts/auth';



const AppDrawer = createDrawerNavigator();
{/**
  #F0B42F
  #0EABB5
  #c8f5f7

  https://stackoverflow.com/questions/48111041/logout-using-react-native-drawernavigator
  https://reactnative.dev/docs/
  https://snack.expo.io/@atsantos/16c137?platform=android&name=Hello%20React%20Navigation%20%7C%20React%20Navigation&dependencies=%40react-native-community%2Fmasked-view%40%5E0.1.7%2C%40react-navigation%2Fbottom-tabs%40%5E5.4.5%2C%40react-navigation%2Fdrawer%40%5E5.7.5%2C%40react-navigation%2Fmaterial-bottom-tabs%40%5E5.2.5%2C%40react-navigation%2Fmaterial-top-tabs%40%5E5.2.5%2C%40react-navigation%2Fnative%40%5E5.4.0%2C%40react-navigation%2Fstack%40%5E5.3.7%2Creact-native-paper%40%5E3.10.1%2Creact-native-reanimated%40%5E1.7.0%2Creact-native-safe-area-context%40%5E0.7.3%2Creact-native-screens%40%5E2.4.0%2Creact-native-tab-view%40%5E2.14.0&sourceUrl=https%3A%2F%2Freactnavigation.org%2Fexamples%2F5.x%2Fcustom-drawer-content.js
  https://snack.expo.io/@atsantos/16c137?platform=android&name=Hello%20React%20Navigation%20%7C%20React%20Navigation&dependencies=%40react-native-community%2Fmasked-view%40%5E0.1.7%2C%40react-navigation%2Fbottom-tabs%40%5E5.4.5%2C%40react-navigation%2Fdrawer%40%5E5.7.5%2C%40react-navigation%2Fmaterial-bottom-tabs%40%5E5.2.5%2C%40react-navigation%2Fmaterial-top-tabs%40%5E5.2.5%2C%40react-navigation%2Fnative%40%5E5.4.0%2C%40react-navigation%2Fstack%40%5E5.3.7%2Creact-native-paper%40%5E3.10.1%2Creact-native-reanimated%40%5E1.7.0%2Creact-native-safe-area-context%40%5E0.7.3%2Creact-native-screens%40%5E2.4.0%2Creact-native-tab-view%40%5E2.14.0&sourceUrl=https%3A%2F%2Freactnavigation.org%2Fexamples%2F5.x%2Fanimated-drawer-content.js


*/}
function AppRoutes(){


    return(

        <AppDrawer.Navigator
            drawerStyle={{
                backgroundColor: '#c8f5f7'
            }}
            drawerContentOptions={{
                labelStyle:{
                    fontWeight: 'bold'
                },
                activeTintColor: '#000',
                activeBackgroundColor: '#F0B42F',
                inactiveBackgroundColor: '#FFF',
                inactiveTintColor: '#000',
                itemStyle: {
                    marginVertical: 5,
                }
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
        >
            <AppDrawer.Screen
              name="Home"
              component={Home}
              options={{ headerTitle: props => <LogoAtavar {...props} /> }}
              />

            <AppDrawer.Screen
              name="Registrar"
              component={ViewData} />

            <AppDrawer.Screen
              name="Perfil"
              component={Profile} />
        </AppDrawer.Navigator>
    );
}


function LogoAtavar() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        style={{ width: 50, height: 50 }}
        source={require('../assets/avatar-orange.png')}
      />
      <Text>Home Screen</Text>
    </View>

  );
}

function CustomDrawerContent(props) {
  const { user, signOut } = useContext(AuthContext);

  const prepareTosignOut = () =>
    Alert.alert(
      "Logout",
      "Deseja sair ?",
      [
        {
          text: "Cancel",
          onPress: () => {return null},
          style: "cancel"
        },
        { text: "OK",
          onPress: () => signOut()
        }
      ],
      { cancelable: false }
  );

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
          {...props}
          label="Logout"
          activeTintColor= '#000'
          activeBackgroundColor= '#F0B42F'
          inactiveBackgroundColor= '#FFF'
          inactiveTintColor= '#000'
          onPress={() => prepareTosignOut() }
      />
      <DrawerItem
          {...props}
          label="Logout 2"
          activeTintColor= '#000'
          activeBackgroundColor= '#F0B42F'
          inactiveBackgroundColor= '#FFF'
          inactiveTintColor= '#000'
          onPress={() => prepareTosignOut() }
      />
    </DrawerContentScrollView>
  );
}

export default AppRoutes;
