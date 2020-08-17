import React, { useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import { Background, ContainerMain, ContainerHeader,
  ContainerImageRight, ContainerImageLeft,ContainerDadosView,
  ContainerFooter, ContainerScreenButton, SubmitButton, SubmitText,
  TitleText, ItemText } from './styles';

  import Icon from "react-native-vector-icons/MaterialIcons";

import { AuthContext } from '../../contexts/auth';

import ImagePicker from 'react-native-image-picker';

import { getPhotoProfileUser, storagePhotoProfileUser, alertMessage } from '../../util/util';

export default function ProfileMenu(props) {

  const { user } = useContext(AuthContext);

  const [ filePathData, setFilePathData ] = useState('');
  const [ fileData, setFileData ] = useState('');
  const [ fileUri, setFileUri] = useState('');

  //substituir pelos dados do User
  let [responseData, setResponseData] = useState(null);

  useEffect(() => {

    getPhotoProfileUser(user.id).then((photoBase64) => {
      console.log('\n getPhotoProfileUser = ', photoBase64);

      if (photoBase64) {
        setFileData(photoBase64);
      }
    })
    .catch(() => {
        console.log('\n Deu pau na recuperação do getPhotoProfileUser \n ');
    });
  }, []);


function launchCamera () {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  ImagePicker.launchCamera(options, (response) => {
    console.log('launchCamera Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
      //alert(response.customButton);
    } else {
      const source = { uri: response.uri };
      setFilePathData(response);
      setFileData(response.data);
      setFileUri(response.uri);
    }
  });

}

function chooseImage () {
  let options = {
    title: 'Selecione a Imagem',
    customButtons: [
      //{ name: 'customOptionKey', title: 'Escolha a Foto das opções acima' },
    ],
    cancelButtonTitle:'Cancelar',
    chooseFromLibraryButtonTitle:'Galeria de Imagens',
    chooseWhichLibraryTitle:'Escolha o app de Fotos',
    takePhotoButtonTitle:'Tirar Foto',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  let id = user.id;

  ImagePicker.showImagePicker(options, (response) => {
    console.log('chooseImage Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
      //alert(response.customButton);
    } else {
      const source = { uri: response.uri };

      setFilePathData(response);
      setFileData(response.data);
      setFileUri(response.uri);

      storagePhotoProfileUser(response.data, user.id).then((photoBase64) => {
        //console.log('\n storagePhotoProfileUser = ', response.data);
        alertMessage('Imagem Salva com sucesso!', null, null, 'AIZON-PERFIL');
      })
      .catch(() => {
          console.log('\n Deu pau na salvar do storagePhotoProfileUser \n ');
      });
    }
  });
}

function renderFileData() {
  if (fileData) {
    return <Image
            source={{ uri: 'data:image/jpeg;base64,' + fileData }}
            style={
                { width: 50,
                height: 50,
                marginLeft: 10,
                borderRadius: 32.5,
                borderColor: '#CC0000',
                borderWidth: 1.2,
                }
            }
    />
  } else {
    return <Image
            source={require('../../assets/dummy.png')}
            style={
                { width: 50,
                height: 50,
                marginLeft: 10,
                borderRadius: 32.5,
                borderColor: '#CC0000',
                borderWidth: 1.2,
                }
            }
    />
  }
}

 return (
        <Background>
            <TitleText>
                MENU
            </TitleText>

            <ContainerMain>
                <ContainerImageRight>
                        {renderFileData()}

                        <TouchableOpacity
                            onPress={() => chooseImage()}
                            style={{
                                    backgroundColor:  'transparent',
                                    borderRadius: 5,
                                    margin: 5,
                                    }}>
                              <Icon name="camera-alt" size={20} color={"#F0B42F"} />
                            </TouchableOpacity>

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
