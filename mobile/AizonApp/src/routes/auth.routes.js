{
    /**
     * cadastro de login, login, etc
     * rotas não logadas
    */
}
import React, {useContext} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPasswd from '../pages/ForgotPasswd'
import Boarding from '../pages/Boarding';

import { AuthContext } from '../contexts/auth';

function AuthRoutes() {
    const AuthStack = createStackNavigator();
    const BoardingStack = createStackNavigator();

    const { boarding } = useContext(AuthContext);

    function getAuthStack() {
        return (
            <AuthStack.Navigator>
                <AuthStack.Screen
                    name="Login"
                    component={SignIn}
                    options={{
                        headerStyle: {
                            backgroundColor: '#0EABB5',
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                }}
                />

                <AuthStack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{
                        headerStyle:{
                            backgroundColor: '#0EABB5',
                            borderBottomWidth: 1,
                            borderBottomColor: '#00b94a'
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerBackTitleVisible: false,
                        headerTitle: 'Cadastro Usuário'
                    }}
                />

                <AuthStack.Screen
                    name="ForgotPasswd"
                    component={ForgotPasswd}
                    options={{
                        headerStyle:{
                            backgroundColor: '#0EABB5',
                            borderBottomWidth: 1,
                            borderBottomColor: '#00b94a'
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerBackTitleVisible: false,
                        headerTitle: 'Esqueci a Senha'
                    }}
                />
            </AuthStack.Navigator>
        );
    }

    function getBoardingStack() {
        return (
            <BoardingStack.Navigator>
                <BoardingStack.Screen
                    name="AIZON Documentos"
                    component={Boarding}
                    options={{
                        headerStyle: {
                            backgroundColor: '#0EABB5',
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                }}
                />

                <BoardingStack.Screen
                    name="Login"
                    component={SignIn}
                    options={{
                        headerStyle: {
                            backgroundColor: '#0EABB5',
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerLeft: null
                }}
                />

                <BoardingStack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{
                        headerStyle:{
                            backgroundColor: '#0EABB5',
                            borderBottomWidth: 1,
                            borderBottomColor: '#00b94a'
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerBackTitleVisible: false,
                        headerTitle: 'Voltar'
                    }}
                />
            </BoardingStack.Navigator>
        );
    }

    function getMontagemTela() {

        if (boarding){
            return getAuthStack();
        } else {
            return getBoardingStack();
        }
    }

    return (
        getMontagemTela()
    )
}

export default AuthRoutes;