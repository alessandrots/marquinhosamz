{
  /**
   * configurações de rota q o cara vai estar logadas
   *
   * rotas logadas
   *
  */
}

import React, {useContext, useEffect, useState} from 'react';
import { Alert, Image } from "react-native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';


import Profile from '../pages/Profile';
import ViewData from '../pages/ViewData';
import SendDocument from '../pages/SendDocument';
import SendDocInfo from '../pages/SendDocInfo';
import PhotoManager from '../pages/PhotoManager';
import PdfView from '../pages/PdfView';
import ChangePasswd from '../pages/ChangePasswd';

import { getPhotoProfileUser } from '../util/util';

import ProfileMenu from '../components/ProfileMenu';

import FotoCmp from '../components/FotoCmp';
import PhotoView from '../pages/PhotoView';
import Home from '../pages/Home';
import ViewAuthenticity from '../pages/ViewAuthenticity';
import Icon from "react-native-vector-icons/MaterialIcons";

import { AuthContext } from '../contexts/auth';

const AppDrawer = createDrawerNavigator();

import { Background, ContainerMain,
  ContainerImageRight, ContainerDadosView,
  SubmitButton, SubmitText, TitleText, ItemText } from './styles';

function AppRoutes(){
  const { user } = useContext(AuthContext);

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

          <AppDrawer.Screen
              name="PdfCertificate"
              component={PdfView}
              options={{ title: 'Certificado' }}
          />

          <AppDrawer.Screen
            name="Profile"
            component={Profile}
            options={{ title: 'Perfil' }}/>

          <AppDrawer.Screen
            name="ChangePasswd"
            component={ChangePasswd}
            options={{ title: 'Alterar Senha' }}/>

          <AppDrawer.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home' }}/>

{/**
 *
    <AppDrawer.Screen
            name="ViewData"
            component={ViewData}
            options={{ title: 'Visualizar Dados' }}/>

 * <AppDrawer.Screen
              name="PhotoManager"
              component={PhotoManager}
              options={{ title: 'Foto Documental' }}
              />


          <AppDrawer.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home' }}/>

          <AppDrawer.Screen
              name="Photo"
              component={FotoCmp}
              />


          <AppDrawer.Screen
              name="ViewAuthenticity"
              component={ViewAuthenticity}
              options={{ title: 'ViewAuthenticity' }}
              />

          <AppDrawer.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home' }}/>
             */}


      </AppDrawer.Navigator>
  );
}



function CustomDrawerContent(props) {
  const { user, signOut } = useContext(AuthContext);

  const msg = user.name + ", tem certeza que deseja sair ?";

  const [ fileData, setFileData ] = useState('');

  useEffect(() => {

      getPhotoProfileUser(user.id).then((photoBase64) => {
        //console.log('\n getPhotoProfileUser = ', photoBase64);

        if (photoBase64) {
          setFileData(photoBase64);
        }
      })
      .catch(() => {
          console.log('\n Deu pau na recuperação do getPhotoProfileUser \n ');
      });
  }, []);

  function getMontagemTela() {
      if (fileData) {
        return getUserWithBase64(fileData);
      } else {
        return getUserAvatar();
      }
  }

  function getUserWithBase64(photo) {
    const { user } = useContext(AuthContext);

    return (
        <Background>
            <TitleText>
                MENU
            </TitleText>

            <ContainerMain>
              <ContainerImageRight>
                      <Image
                          style={
                            { width: 50,
                              height: 50,
                              marginLeft: 10,
                              borderRadius: 32.5,
                              borderColor: '#CC0000',
                              borderWidth: 1.2,
                            }
                          }
                          source={{ uri: 'data:image/jpeg;base64,' + photo }}
                        />
                      <ContainerDadosView>
                          <ItemText>
                              Pontuação: 130.45
                          </ItemText>
                          <ItemText>
                              Usuário desde 27/07/2020
                          </ItemText>
                          <ItemText>
                              Versão 1.0
                          </ItemText>
                      </ContainerDadosView>
              </ContainerImageRight>
            </ContainerMain>

            <ContainerMain>
              <ContainerImageRight>

                      <ContainerDadosView>
                          <ItemText>
                              {user.username }
                          </ItemText>
                          <ItemText>
                              {user.email }
                          </ItemText>
                      </ContainerDadosView>
              </ContainerImageRight>
            </ContainerMain>

        </Background>
    );
  }


  function getUserAvatar() {
    const { user } = useContext(AuthContext);

    //{ getMontagemTela() }
    return (
        <Background>

            <ContainerMain>
              <ContainerImageRight>
                      <Image
                          style={
                            { width: 50,
                              height: 50,
                              marginLeft: 10,
                              borderRadius: 32.5,
                              borderColor: '#CC0000',
                              borderWidth: 1.2,
                            }
                          }
                          source={require('../assets/avatar-orange.png')}
                        />
                      <ContainerDadosView>
                          <ItemText>
                              Pontuação: 130.45
                          </ItemText>
                          <ItemText>
                              Usuário desde 27/07/2020
                          </ItemText>
                          <ItemText>
                              Versão 1.0
                          </ItemText>
                      </ContainerDadosView>
              </ContainerImageRight>
            </ContainerMain>

            <ContainerMain>
              <ContainerImageRight>

                      <ContainerDadosView>
                          <ItemText>
                              {user.username }
                          </ItemText>
                          <ItemText>
                              {user.email }
                          </ItemText>
                      </ContainerDadosView>
              </ContainerImageRight>
            </ContainerMain>

        </Background>
    );
  }

  const prepareTosignOut = () =>

    Alert.alert(
      "AIZON",
      msg ,
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
      <ProfileMenu />
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
    </DrawerContentScrollView>
  );
}

export default AppRoutes;
