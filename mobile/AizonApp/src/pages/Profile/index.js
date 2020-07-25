import React, { useContext, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import Header from '../../components/Header';

import { Background, ContainerHeader } from './styles';

import { AuthContext } from '../../contexts/auth';

import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};


export default function Profile() {

  const { user } = useContext(AuthContext);

  const [ filePathData, setFilePathData ] = useState('');
  const [ filePathUri, setFilePathUri ] = useState('');
  const [ fileData, setFileData ] = useState('');
  const [ fileUri, setFileUri] = useState('');


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
      //console.log('response', JSON.stringify(response));

      setFilePathData(response);
      setFileData(response.data);
      setFileUri(response.uri);
    }
  });

}

function chooseImage () {
  let options = {
    title: 'Select Image',
    customButtons: [
      { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  console.log('chooseImage user = ', user);

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

function renderFileUri() {
  if (fileUri) {
    return <Image
      source={{ uri: fileUri }}
      style={styles.images}
    />
  } else {
    return <Image
      source={require('../../assets/galeryImages.jpg')}
      style={styles.images}
    />
  }
}

 return (
      <Background>
        <ContainerHeader>
          <Header titlePage="Perfil"/>
        </ContainerHeader>

        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.ImageSections}>
              <View>
                {renderFileData()}
                <Text  style={{textAlign:'center'}}>Base 64 String</Text>
              </View>

            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity onPress={() => chooseImage()} style={styles.btnSection}  >
                <Text style={styles.btnText}>Choose File</Text>
              </TouchableOpacity>
{/**
              <TouchableOpacity onPress={() => launchCamera()} style={styles.btnSection}  >
                <Text style={styles.btnText}>Directly Launch Camera</Text>
              </TouchableOpacity>
 */}

            </View>

          </View>
        </SafeAreaView>

      </Background>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f0f8ff',
  },

  body: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
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

