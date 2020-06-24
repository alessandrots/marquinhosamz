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
