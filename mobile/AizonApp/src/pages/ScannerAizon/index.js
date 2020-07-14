import React, {useContext} from 'react';

import { View, Image } from "react-native"

import Scanner from "react-native-rectangle-scanner"

import { AuthContext } from '../../contexts/auth';


export default function ScannerAizon(props) {

    function handleOnPictureProcessed (croppedImage,initialImage) {
        props.doSomethingWithCroppedImagePath(croppedImage);
        props.doSomethingWithOriginalImagePath(initialImage);
    }

    function onCapture(){
        camera.current.capture();
    }

    return (
      <Scanner
        onPictureProcessed={() => handleOnPictureProcessed}
        ref={camera}
        style={{flex: 1}}
      />
    )
}