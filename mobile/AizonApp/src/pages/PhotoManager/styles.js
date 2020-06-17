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
 flex:2;
 /** background-color: #CC0000;*/
 align-items:center;
 flex-direction: row;
`;

export const ContainerImageLeft = styled.View`
 flex:2;
 /** background-color: #CCC000;*/
 align-items:center;
 flex-direction: row;
`;

export const ContainerImagens = styled.View`
 flex:2;
 /** background-color: #00FFFC;*/
 align-items:center;
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
 flex-direction: row;
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
    width: 45%;
    height: 45px;
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 7px;
`;

export const SubmitText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-left: 10px;
    margin-right: 10px;
`;

export const TitleText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-top: 5px;
    margin-left: 8px;
    align-items:flex-start;
    font-weight: bold;
`;
export const ItemText = styled.Text`
    font-size: 15px;
    color: #131313;
    margin-left: 8px;
    align-items:flex-start;
    margin-top: 20px;
`;

export const Link = styled.TouchableOpacity`
    margin-top: 25px;
    margin-bottom: 9px;
    margin-left: 20px;
`;

export const LinkText = styled.Text`
    color: #F0B42F;
    font-weight: bold;
`;
