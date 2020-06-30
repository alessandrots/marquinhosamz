import React, {useState, useContext, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert} from 'react-native';

import { AuthContext } from '../../contexts/auth';

import {RNCamera} from 'react-native-camera';

import Icon from "react-native-vector-icons/MaterialIcons";

function PhotoMain(props) {

  {/***/}
  const [images, setImages] = useState({});
  const [dataImage, setDataImage] = useState({});
  const [photoShot, setPhotoShot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidePhoto, setSidePhoto] = useState({});
  const [camera, setCamera] = useState();


  useEffect(() => {

    if (props?.objParams?.route?.params) {
      console.log('\n\n props.objParams.route.params.side = ', props.objParams.route.params.side);
      setSidePhoto(props.objParams.route.params.side);
    }

  }, [props?.objParams?.route?.params?.side]);


  /**
   *
   * https://stackoverflow.com/questions/34779799/upload-base64-image-with-ajax
   *
   * https://reactnative.dev/docs/network
   */

  const { savePhoto } = useContext(AuthContext);

  const navigation = useNavigation();



  async function handleTakePicture2(camera) {
    setLoading(true);
    /**
     *
     * https://medium.com/@andrew.smith_84400/how-to-build-an-image-recognition-app-in-react-native-in-30-minutes-f9fa5f7d7532
     *
     * https://react-native-community.github.io/react-native-camera/docs/rncamera
     *
     */
    const options = {quality: 0.5, base64: true, forceUpOrientation: true, fixOrientation: true,};
    const data = await camera.takePictureAsync(options);

    let objImage = {};
    objImage['uri'] = data.uri;
    setImages(objImage);
    setPhotoShot(true);
    setDataImage(data);

    identifyImage(camera, data);
  }

  function identifyImage(camera, imageData) {
    displayAnswer(camera, imageData)
	}

	function displayAnswer(camera, identifiedImage) {
    setLoading(false);
	}

  //Botão Cancelar
  function handleCameraDiscard() {
    setImages(null);
    setPhotoShot(false);
    returnPageInitial(null);
  }

  //Botão Continuar
  function handleCameraForward() {
    setImages(null);
    setPhotoShot(false);
    returnPageInitial(dataImage);
  }

  function returnPageInitial(dataImage) {
    navigation.pop();
    navigation.navigate('PhotoManager', { post: dataImage, side: sidePhoto});
  }



  function PendingView  () {
    return  (
        <View
          style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Aguarde ... </Text>
        </View>
    );
  }


  return (

    <View style={styles.container}>
            <RNCamera
                style={{flex: 1}}
                type={RNCamera.Constants.Type.back}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancelar',
                }}
                androidRecordAudioPermissionOptions={{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancelar',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) =>  {
                  console.log(barcodes);
                }}
              >

                {({ camera, status, recordAudioPermissionStatus }) => {
                      if (status !== 'READY') return PendingView ();

                      if (!photoShot) {
                        return (
                          <View style={styles.viewPhoto} visible={photoShot}>
                            <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>
                            <TouchableOpacity onPress={() => handleTakePicture2(camera)} style={styles.capture}>
                              <Icon name="camera-alt" size={60} color={"#F0B42F"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCameraDiscard()} style={styles.buttonCloseCamera}>
                              <Icon name="cancel" size={40} color={"#0EABB5"} />
                            </TouchableOpacity>
                          </View>
                        );
                      } else {
                        return (
                          <View style={styles.viewPhotoTaked}>
                            <TouchableOpacity onPress={() => handleCameraDiscard()} style={styles.capture2}>
                              <Icon name="cancel" size={60} color={"#0EABB5"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCameraForward()} style={styles.capture2}>
                              <Icon name="save" size={60} color={"#F0B42F"} />
                            </TouchableOpacity>
                          </View>
                        )
                      }
                  }}
          </RNCamera>
    </View>
  );
}

//style={{ flexDirection: 'row', justifyContent: 'center' , alignContent:'space-between'}}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
    alignItems: 'center'
  },
  viewPhoto: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent:'flex-end'
  },

  capture: {
    backgroundColor:  'transparent',
    borderRadius: 5,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 10,
  },

  buttonCloseCamera: {
    flex: 0,
    position: "absolute",
    top: 20,
    left: 40
  },

  viewPhotoTaked: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent:'flex-end'
  },

  capture2: {
    borderRadius: 5,
    paddingHorizontal: 20,
    alignSelf:'flex-end',
    margin: 10,
  },
});

export default PhotoMain;