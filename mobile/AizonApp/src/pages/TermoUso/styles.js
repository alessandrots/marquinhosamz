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

export const Container1 = styled.View.attrs({
    //backgroundColor:"#CC0"
})`
 flex:1;
 justify-content: flex-start;
 `;

 export const Container2 = styled.KeyboardAvoidingView.attrs({
    //backgroundColor:"#A00"
})`
 flex:5;
 justify-content: flex-start;
 padding-top: 20px;
 `;

 export const AreaImage = styled.View.attrs({
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
})`

 `;

 export const Logo = styled.Image.attrs({
    width: 150,
    height:120,
    backgroundColor:"#FFF",
    resizeMode: 'center'
})`
 margin-bottom: 15px;
 `;

 export const AreaInput = styled.View`
 flex-direction: row;
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

export const AreaText = styled.Text`
    font-size: 16px;
    color: #131313;
    padding-left: 40px;
    padding-right: 40px;
`;

export const AreaInfoText = styled.Text`
    font-size: 22px;
    color: #CC0000;
    padding-left: 40px;
    padding-right: 40px;
`;

export const AreaTitleText = styled.Text`
    font-size: 22px;
    color: #131313;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 2px;
    font-weight: bold;
`;

export const SubmitButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    background-color: #0EABB5;
    width: 40%;
    height: 40px;
    border-radius: 7px;
    margin-top: 10px;
`;

export const SubmitText = styled.Text`
    font-size: 18px;
    color: #131313;
`;