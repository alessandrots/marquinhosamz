import React, { useState, createContext, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import SecurityService from '../services/security/SecurityService';

import { storeTokenUser, deleteTokenUser, storageUser, alertMessage } from '../util/util';
//import { DrawerActions } from '@react-navigation/native';

export const AuthContext = createContext({});

{/*
    https://medium.com/reactbrasil/entendendo-a-context-api-do-react-criando-um-componente-de-loading-a84f84007dc7
    https://blog.rocketseat.com.br/context-api-react-16-ciclo-de-vida/

    Contexto (context) é indicado para compartilhar dados que podem ser considerados
    “globais” para a árvore de componentes do React. Usuário autenticado ou o idioma
    preferido, são alguns casos comuns. No exemplo do código a seguir, nós passamos
    um tema para a fim de estilizar o componente Button.
*/}

function AuthProvider({ children }){
    // Representação de um objeto logado .. ou seja como usuário na sessão
    // para simular um usuário logado
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [boarding, setBoarding] = useState(false);

    useEffect(()=> {
       async function loadStorage(){
           const storageUser = await AsyncStorage.getItem('Auth_user');

           const boardingPage = await AsyncStorage.getItem('boardingPage');

           if(storageUser){
            setUser(JSON.parse(storageUser));
            setLoading(false);
           }

           if (boardingPage) {
            setBoarding(true);
           }

           setLoading(false);
       }

       loadStorage();
    }, []);

    /**
    async function signIn(email, password){
        console.log('email = ', email);
        console.log('signIn FAKE!');

        let data = {
            id: 8388,
            name: 'Alessandro Santos',
            email: 'ats@mail.com',
            username: 'atssantos2000'
        };

        setUser(data);

        storageUser(data);
    }
    */

    //Funcao para logar o usario
    async function signIn(email, password){
        const resposta = await SecurityService.login('/register/auth/login', email, password);

        const res = resposta.res;

        if (!resposta.isErro) {
            setLoading(false);

            let data = res.data;

            //storeTokenUser(token);
            if (data && data.token && data.id) {
                console.log('====================================');
                console.log(data.token);
                console.log('====================================');
                storeTokenUser(data.token).then(() => {
                    getUserForStorage(data.id);
                  }).catch(() => {
                      console.log('\n Houve erro na gravação do token \n ');
                });
            } else {
                alertMessage( 'Houve erro na geração do token de autenticação.', null, null, 'AIZON-LOGIN')
            }
        } else {
            alertMessage( 'Houve erro na autenticação', null, null, 'AIZON-LOGIN');
        }
    }

    async function getUserForStorage(idUser) {
        const resposta = await SecurityService.getUserForID('/register/users', idUser);

        if (!resposta.isErro) {
            data = resposta.res.data.data;

            let user = {
                id: data.id,
                name: data.name,
                email: data.email,
                username: data.username,
                userProfile : data.user_profile
            };

            //guardando o objeto user no state
            setUser(user);

            //guardando user no AsyncStorage
            storageUser(user);
        } else {
            alertMessage( 'Houve erro na recuperação do usuário', null, null, 'AIZON-LOGIN')
        }
    }

    //Cadastrar usuario
    async function signUp(email, password, name, username){

        let data = {
            name: name,
            username: username,
            password: password,
            email: email
        };

        saveUser(data);
    }

    async function saveUser(data) {
        const resposta = await SecurityService.registerNewUser('/register/users', data);

        if (!resposta.isErro) {
            data = resposta.res.data.data;

            console.log('saveUser data = ', data);

            alertMessage( 'Usuário cadastrado com sucesso', null, null, 'AIZON-LOGIN')

        } else {
            alertMessage( 'Houve erro no cadastro do usuário', null, null, 'AIZON-LOGIN')
        }
    }

    async function changePasswd(password) {
        const resposta = await SecurityService.changePasswd('/register/auth/change_password', user.id, password);

        if (!resposta.isErro) {
            data = resposta.res.data.data;

            console.log('changePasswd data = ', data);
        } else {
            alertMessage( 'Houve erro na troca de senha do usuário', null, null, 'AIZON-SENHA')
        }
    }

    async function forgotPassword(email) {
        const resposta = await SecurityService.forgotPassword('/register/auth/forgot_password', email);

        if (!resposta.isErro) {
            data = resposta.res.data.message;

            alertMessage( 'Email para troca de senha enviado com sucesso', null, null, 'AIZON-SENHA')
        } else {
            alertMessage( 'Houve erro na solicitação de senha do usuário', null, null, 'AIZON-SENHA')
        }
    }

    async function refreshToken() {
        const resposta = await SecurityService.changePasswd('/register/auth/refresh_token', user.id);

        console.log('refreshToken resposta = ', resposta);

        if (!resposta.isErro) {
            data = resposta.res.data;

            console.log('refreshToken data = ', data);

            if (data && data.token) {
                console.log('====================================');
                console.log(data.token);
                console.log('====================================');

                deleteTokenUser(data.token).then(() => {
                    storeTokenUser(data.token).then(() => {
                        //
                    }).catch(() => {
                          console.log('\n Houve erro na gravação do novo token \n ');
                    });
                }).catch(() => {
                      console.log('\n Houve erro na deleção do token \n ');
                });
            } else {
                alertMessage( 'Houve erro na geração do token de autenticação.', null, null, 'AIZON-LOGIN')
            }
        } else {
            alertMessage( 'Houve erro na troca de senha do usuário', null, null, 'AIZON-SENHA')
        }
    }

    async function signOut(){
        deleteTokenUser();

        setUser(null);
    }

    async function storageIdUpload(id){
        await AsyncStorage.setItem('CURRENT_ID_UPLOAD', JSON.stringify(id));
    }

    async function loadStorageIdUpload(){
        const storageUser = await AsyncStorage.getItem('CURRENT_ID_UPLOAD');
        return storageUser;
    }

    async function savePhoto(photo) {
        await console.log('objeto photo a ser salvo = ', photo);
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, user, loading, signUp,
        signIn, signOut, changePasswd, forgotPassword, savePhoto, storageIdUpload,
        refreshToken, loadStorageIdUpload, boarding }}>
            {children}
        </AuthContext.Provider>
    );

}

export default AuthProvider;