import React, { useState, createContext, useEffect} from 'react';
import firebase from '../configs/firebaseConnection';
import AsyncStorage from '@react-native-community/async-storage';
import SecurityService from '../services/security/SecurityService';

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
    /*
    // Representação de um objeto logado .. ou seja como usuário na sessão
    // para simular um usuário logado

    const [user, setUser] = useState({
        nome: 'Alessandro',
        uid: '19023091290312903901'
    });
    */

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [boarding, setBoarding] = useState(false);

    //pegar da tela de Imagem
    //const [imagesToUpload, setImagesToUpload] = useState(null); // TODO

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

    //Funcao para logar o usario
    async function signIn(email, password){
        console.log('email = ', email);
        console.log('password = ', password);

        const resposta = await SecurityService.login('/auth/login', email, password);

        console.log('signIn resposta = ', resposta);

        const res = resposta.res;

        let data = null;

        if (!res.isErro) {
            setLoading(false);
            //console.log('Status code: ',res.status);
            //console.log('Data: ',res.data);
            data = res.data;
            //setIdUpload(data.id);
            //storageIdUpload(data.id);

            let msg = "Processamento realizado com sucesso. ID: " + data.id; //+ ' => Data: '+ data.date_time;
            alertMessageUpload(msg, true, data);

        } else {
            let error = res.error;

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('error.response.data = ', error.response.data);
                console.log('error.response.status = ', error.response.status);
                console.log('error.response.headers = ', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('error.request = ', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error GENERAL = ', error.message);
            }

            console.log('error.config = ', error.config);
        }
        /**
        data = {
            uid: 8388,
            nome: 'Alessandro',
            email: 'ats@mail.com',
        };
        */

        setUser(data);
        storageUser(data);
    }

    //Cadastrar usuario
    async function signUp(email, password, nome){
        console.log('signUp ::: email => ', email);
        console.log('signUp ::: password => ', password);
        console.log('signUp ::: nome => ', nome);

        let data = {
            uid: 8388,
            nome: 'Alessandro',
            email: 'ats@mail.com',
        };
        setUser(data);
        storageUser(data);

    }

    async function storageUser(data){
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
    }

    async function storageIdUpload(id){
        console.log('storageIdUpload ');
        await AsyncStorage.setItem('CURRENT_ID_UPLOAD', JSON.stringify(id));
    }

    async function loadStorageIdUpload(){
        console.log('loadStorageIdUpload ');
        const storageUser = await AsyncStorage.getItem('CURRENT_ID_UPLOAD');
        return storageUser;
    }

    async function signOut(){
        /**
         *
         await firebase.auth().signOut();
         await AsyncStorage.clear()
         .then( () => {
            setUser(null);
         })
         */
        setUser(null);
    }

    async function savePhoto(photo) {
        await console.log('objeto photo a ser salvo = ', photo);
        //!!user
    }

    return(
     <AuthContext.Provider value={{ signed: !!user, user, loading, signUp,
     signIn, signOut, savePhoto, storageIdUpload, loadStorageIdUpload, boarding }}>
         {children}
     </AuthContext.Provider>
    );

}

export default AuthProvider;