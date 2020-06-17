import React, {useContext}from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { AuthContext } from '../contexts/auth';

function Routes() {

const { signed, loading } = useContext(AuthContext);

// como é async a função de signin, esse tratamento aqui é para não
// aparecer a tela de login até a verificação do AsyncStorage ser realizada
// q vai permitir enviar diretamente para a tela Home
//signed ? <AppRoutes/> : <AuthRoutes/>
if(loading){
    return(
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0EABB5" />
        </View>
    )
}

 return (
  signed ? <AppRoutes/> : <AuthRoutes/>
  );
}

export default Routes;