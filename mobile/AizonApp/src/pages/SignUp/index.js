import React, {useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import { Background, Container2, Container1, Logo, AreaInput, Input, SubmitButton,
SubmitText} from '../SignIn/styles';

{/* */}
export default function SignUp() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user } = useContext(AuthContext);
  const { signUp } = useContext(AuthContext);

  function handleSignUp(){
    signUp(email, password, nome);

    console.log('SignUp => ', user);
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
          placeholder="Senha"
          autoCorrect={false}
          autoCapitalize="none"
          value={password}
          onChangeText={ (text) => setPassword(text) }
          />
        </AreaInput>

        <SubmitButton onPress={handleSignUp}>
            <SubmitText>Cadastrar</SubmitText>
        </SubmitButton>

      </Container2>
   </Background>
  );
}