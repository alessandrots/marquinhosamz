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
  const { forgotPasswd } = useContext(AuthContext);

  function handleForgotPasswd(){
    if (email) {
      forgotPasswd(email);
    } else {
      alertMessage('É obrigatório informar o email.', null, null, 'AIZON-LEMBRAR SENHA');
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