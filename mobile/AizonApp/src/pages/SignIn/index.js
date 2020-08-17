import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import { AuthContext } from '../../contexts/auth';

import { Background, Container2, Container1, Logo, AreaInput, Input, SubmitButton,
SubmitText, Link, LinkText, AreaImage, InputPassword} from './styles';

import {  storageBoardingPage, loadBoardingPage, loadTermoUso, alertMessage} from '../../util/util';

{/*
https://medium.com/reactbrasil/consumindo-api-rest-com-autentica%C3%A7%C3%A3o-jwt-no-react-native-eec62b852ff3
*/}
export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('Alexandre.Almeida@amazoninf.com.br');
  const [password, setPassword] = useState('123456');
  const [termoUsoStore, setTermoUsoStore] = useState(false);

  const { signIn, refreshToken } = useContext(AuthContext);

  async function handleLogin(){
    const boardingPage = await loadBoardingPage();

    const retTermoUso = await loadTermoUso();

    console.log('useEffect loadTermoUso = ', retTermoUso);

    console.log('handleLogin loadBoardingPage boardingPage = ', boardingPage);

    if (!boardingPage) {
      console.log('handleLogin storageBoardingPage = ');
      await storageBoardingPage();
    }

    if (!retTermoUso) {
      console.log('handleLogin retTermoUso = ', retTermoUso);
      alertMessage('É obrigatório aceitar o Termo de Uso', null, null, 'Aizon-Login');
      return;
    }

    signIn(email, password);
  }

  async function showTermoUso() {


    const retTermoUso = await loadTermoUso();

    console.log('useEffect loadTermoUso = ', data);

    if (data) {
      setTermoUsoStore(true);
    }

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

          <Link onPress={ () => navigation.navigate('TermoUso')}>
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