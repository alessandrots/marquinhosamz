import React, { useRef, useCallback } from 'react'
import {
    View,
    TouchableOpacity,
} from 'react-native'
import { RNCamera as Camera } from 'react-native-camera'
import ImagePicker from 'react-native-image-crop-picker'


import { styles } from './styles'
import Icon from '../Icon'

function CameraScreen({
    takingPicture,
    cameraRef,
}) {

    function pickFromGallery() {
        ImagePicker.openPicker({
            cropping: true,
            multiple: false,
            includeBase64: true,
            showCropGuidelines: true,
            showCropFrame: true,
            width: 300,
            height: 400,
        }).then(image => {

            console.log('\n CameraScreen image = ', image);

            //const { data } = image

            takingPicture('data:image/jpeg;base64,' + image.data)

        }).catch((error) => {
            console.log('\n CameraScreen error = ', error);
        });
    }

    function takePhoto() {
        ImagePicker.openCamera({
            cropping: true,
            multiple: false,
            includeBase64: true,
            showCropGuidelines: true,
            showCropFrame: true,
            width: 300,
            height: 400,
        }).then(image => {

            console.log('\n photo CameraScreen image = ', image);

            //const { data } = image

            takingPicture('data:image/jpeg;base64,' + image.data)

        }).catch((error) => {
            console.log('\n CameraScreen error = ', error);
        });
    }

    return (
        <View style={styles.container}>

            <View style={styles.squareContainer}>
                <View style={styles.squareMask} />
            </View>



            <View style={styles.buttonContainer}>
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        style={styles.galleryButton}
                        onPress={() => pickFromGallery()}
                    >
                        <Icon name='gallery' fill='#FFF' width={28} height={28} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => takePhoto()}
                    style={styles.buttonBorder}
                >
                    <View style={styles.button} />
                </TouchableOpacity>

                <View style={styles.iconContainer} />

            </View>
        </View>
    )
}

export default CameraScreen