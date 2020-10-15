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

export const ContainerFooter = styled.View`
 background-color: #CC0;
 flex-direction: row;

 /** de acordo com a altura e largura do componente */
 justify-content: flex-start;
 width: 100%;
 height: 30px;

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
    width: 100px;
    height: 30px;
    margin-top: 10px;
    margin-left: 20px;
    border-radius: 7px;
`;

export const SubmitText = styled.Text`
    font-size: 15px;
    color: #F0B42F;;
    font-weight: bold;
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
