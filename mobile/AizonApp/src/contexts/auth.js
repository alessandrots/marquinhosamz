import React, { useState, createContext, useEffect} from 'react';
import firebase from '../configs/firebaseConnection';
import AsyncStorage from '@react-native-community/async-storage';

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

    //pegar da tela de Imagem
    //const [imagesToUpload, setImagesToUpload] = useState(null); // TODO

    useEffect(()=> {
       async function loadStorage(){
           const storageUser = await AsyncStorage.getItem('Auth_user');

           if(storageUser){
               setUser(JSON.parse(storageUser));
               setLoading(false);
           }

           setLoading(false);
       }

       loadStorage();
    }, []);

    //Funcao para logar o usario
    async function signIn(email, password){
        console.log('email = ', email);
        console.log('password = ', password);
        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then(async (value)=>{
            console.log('uid = ', uid);
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).once('value')
            .then((snapshot)=>{
                let data = {
                  uid: uid,
                  nome: snapshot.val().nome,
                  email: value.user.email,
                };

                console.log('usuario = ', data);
                setUser(data);
                storageUser(data);
            })
        })
        .catch((error)=> {
            alert(error.code);
        });
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

        /*
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async (value)=>{
            console.log('criado usuario na base do fire = ', value);
            let uid = value.user.uid;

            //adicionando o usuário na base users com a chave uid
            await firebase.database().ref('users').child(uid).set({
                saldo: 0,
                nome: nome
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                };
                setUser(data);
                storageUser(data);
            })
            .catch((error) => {
                console.log('\n Deu pau no login =  ', error);
            })
        })
        */
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
        await firebase.auth().signOut();
        await AsyncStorage.clear()
        .then( () => {
           setUser(null);
        })
    }

    async function savePhoto(photo) {
        await console.log('objeto photo a ser salvo = ', photo);
        //!!user
    }

    return(
     <AuthContext.Provider value={{ signed: true , user, loading, signUp,
     signIn, signOut, savePhoto, storageIdUpload, loadStorageIdUpload }}>
         {children}
     </AuthContext.Provider>
    );

}

export default AuthProvider;