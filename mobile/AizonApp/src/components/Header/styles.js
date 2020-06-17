import styled from 'styled-components/native';

export const Container = styled.View`
    flex-direction: row;
    background-color: #0EABB5;
    justify-content: flex-start;
    /*
    align-items: flex-start;
    margin-top: 15px;
    margin-left: 15px;
    margin-bottom: 25px;
    */
    width: 100%;
    height: 30px;
`;

export const ViewInt = styled.View`
    flex-direction: row;
    margin-left: 10px;
`;

export const ButtonMenu = styled.TouchableWithoutFeedback`
    justify-content: center;
    align-items: center;

`;

export const TheTitle = styled.Text`
    font-size: 18px;
    color: #000;
    font-weight: bold;
    padding-left: 60px;
`;