import styled from 'styled-components/native';

{/*
https://stackoverflow.com/questions/29476165/image-resizing-in-react-native
*/}
 export const Background = styled.View`
 flex:1;
 background-color: #FFF;
 `;

export const Container1 = styled.View.attrs({
    //backgroundColor:"#CC0"
})`
 flex:1;
 align-items: center;
 justify-content: center;
 `;

 export const Container2 = styled.KeyboardAvoidingView.attrs({
    //backgroundColor:"#A00"
})`
 flex:2;
 align-items: center;
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
 export const Input = styled.TextInput.attrs({
     placeholderTextColor: 'rgba(240,180,47,1)'
 })`
 background: rgba(0,0,0,0.20);
 width: 60%;
 font-size: 17px;
 color: #000;
 margin-bottom: 15px;
 padding: 10px;
 border-radius: 7px;
 `;

export const InputPassword = styled.TextInput.attrs({
    placeholderTextColor: 'rgba(240,180,47,1)'
})`
background: rgba(0,0,0,0.20);
width: 60%;
font-size: 17px;
color: #000;
margin-bottom: 15px;
padding: 10px;
border-radius: 7px;
border-color: #D3CFCF;
border-width: 2px;
`;

export const SubmitButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    background-color: #0EABB5;
    width: 60%;
    height: 45px;
    border-radius: 7px;
    margin-top: 10px;
`;

export const SubmitButtonUpload = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    background-color: #0EABB5;
    width: 40%;
    height: 45px;
    border-radius: 7px;
    margin-top: 10px;
    margin-left: 20px;
`;

export const SubmitText = styled.Text`
    font-size: 20px;
    color: #131313;
`;

export const Link = styled.TouchableOpacity`
    margin-top: 25px;
    margin-bottom: 9px;
`;

export const LinkText = styled.Text`
    color: #F0B42F;
`;