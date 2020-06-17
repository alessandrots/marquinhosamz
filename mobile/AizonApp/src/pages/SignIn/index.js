import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/auth';

import { Background, Container2, Container1, Logo, AreaInput, Input, SubmitButton,
SubmitText, Link, LinkText, AreaImage} from './styles';

{/*
https://medium.com/reactbrasil/consumindo-api-rest-com-autentica%C3%A7%C3%A3o-jwt-no-react-native-eec62b852ff3
*/}
export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user } = useContext(AuthContext);

  const { signIn } = useContext(AuthContext);


  function handleLogin(){
    signIn(email, password);
  }

 return (
   <Background>
      <Container1
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >
        <AreaImage>
             <Logo source={require('../../assets/logo_aizon.png')}/>
        </AreaImage>

      </Container1>

      <Container2>

        <AreaInput>
          <Input
          placeholder="Email"
          autoCorrect={false}
          autoCapitalize="none"
          value={email}
          onChangeText={ (text) => setEmail(text) }
          />
        </AreaInput>

        <AreaInput>
          <Input
          placeholder="Senha"
          autoCorrect={false}
          autoCapitalize="none"
          value={password}
          onChangeText={ (text) => setPassword(text) }
          />
        </AreaInput>

        <SubmitButton onPress={handleLogin}>
            <SubmitText>Acessar</SubmitText>
        </SubmitButton>

        <Link onPress={ () => navigation.navigate('SignUp')}>
            <LinkText>Criar uma conta!</LinkText>
        </Link>

      </Container2>
   </Background>
  );
}