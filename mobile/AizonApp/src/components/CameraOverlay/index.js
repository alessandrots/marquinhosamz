import React from 'react';
import { Dimensions, View, Text, Alert } from 'react-native';
import Svg, { Circle, Defs, Rect, Mask, Ellipse } from 'react-native-svg';

export default function CameraOverlay(props) {

//    const CameraOverlay = () => {
  const { height, width } = Dimensions.get('window');
  const circleRadius = width / 2.5;
  const viewBox = `0 0 ${width} ${height}`;

  function alertMessage( h, w) {
    let msg = 'Altura = ' + h.toString() + ' - largura = ' + w.toString();
    console.log('Dados da tela = ', msg);

    /**
    let arr =[
      {
        text: "Ok",
        style: "ok"
      }
    ]

    Alert.alert(
        "AIZON",
        msg,
        arr,
        { cancelable: false }
    );
    */
  }

  return (
    <View aspectRatio={1}>
      <Svg
        height={height}
        viewBox={viewBox}
      >
        <Defs>
          <Mask id="mask">
            <Rect height={height} width={width} fill="#fff" />
            <Rect
              x={0.25 * width}
              y={0.2 * height}
              height={height/2}
              width={width/2}
              fill="#000" />
            {/**
              <Ellipse
                rx={circleRadius}
                ry={(height)/2.5}
                cx={width/2}
                cy={(height / 2) + 10}
                fill="#000"
              />
             */}
          </Mask>
        </Defs>

        <Rect
          height={height}
          width={width}
          fill="#ffffff"
          mask="url(#mask)"
        />
      </Svg>

      { alertMessage(height, width)}
    </View>
  );
};