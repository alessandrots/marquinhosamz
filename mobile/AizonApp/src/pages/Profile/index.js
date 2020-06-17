import React, {useContext} from 'react';
import {Container, Nome, AreaImage, Logo} from './styles';
import { AuthContext } from '../../contexts/auth';


export default function Profile() {

  const { user } = useContext(AuthContext);


 return (
  <Container>
      {/** <Header/> */}
      <AreaImage>
             <Logo source={require('../../assets/logo_aizon.png')}/>
            <Nome>
              {user && user.nome}
            </Nome>
      </AreaImage>


   </Container>
  );
}
