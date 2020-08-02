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

export const ContainerImageRight = styled.View`
 flex:3;
 margin-top: 10px;
 /** background-color: #CC0000; */
 align-items:center;
 flex-direction: column;
`;

export const ContainerImageLeft = styled.View`
 flex:5;
 /** background-color: #CCC000;*/
 /**align-items:center;
 margin-top: 10px;
 */
 flex-direction: row;
`;

export const ContainerDadosView = styled.View`
 flex:1;
 /** background-color: #00d2ff;*/
 justify-content: flex-start;
 align-items: flex-start ;
 flex-direction: column;
`;

export const ContainerScreenButton = styled.View`
 flex:1;
 justify-content: flex-start;
 align-items: center;
`;

export const SendImageBackground = styled.ImageBackground.attrs({
  flex: 1,
  resizeMode: "cover",
  justifyContent: "center",
})``;

export const SubmitButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    background-color: #0EABB5;
    width: 170px;
    height: 30px;
    border-radius: 10px;
`;

export const SubmitText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-left: 20px;
    margin-right: 20px;
`;

export const TitleText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-top: 5px;
    margin-bottom: 15px;
    margin-left: 8px;
    align-items:flex-start;
    font-weight: bold;
`;
export const ItemText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-left: 8px;
    align-items:flex-start;
    margin-top: 10px;
`;