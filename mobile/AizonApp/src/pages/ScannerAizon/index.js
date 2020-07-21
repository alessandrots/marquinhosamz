import React, { useContext, useState, useRef } from 'react';

import { ActivityIndicator, Animated, Dimensions, Platform, SafeAreaView,
  StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Scanner, { Filters, RectangleOverlay } from 'react-native-rectangle-scanner';

import RNFS from 'react-native-fs';

import { AuthContext } from '../../contexts/auth';


export default function ScannerAizon(props) {

    let camera = useRef(null);

    const [detectedRectangle, setDetectedRectangle] = useState(null);

    const [device, setDevice] = useState({
        initialized: false,
        hasCamera: false,
        permissionToUseCamera: false,
        flashIsAvailable: false,
        previewHeightPercent: 1,
        previewWidthPercent: 1,
    });

    function handleOnPictureProcessed (croppedImage,initialImage) {
        props.doSomethingWithCroppedImagePath(croppedImage);
        props.doSomethingWithOriginalImagePath(initialImage);
    }

    function capture(){
        camera.current.capture();
    }

    // The picture was captured but still needs to be processed.
    function onPictureTaken (data) {
      console.log('\n ==================================== data = ');
      console.log('Alessandro onPictureTaken = ', data);
      console.log('====================================');

      //: 'file:///data/user/0/com.aizonapp/cache/RNRectangleScanner/O7f0a8548-e0dd-4a64-b33c-851743fa944f.png',
      let initialImage = data.initialImage;

      RNFS.readFile(initialImage, 'base64')
      .then(res =>{
        console.log('initialImage = ', res);
      });

      //'file:///data/user/0/com.aizonapp/cache/RNRectangleScanner/Cb9baeb14-ea53-4ff7-bf76-d6daae66681b.png' }
      let croppedImage = data.croppedImage;

      //TODO
      //props.onPictureTaken(event); vai tá na classe chamadora
  }

  // The picture was taken and cached. You can now go on to using it.
  function onPictureProcessed (datap) {
      //TODO
      //props.onPictureProcessed(event);

      console.log('\n ==================================== dataP = ');
      console.log('Alessandro onPictureProcessed = ', datap);
      console.log('====================================');
  }

  function drawRectangle(rect) {
    console.log('\n ====================================');
    console.log('Alessandro detectedRectangle = ', detectedRectangle);
    console.log('====================================');
    console.log('Alessandro drawRectangle = ', rect);
    console.log('====================================');
  }

  function renderCameraView() {
      const previewSize = getPreviewSize();
      const disabledStyle = { opacity: 1 };

      let rectangleOverlay = null;


            rectangleOverlay = (
              <RectangleOverlay
                detectedRectangle={detectedRectangle}
                previewRatio={previewSize}
                backgroundColor="rgba(255,181,6, 0.2)"
                borderColor="rgb(255,181,6)"
                borderWidth={4}
                // == These let you auto capture and change the overlay style on detection ==
                // detectedBackgroundColor="rgba(255,181,6, 0.3)"
                // detectedBorderWidth={6}
                // detectedBorderColor="rgb(255,218,124)"
                // onDetectedCapture={capture}
                // allowDetection
              />
            );

      return (
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0)',
                              position: 'relative',
                              marginTop: previewSize.marginTop,
                              marginLeft: previewSize.marginLeft,
                              height: `${previewSize.height * 100}%`,
                              width: `${previewSize.width * 100}%` }}>
                <Scanner
                  onPictureProcessed={() => handleOnPictureProcessed}
                  ref={camera}
                  onPictureTaken={ (data) => onPictureTaken(data)}
                  onPictureProcessed={(datap) => onPictureProcessed(datap)}
                  capturedQuality={0.6}
                  onRectangleDetected={({ detectedRectangle }) => drawRectangle(detectedRectangle)}
                  style={{flex: 1}}
                />

                {rectangleOverlay}

                <View style={[styles.cameraOutline, disabledStyle]}>
                  <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.cameraButton}
                      onPress={() => capture()}
                  />
                </View>
        </View>
      );
    }

    function getPreviewSize() {
      const dimensions = Dimensions.get('window');
      // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
      const heightMargin = (1 - device.previewHeightPercent) * dimensions.height / 2;
      const widthMargin = (1 - device.previewWidthPercent) * dimensions.width / 2;
      if (dimensions.height > dimensions.width) {
      // Portrait
          return {
              height: device.previewHeightPercent,
              width: device.previewWidthPercent,
              marginTop: heightMargin,
              marginLeft: widthMargin,
          };
      }
  }

    return (
      <View
        style={styles.container}
      >
        <StatusBar backgroundColor="black" barStyle="light-content" hidden={Platform.OS !== 'android'} />
        {renderCameraView()}
      </View>
    )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonActionGroup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonBottomContainer: {
    alignItems: 'flex-end',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    bottom: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 25,
    top: 25,
  },
  buttonGroup: {
    backgroundColor: '#00000080',
    borderRadius: 17,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 22,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
  buttonTopContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
    top: 40,
  },
  cameraButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
    margin: 3,
  },
  cameraNotAvailableContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  cameraNotAvailableText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  cameraOutline: {
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  flashControl: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    margin: 8,
    paddingTop: 7,
    width: 50,
  },
  loadingCameraMessage: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center', flex: 1, justifyContent: 'center',
  },
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(220, 220, 220, 0.7)',
    borderRadius: 16,
    height: 140,
    justifyContent: 'center',
    width: 200,
  },
  scanner: {
    flex: 1,
  },
});