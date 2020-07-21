
import React, { useRef, useState, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from "react-native"
import Permissions from 'react-native-permissions';
import PDFScanner from "@woonivers/react-native-document-scanner"

export default function DocScanner() {
  const pdfScannerElement = useRef(null)
  const [data, setData] = useState({})
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function requestCamera() {
      const result = await Permissions.request(Platform.OS === "android" ? "android.permission.CAMERA" : "ios.permission.CAMERA")
      if (result === "granted") setAllowed(true)
    }
    requestCamera()
  }, [])

  function handleOnPressRetry() {
    setData({})
  }

  function handleDataAfterPress(data_) {

    console.log("\n handleDataAfterPress aizon ==> data_ = ", data_);
    //console.log("\n handleData aizon croppedImage ==> data_ = ", data_.croppedImage);
    //console.log("\n handleData aizon initialImage ==> data_ = ", data_.initialImage);
    //console.log("\n handleData aizon rectangleCoordinates ==> data_ = ", data_.rectangleCoordinates);

    setData(data_);
  }

  function handleRectangle (stableCounter, lastDetectionType ) {
    console.log("\n handleRectangle ==> stableCounter = ", stableCounter );
    console.log("\n handleRectangle ==> lastDetectionType = ", lastDetectionType );
  }

  function handleOnPress() {
    pdfScannerElement.current.capture()
  }

  if (!allowed) {
    console.log("You must accept camera permission")
    return (<View style={styles.permissions}>
      <Text>You must accept camera permission</Text>
    </View>)
  }

  if (data.croppedImage) {
    console.log("data", data);
    return (
      <React.Fragment>
        <Image source={{ uri: data.croppedImage }} style={styles.preview} />
        <TouchableOpacity onPress={handleOnPressRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <PDFScanner
        ref={pdfScannerElement}
        style={styles.scanner}
        onPictureTaken={ (data) => handleDataAfterPress(data) }
        onRectangleDetect={ (stableCounter, lastDetectionType ) => handleRectangle(stableCounter, lastDetectionType ) }
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={false}
        quality={0.5}
        useBase64={true}
        detectionRefreshRateInMS={50}
        detectionCountBeforeCapture={10}
      />

      {/**
      <TouchableOpacity onPress={handleOnPress} style={styles.button}>
        <Text style={styles.buttonText}>Take picture</Text>
      </TouchableOpacity>
     */}

      <TouchableOpacity
          onPress={() => handleOnPress()}
          style={styles.buttonBorder}
      >
          <View style={styles.buttonCircle} />
      </TouchableOpacity>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  scanner: {
    flex: 1,
    aspectRatio: undefined
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
  },
  buttonText: {
    backgroundColor: "rgba(245, 252, 255, 0.7)",
    fontSize: 32,
  },
  preview: {
    width: 150,
    height: 150,
    resizeMode: 'contain'

  },
  permissions: {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonBorder: {
      width: 65,
      height: 65,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: 32.5,
      borderColor: '#FFF',
      borderWidth: 1.2,
  },
  buttonCircle: {
      width: 58,
      height: 58,
      backgroundColor: '#FFF',
      borderRadius: 29,
  }
})