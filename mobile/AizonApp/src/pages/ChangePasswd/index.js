import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import { Background, ContainerCadastro, AreaInput2,
  Input, SubmitButton, LabelText,
  SubmitText, InputPassword} from '../SignIn/styles';;

import { alertMessage } from '../../util/util'

export default function ChangePasswd() {
  const navigation = useNavigation();

  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');

  const { user } = useContext(AuthContext);
  const { changePasswd } = useContext(AuthContext);

  function handleChangePasswd(){
    if (password === confirmPassword) {
      changePasswd(password);
    } else {
      alertMessage( 'As senhas precisam ser iguais.', null, null, 'AIZON-CADASTRO')
    }
    //console.log('ChangePasswd => ', user);
  }


 return (
   <Background>
      <ContainerCadastro
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        enabled
      >

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

        <SubmitButton onPress={handleChangePasswd}>
            <SubmitText>Alterar</SubmitText>
        </SubmitButton>

      </ContainerCadastro>
   </Background>
  );
}