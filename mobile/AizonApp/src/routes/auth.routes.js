{
    /**
     * cadastro de login, login, etc
     * rotas não logadas
    */
}
import React, {useState, useEffect} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPasswd from '../pages/ForgotPasswd'
import Boarding from '../pages/Boarding';
import TermoUso from '../pages/TermoUso';

import {  loadBoardingPage } from '../util/util';

import { AuthContext } from '../contexts/auth';

function AuthRoutes() {
    const AuthStack = createStackNavigator();
    const BoardingStack = createStackNavigator();

    //const { boarding } = useContext(AuthContext);

    const [boarding, setBoarding] = useState(false);

    useEffect(()=> {
       async function loadStorage(){
           const boardingPage = await loadBoardingPage();

           console.log('useEffect AuthRoutes boardingPage = ', boardingPage);

            if (boardingPage) {
                setBoarding(true);
            }
       }

       loadStorage();
    }, []);

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

                <AuthStack.Screen
                    name="TermoUso"
                    component={TermoUso}
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
                        headerTitle: 'Termo de Uso'
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

                <BoardingStack.Screen
                    name="TermoUso"
                    component={TermoUso}
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
                        headerTitle: 'Termo de Uso'
                    }}
                />
            </BoardingStack.Navigator>
        );
    }

    function getMontagemTela() {
        console.log('getMontagemTela = ', boarding);

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