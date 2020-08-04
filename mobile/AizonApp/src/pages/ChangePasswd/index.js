import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { Background, ContainerMain, AreaInput2,
  Input, SubmitButton, LabelText, ContainerHeader, ContainerFooter,
  SubmitText, InputPassword} from './styles';;

import { alertMessage } from '../../util/util'

export default function ChangePasswd() {
  const navigation = useNavigation();

  const [password, setPassword] = useState('1234567');
  const [confirmPassword, setConfirmPassword] = useState('1234567');

  const { user } = useContext(AuthContext);
  const { changePasswd } = useContext(AuthContext);

  function handleChangePasswd(){
    if (password === confirmPassword) {
      changePasswd(password);
    } else {
      alertMessage( 'As senhas precisam ser iguais.', null, null, 'AIZON-CADASTRO')
    }
  }


 return (
   <Background>
      <ContainerHeader>
          <Header titlePage="Alterar Senha"/>
      </ContainerHeader>

      <ContainerMain>

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

      </ContainerMain>

      <ContainerFooter>
            <Footer titlePage="AIZON"/>
      </ContainerFooter>

   </Background>
  );
}