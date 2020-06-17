import styled from 'styled-components';

import {Dimensions} from 'react-native';

export const Container = styled.View.attrs({
  flex: 1,
})``;

export const AnnotationContainer = styled.View.attrs({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fc6663',
  borderRadius: 5,
  padding: 5,
})``;

export const AnnotationText = styled.Text.attrs({
  fontSize: 14,
  color: '#fff',
})``;

export const NewButtonContainer = styled.TouchableHighlight.attrs({
  position: 'absolute',
  bottom: 54,
  left: 20,
  right: 20,
  alignSelf: 'center',
  borderRadius: 5,
  paddingVertical: 20,
  backgroundColor: '#fc6663',
})``;

export const ButtonsWrapper = styled.View.attrs({
  position: 'absolute',
  bottom: 54,
  left: 20,
  right: 20,
})``;

export const CancelButtonContainer = styled.TouchableHighlight.attrs({
  alignSelf: 'stretch',
  borderRadius: 5,
  paddingVertical: 20,
  backgroundColor: '#555',
  marginTop: 20,
})``;

export const SelectButtonContainer = styled.TouchableHighlight.attrs({
  alignSelf: 'stretch',
  borderRadius: 5,
  paddingVertical: 20,
  backgroundColor: '#fc6663',
})``;

export const ButtonText = styled.Text.attrs({
  color: '#fff',
  fontSize: 16,
  textAlign: 'center',
  fontWeight: 'bold',
})``;

export const Marker = styled.Image.attrs({
  width: 60,
  height: 60,
  position: 'absolute',
  alignSelf: 'center',
})`
  top: ${Dimensions.get('window').height / 2 - 60};
`;

export const ModalContainer = styled.View.attrs({
  flex: 1,
  backgroundColor: '#CC0000',
})``;

export const ModalImagesListContainer = styled.View``;

export const ModalImagesList = styled.ScrollView.attrs({
  paddingHorizontal: 20,
  paddingTop: 20,
})``;

export const ModalImageItem = styled.Image.attrs({
  height: 100,
  width: 100,
  marginRight: 10,
})``;

export const ModalButtons = styled.View.attrs({
  paddingHorizontal: 5,
  paddingVertical: 0,
  //backgroundColor: 'rgba(52, 52, 52, 0.8)',
  flexDirection: 'row',
  justifyContent: 'space-between',
})``;

export const CameraButtonContainer = styled.TouchableHighlight.attrs({
  paddingVertical: 20,
  paddingHorizontal: 40,
})`
    align-items: center;
    justify-content: center;
    background-color: #0EABB5;
    width: 40%;
    height: 35px;
    border-radius: 7px;
    margin-top: 10px;
`;

export const CancelButtonText = styled.Text.attrs({
})`
color: #FFFFFF;
font-size: 18px;
font-weight: bold;
`;

export const ContinueButtonText = styled.Text.attrs({
})`
color: rgba(240,180,47,1);
font-size: 18px;
font-weight: bold;
`;


