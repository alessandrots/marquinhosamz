import React, {useState, useContext, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';

import { Dimensions, StyleSheet, Text, TouchableOpacity,
  View, ActivityIndicator, Alert} from 'react-native';

import { AuthContext } from '../../contexts/auth';

import {RNCamera} from 'react-native-camera';
import CameraOverlay from '../CameraOverlay';

import Icon from "react-native-vector-icons/MaterialIcons";

export default function FotoLayerCmp(props) {
 //const navigation = useNavigation();

 {/***/}
 const [images, setImages] = useState({});
 const [dataImage, setDataImage] = useState({});
 const [photoShot, setPhotoShot] = useState(false);
 const [loading, setLoading] = useState(false);
 const [sidePhoto, setSidePhoto] = useState({});
 const [camera, setCamera] = useState();


 useEffect(() => {

   console.log('props = ', props);
   /**
   if (props?.objParams?.route?.params) {
     console.log('\n\n props.objParams.route.params.side = ', props.objParams.route.params.side);
     setSidePhoto(props.objParams.route.params.side);
   }
   */

 }, []);


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
    props.onClose();
    //navigation.pop();
    navigation.navigate('PhotoManager', { post: dataImage, side: props.side});
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

 const { height, width } = Dimensions.get('window');



 return (

      <View style={styles.container}>
            <RNCamera
                style={styles.camera}
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
                          <View style={styles.cameraElements}>
                            <View style={{ flex: 90}}/>
                            <View style={styles.viewPhotoTakedOverlay}>

                                <View style={styles.viewPhotoTaked} visible={photoShot}>
                                  <ActivityIndicator size="large" color="#0EABB5" animating={loading}/>

                                  <TouchableOpacity onPress={() => handleTakePicture2(camera)} style={styles.capture}>
                                    <Icon name="camera-alt" size={60} color={"#F0B42F"} />
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => props.onClose()} style={styles.buttonCloseCamera}>
                                    <Icon name="cancel" size={40} color={"#0EABB5"} />
                                  </TouchableOpacity>
                                </View>
                            </View>
                          </View>
                        );
                      } else {
                        return (
                          <View style={styles.cameraElements}>
                            <View style={{ flex: 90 }}/>
                            <View style={styles.viewPhotoTakedOverlay}>

                              <View style={styles.viewPhotoTaked}>
                                <TouchableOpacity onPress={() => handleCameraForward()} style={styles.capture}>
                                  <Icon name="save" size={60} color={"#F0B42F"} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => props.onClose()} style={styles.buttonCloseCamera}>
                                  <Icon name="cancel" size={40} color={"#0EABB5"} />
                                </TouchableOpacity>

                              </View>

                            </View>
                          </View>
                        )
                      }
                  }}
          </RNCamera>
          <CameraOverlay />

    </View>

 );
}

const styles = StyleSheet.create({
 container: {
   flexDirection: 'column',
   justifyContent: 'flex-start',
   backgroundColor: 'black',
   alignItems: 'center',
   top:(Dimensions.get("window").width * 0.25),
   left:(Dimensions.get("window").width * 0.2),
   width: (Dimensions.get("window").width/2),
   height: (Dimensions.get("window").height/2),
 },
 camera: {
  position: "absolute",
  flex: 1,
  width: (Dimensions.get("window").width/2),
  height: (Dimensions.get("window").height/2),
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
   marginTop: 15,
   //marginBottom: 30,
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

 viewPhotoTakedOverlay: {
  flex: 3,
  flexDirection: 'row',
  backgroundColor: 'transparent',
  justifyContent:'flex-end',
  //backgroundColor: '#e5f282'
},

 capture2: {
   borderRadius: 5,
   paddingHorizontal: 20,
   alignSelf:'flex-end',
   margin: 10,
 },
 cameraElements: {
  zIndex: 2,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 20
},
});


