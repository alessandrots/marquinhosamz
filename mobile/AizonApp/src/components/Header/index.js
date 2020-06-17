import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import {Container, ButtonMenu, ViewInt, TheTitle} from './styles';

export default function Header(props) {
 const navigation = useNavigation();

 return (
   <Container>
       <ViewInt>
        <ButtonMenu onPress={ () => navigation.toggleDrawer() }>
          <Icon name="menu" color="#F0B42F" size={25} />
        </ButtonMenu>
        <TheTitle>{props.titlePage}</TheTitle>
       </ViewInt>
   </Container>
  );
}