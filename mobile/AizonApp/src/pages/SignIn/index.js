import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/auth';

import { Background, Container2, Container1, Logo, AreaInput, Input, SubmitButton,
SubmitText, Link, LinkText, AreaImage, InputPassword} from './styles';

{/*
https://medium.com/reactbrasil/consumindo-api-rest-com-autentica%C3%A7%C3%A3o-jwt-no-react-native-eec62b852ff3
*/}
export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('Alexandre.Almeida@amazoninf.com.br');
  const [password, setPassword] = useState('123456');

  const { signIn, refreshToken } = useContext(AuthContext);

  function handleLogin(){
    signIn(email, password);
  }

  function showTermoUso() {
    console.log('====================================');
    console.log('SHOW TERMO DE USO call navigate');
    console.log('====================================');
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
          <InputPassword
          placeholder="Senha"
          autoCorrect={false}
          autoCapitalize="none"
          value={password}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          onChangeText={ (text) => setPassword(text) }
          />
        </AreaInput>

        <SubmitButton onPress={handleLogin}>
            <SubmitText>Acessar</SubmitText>
        </SubmitButton>

        <Link onPress={ () => showTermoUso}>
            <LinkText>Termo de Uso</LinkText>
        </Link>

        <Link onPress={ () => navigation.navigate('SignUp')}>
            <LinkText>Criar uma conta</LinkText>
        </Link>

        <Link onPress={ () => navigation.navigate('ForgotPasswd')}>
            <LinkText>Esqueci a Senha</LinkText>
        </Link>



      </Container2>
   </Background>
  );
}