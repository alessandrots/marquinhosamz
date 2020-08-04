import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, Text } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import { Background, ContainerCadastro, AreaInput2,
Input, SubmitButton, LabelText,
SubmitText, InputPassword} from '../SignIn/styles';

import { alertMessage } from '../../util/util'

export default function SignUp() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('Fillipe23 Freire');
  const [email, setEmail] = useState('Fillipe23.Freire@amazoninf.com.br');
  const [username, setUsername] = useState('Fillipe23.Freire');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');

  const { user } = useContext(AuthContext);
  const { signUp } = useContext(AuthContext);

  function handleSignUp(){
    if (password === confirmPassword) {

      new Promise((resolve, reject) => {
        signUp(email, password, nome, username);
        resolve(true);
      })
      .then((ret) => {
        setEmail('');
        setNome('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        console.log('\n Erro no esqueci a senha. ', err);
      })
    } else {
      alertMessage( 'As senhas precisam ser iguais.', null, null, 'AIZON-CADASTRO')
    }
  }


 return (
   <Background>
      <ContainerCadastro
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >
        <AreaInput2>
          <LabelText>Username: </LabelText>
          <Input
          placeholder="Username"
          autoCorrect={false}
          autoCapitalize="none"
          value={username}
          onChangeText={ (text) => setUsername(text) }
          />
        </AreaInput2>

         <AreaInput2>
          <LabelText>Nome Completo: </LabelText>
          <Input
          placeholder="Nome"
          autoCorrect={false}
          autoCapitalize="none"
          value={nome}
          onChangeText={ (text) => setNome(text) }
          />
        </AreaInput2>

        <AreaInput2>
          <LabelText>Email: </LabelText>
          <Input
          placeholder="Email"
          autoCorrect={false}
          autoCapitalize="none"
          value={email}
          onChangeText={ (text) => setEmail(text) }
          />
        </AreaInput2>

        <AreaInput2>
          <LabelText>Senha: </LabelText>
          <InputPassword
          placeholder="Senha"
          autoCorrect={false}
          autoCapitalize="none"
          value={password}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          onChangeText={ (text) => setPassword(text) }
          />
        </AreaInput2>

        <AreaInput2>
          <LabelText>Confirmar Senha: </LabelText>
          <InputPassword
          placeholder="Confirmar Senha"
          autoCorrect={false}
          autoCapitalize="none"
          value={confirmPassword}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          onChangeText={ (text) => setConfirmPassword(text) }
          />
        </AreaInput2>

        <SubmitButton onPress={handleSignUp}>
            <SubmitText>Cadastrar</SubmitText>
        </SubmitButton>

      </ContainerCadastro>
   </Background>
  );
}