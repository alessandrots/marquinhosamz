import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import { Background, ContainerCadastro, AreaInput2,
  Input, SubmitButton, LabelText,
  SubmitText, InputPassword} from '../SignIn/styles';;

import { alertMessage } from '../../util/util'

export default function ForgotPasswd() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('Alexandre.Almeida@amazoninf.com.br');

  const { user } = useContext(AuthContext);
  const { forgotPassword } = useContext(AuthContext);

  function handleForgotPasswd(){
    if (email) {
      new Promise((resolve, reject) => {
        forgotPassword(email);
        resolve(true);
      })
      .then((ret) => {
        setEmail('');
      })
      .catch((err) => {
        console.log('\n Erro no esqueci a senha. ', err);
      })
    } else {
      alertMessage('É obrigatório informar o email.', null, null, 'AIZON-SENHA');
    }
  }

 return (
   <Background>
      <ContainerCadastro
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >

        <AreaInput2>
          <LabelText>Informe seu email de acesso: </LabelText>
          <InputPassword
          placeholder="Email"
          autoCorrect={false}
          autoCapitalize="none"
          value={email}
          onChangeText={ (text) => setEmail(text) }
          />
        </AreaInput2>



        <SubmitButton onPress={handleForgotPasswd}>
            <SubmitText>Redefinir Senha</SubmitText>
        </SubmitButton>

      </ContainerCadastro>
   </Background>
  );
}