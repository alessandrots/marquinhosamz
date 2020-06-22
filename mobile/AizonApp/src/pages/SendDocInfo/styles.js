import styled from 'styled-components/native';

export const Background = styled.View`
 flex:1;
 background-color: #FFF;
 flex-direction: column;
`;

export const ContainerMain = styled.View`
 flex:1;
 background-color: #FFF;
 justify-content: center;
 align-items: center;
`;

export const ContainerImageRight = styled.View`
 flex:4;
 margin-top: 10px;
 /** background-color: #CC0000;*/
 align-items:center;
 flex-direction: row;
`;

export const ContainerImageLeft = styled.View`
 flex:4;
 /** background-color: #CCC000;*/
 align-items:center;
 flex-direction: row;
 margin-top: 20px;
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
    width: 130px;
    height: 40px;
    border-radius: 10px;
`;

export const SubmitText = styled.Text`
    font-size: 20px;
    color: #131313;
    margin-left: 20px;
    margin-right: 20px;
`;

export const TitleText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-top: 15px;
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

