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

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { Background, ContainerMain, ContainerHeader,
  ContainerImageRight, ContainerImageLeft,ContainerDadosView,
  ContainerFooter, ContainerScreenButton, SubmitButton, SubmitText,
  TitleText, ItemText } from './styles';

import { AuthContext } from '../../contexts/auth';

import ImagePicker from 'react-native-image-picker';

import { getPhotoProfileUser, storagePhotoProfileUser, alertMessage } from '../../util/util';

export default function Profile() {

  const { user } = useContext(AuthContext);

  const [ filePathData, setFilePathData ] = useState('');
  //const [ filePathUri, setFilePathUri ] = useState('');
  const [ fileData, setFileData ] = useState('');
  const [ fileUri, setFileUri] = useState('');

  //substituir pelos dados do User
  let [responseData, setResponseData] = useState(null);

  useEffect(() => {
    //console.log('route PhotoManager = ', route);

    getPhotoProfileUser(user.id).then((photoBase64) => {
      console.log('\n getPhotoProfileUser = ', photoBase64);

      if (photoBase64) {
        setFileData(photoBase64);
        alertMessage('Imagem Carregada com sucesso!', null, null, 'AIZON-PERFIL');
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
        console.log('\n storagePhotoProfileUser = ', response.data);
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
    return <Image source={{ uri: 'data:image/jpeg;base64,' + fileData }}
      style={styles.images}
    />
  } else {
    return <Image source={require('../../assets/dummy.png')}
      style={styles.images}
    />
  }
}

function getDataPopulate() {

  /**
   * pegar do STORAGE
   *
   * let data = {
            id: 8388,
            name: 'Alessandro Santos',
            email: 'ats@mail.com',
            username: 'atssantos2000',
            imageUserBase64: null
        };
   */

  if (responseData) {
    return (
      <View style={styles.viewPrincipal}>
            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}>Identificação Doc.</Text>
              <Text style={styles.textTitleSecond}>UF</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text  style={styles.textDataFirst}> {route.params && route.params.identificacaoDocumento }</Text>
              <Text  style={styles.textDataSecond}> {responseData.uf }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> Registro Geral</Text>
              <Text style={styles.textTitleSecond}> Data de Expedição</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.numero_rg }</Text>
              <Text style={styles.textDataSecond}> {responseData.data_expedicao }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> Nome</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.nome_pessoa }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> Filiação</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.filiacao }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> Naturalidade</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.naturalidade }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> Nascimento</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.data_de_nascimento }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> Documento Origem</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.doc_origem }</Text>
            </View>

            <View style={styles.viewLine1}>
              <Text style={styles.textTitleFirst}> CPF</Text>
            </View>

            <View style={styles.viewLine2}>
              <Text style={styles.textDataFirst}> {responseData.cpf }</Text>
            </View>
    </View>)
  }

}

 return (
      <Background>
        <ContainerHeader>
          <Header titlePage="Perfil"/>
        </ContainerHeader>

        <ContainerMain>

            <ContainerImageRight>

                  {renderFileData()}
                  <TitleText  style={{textAlign:'center'}}>FOTO DE PERFIL</TitleText>

                <ContainerScreenButton>
                  <SubmitButton onPress={() => chooseImage()}>
                      <SubmitText>Alterar Imagem</SubmitText>
                  </SubmitButton>
                </ContainerScreenButton>

            </ContainerImageRight>

            <ContainerImageLeft>
              <ContainerDadosView>
              { getDataPopulate() }
              </ContainerDadosView>


            </ContainerImageLeft>



            </ContainerMain>
            {/**</SendImageBackground>*/}

            <ContainerFooter>
                <Footer titlePage="AIZON"/>
            </ContainerFooter>






{/**
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.ImageSections}>
              <View>
                {renderFileData()}
                <Text  style={{textAlign:'center'}}>FOTO DE PERFIL</Text>
              </View>

            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity onPress={() => chooseImage()} style={styles.btnSection}  >
                <Text style={styles.btnText}>Choose File</Text>
              </TouchableOpacity>

            </View>

          </View>
        </SafeAreaView>

 */}

      </Background>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f0f8ff',
  },

  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 130,
    height: 130,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop:10
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom:10
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight:'bold'
  }
});

