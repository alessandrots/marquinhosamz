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

export const ContainerScreenHeader = styled.View`
 flex:1;
 justify-content: flex-start;
 padding-top: 20px;
 align-items: center;
`;

export const HeaderTitle = styled.Text`
    font-size: 18px;
    color: #000;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
`;

export const ContainerScreenImage = styled.View`
 flex:3;
 justify-content: flex-start;
 align-items: center;
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
    margin-left: 20px;
    margin-right: 20px;
`;

export const SubmitText = styled.Text`
    font-size: 20px;
    color: #131313;
    margin-left: 20px;
    margin-right: 20px;
`;
