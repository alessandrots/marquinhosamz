import styled from 'styled-components/native';

export const Background = styled.View`
 flex:1;
 background-color: #FFF;
 flex-direction: column;
`;

export const ContainerHeader = styled.View`
    background-color: #FF0000;
    flex-direction: row;
    justify-content: flex-start;

    /** de acordo com a altura e largura do componente */
    width: 100%;
    height: 30px;
`;

export const ContainerMain = styled.View`
 flex:1;
 /** background-color: #BDBDBD */
 background-color: #FFF
`;

export const ContainerFooter = styled.View`
 background-color: #CC0;
 flex-direction: row;

 /** de acordo com a altura e largura do componente */
 justify-content: flex-start;
 width: 100%;
 height: 30px;

`;

export const ModalImagesListContainer = styled.View``;

export const ModalButtons = styled.View.attrs({
  paddingHorizontal: 10,
  paddingVertical: 5,
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
    width: 60%;
    height: 45px;
    border-radius: 7px;
    margin-top: 10px;
`;