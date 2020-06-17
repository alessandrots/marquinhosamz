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
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';


import Home from '../pages/Home';
import ViewData from '../pages/ViewData';
import Profile from '../pages/Profile';
import CustomDrawerContentComponent from '../components/drawer';

import { AuthContext } from '../contexts/auth';




const AppDrawer = createDrawerNavigator({
  Menu: {
    screen: Home,
  },
  ViewData: {
    screen: ViewData,
  },
  Profile: {
    screen: Profile,
  }
},{
  initialRouteName: 'Menu',
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    activeTintColor: '#000000',
    activeBackgroundColor: '#e6e6e6',
  }
});

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
            name="Home2"
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
