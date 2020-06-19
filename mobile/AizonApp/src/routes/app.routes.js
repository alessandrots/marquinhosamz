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
import PhotoView from '../pages/PhotoView';
import ViewAuthenticity from '../pages/ViewAuthenticity';
import SendDocument from '../pages/SendDocument';
import SendDocInfo from '../pages/SendDocInfo';
import PhotoManager from '../pages/PhotoManager'

import { AuthContext } from '../contexts/auth';



const AppDrawer = createDrawerNavigator();

//options={{ headerTitle: props => <LogoAtavar {...props} /> }}
/**
 options={{
    headerTitle: props => <LogoAtavar {...props} />,
    headerRight: () => (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  }}
 */
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
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();
              console.log('2 XXxXxxXxxxxxxx.... ');
            },
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}
      >
          <AppDrawer.Screen
            name="Enviar_Documento"
            component={SendDocument}
            options={{ title: 'Enviar Documento' }}
            />

          <AppDrawer.Screen
            name="Orientation"
            component={SendDocInfo}
            options={{ title: 'Orientações' }}
            />

{/**
          <AppDrawer.Screen
            name="Visualizar_Dados"
            component={ViewData}
            options={{ title: 'Visualizar Dados' }}/>

          <AppDrawer.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home' }}/>
 */}

          <AppDrawer.Screen
              name="PhotoManager"
              component={PhotoManager}
              options={{ title: 'Foto Documental' }}
              />

          <AppDrawer.Screen
            name="ViewData"
            component={ViewData}
            options={{ title: 'Visualizar Dados' }}/>

          <AppDrawer.Screen
            name="Verificar_Autenticidade"
            component={ViewAuthenticity}
            options={{ title: 'Verificar Autenticidade' }}/>


          <AppDrawer.Screen
            name="CertifyProcess"
            component={Profile}
            options={{ title: 'Certificação do Processo' }}/>

          <AppDrawer.Screen
            name="Profile"
            component={Profile}
            options={{ title: 'Perfil' }}/>

          <AppDrawer.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home' }}/>

          <AppDrawer.Screen
              name="Photo"
              component={PhotoView}
              />
      </AppDrawer.Navigator>
  );
}

//navigation.navigate('Photo', { side: '0' })
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
      "AIZON",
      "[Logout] - Deseja sair ?",
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
      {/**
      <DrawerItem
          {...props}
          label="Logout 2"
          activeTintColor= '#000'
          activeBackgroundColor= '#F0B42F'
          inactiveBackgroundColor= '#FFF'
          inactiveTintColor= '#000'
          onPress={() => prepareTosignOut() }
      />
       */}
    </DrawerContentScrollView>
  );
}

export default AppRoutes;
