import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import { Background, Container2, AreaInput, Input, SubmitButton,
SubmitText, InputPassword} from '../SignIn/styles';

import { alertMessage } from '../../util/util'

export default function SignUp() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('Fillipe Freire');
  const [email, setEmail] = useState('Fillipe.Freire@amazoninf.com.br');
  const [username, setUsername] = useState('Fillipe.Freire');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');

  const { user } = useContext(AuthContext);
  const { signUp } = useContext(AuthContext);

  function handleSignUp(){
    if (password === confirmPassword) {
      signUp(email, password, nome, username);
    } else {
      alertMessage( 'As senhas precisam ser iguais.', null, null, 'AIZON-CADASTRO')
    }
    //console.log('SignUp => ', user);
  }


 return (
   <Background>
      <Container2
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >
         <AreaInput>
          <Input
          placeholder="Nome"
          autoCorrect={false}
          autoCapitalize="none"
          value={nome}
          onChangeText={ (text) => setNome(text) }
          />
        </AreaInput>

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
          placeholder="Username"
          autoCorrect={false}
          autoCapitalize="none"
          value={username}
          onChangeText={ (text) => setUsername(text) }
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

        <AreaInput>
          <InputPassword
          placeholder="Confirmar Senha"
          autoCorrect={false}
          autoCapitalize="none"
          value={confirmPassword}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          onChangeText={ (text) => setConfirmPassword(text) }
          />
        </AreaInput>

        <SubmitButton onPress={handleSignUp}>
            <SubmitText>Cadastrar</SubmitText>
        </SubmitButton>

      </Container2>
   </Background>
  );
}