import React , {useState} from 'react';

import { Dimensions, StyleSheet, Text, TouchableOpacity,
  View, ActivityIndicator, Alert} from 'react-native';


import Svg, { Circle, Defs, Rect, Mask, Ellipse } from 'react-native-svg';
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CameraOverlay(props) {

  const [photoShot, setPhotoShot] = useState(false);
  const [loading, setLoading] = useState(false);

//    const CameraOverlay = () => {
  const { height, width } = Dimensions.get('window');
  const circleRadius = width / 2.5;
  const viewBox = `0 0 ${width} ${height}`;

  function alertMessage( h, w) {
    let msg = 'Altura = ' + h.toString() + ' - largura = ' + w.toString();
    console.log('Dados da tela = ', msg);
  }

  return (
    <View aspectRatio={1}>
      <Svg
        height={height}
        viewBox={viewBox}
      >
        <Defs>
          <Mask id="mask">
            <Rect height={height} width={width} fill="#000" />
            <Rect
              x={0.25 * width}
              y={0.2 * height}
              height={height/2}
              width={width/2}
              fill="#000" />
          </Mask>
        </Defs>

        <Rect
          height={height}
          width={width}
          fill="#ffffff"
          mask="url(#mask)"
        />
      </Svg>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
    alignItems: 'center'
  },
  camera: {
   position: "absolute",
   flex: 1,
   width: Dimensions.get("window").width,
   height: Dimensions.get("window").height,
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