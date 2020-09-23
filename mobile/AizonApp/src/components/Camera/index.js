import React, { useState, useRef } from 'react'

import {
    View,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native'

import CameraScreen from '../CameraScreen'
import { styles } from './styles'
import ImageScreen from '../ImageScreen'

import OpenCV from '../../NativeModules/OpenCV'

function Camera() {

    const [ isTakingPicture, setIsTakingPicture ] = useState(false)
    const [image, setImage] = useState(null)
    let cameraRef = useRef(null)

    async function takingPicture(image = undefined) {
        try {

            console.log('\n CameraScreen0 image = ', image);
            let imageLocal = ''

            setIsTakingPicture(true)

            if(image !== undefined) {

                imageLocal = image

            } else {

                const options = { quality: 0.8, base64: true }

                if(cameraRef.current) {
                    const data = await cameraRef.current.takePictureAsync(options)
                    imageLocal = data.base64
                }
            }

            console.log('\n CameraScreen2 imageLocal = ', imageLocal);
            scanImage(imageLocal);

            //setImage(imageLocal);
            //setIsTakingPicture(false);


        } catch(error) {
            console.log('err',error)
            setIsTakingPicture(false)
        }
    }

    function scanImage(image) {
        if(Platform.OS === 'android') {
            OpenCV.callAlessandro(image, (err) => {
                setImage(null)
                setIsTakingPicture(false)
                Alert.alert(
                    'Atenção',
                    'Nenhuma imagem detectada',
                    [
                        {text: 'Ok', onPress: () => {}},
                    ],
                    {cancelable: false},
                )
            },  (data) => {

                console.log('\n CameraScreen3 data = ', data);
                setImage(data);
                setIsTakingPicture(false);
            })
        }
    }

    return(
        <View style={styles.container}>

            { isTakingPicture && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='orange' />
                </View>
            )}

            { (image === null) && <CameraScreen
                takingPicture={takingPicture}
                cameraRef={cameraRef}
            />}

            {(!isTakingPicture && image !== null) && <ImageScreen image={image} setImage={setImage} />}

        </View>
    )
}

export default Camera