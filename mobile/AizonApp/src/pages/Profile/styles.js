import styled from 'styled-components/native';

export const Container = styled.View`
    justify-content: flex-start;
    align-items: flex-start;
    width: 70%;
    height: 20px;
`;

export const AreaImage = styled.View.attrs({

})`
    width: 70%;
    height: 20px;
    justify-content: flex-start;
    align-items: flex-start;
 `;

 export const Logo = styled.Image.attrs({
    width: 100,
    height:90,
    backgroundColor:"#FFF",
    resizeMode: 'center'
})`
 margin-bottom: 15px;
 `;

export const Nome = styled.Text`
text-align: center;
font-size: 14px;
margin-top: 15px;
color: #000;
`;
