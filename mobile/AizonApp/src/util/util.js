import { AsyncStorage} from 'react-native'
import { Alert } from 'react-native';

export async function getTokenUser() {
  try {
    return await AsyncStorage.getItem('@AizonApp:userToken');
  } catch (e) {
    throw e;
  }
}

export async function storeTokenUser(userToken) {
  try {
    return await AsyncStorage.setItem('@AizonApp:userToken', JSON.stringify(userToken));
  } catch (e) {
    throw e;
  }
}

export async function deleteTokenUser() {
  try {
    return await AsyncStorage.removeItem('@AizonApp:userToken');
  } catch (e) {
    throw e;
  }
}

export async function storageUser(data){
  await AsyncStorage.setItem('@AizonApp:Auth_User', JSON.stringify(data));
}

export async function getUser() {
  try {
    return await AsyncStorage.getItem('@AizonApp:Auth_User');
  } catch (e) {
    throw e;
  }
}

export async function storagePhotoProfileUser(data, idUser){
  await AsyncStorage.setItem('@AizonApp:Profile_User_' + idUser, JSON.stringify(data));
}

export async function getPhotoProfileUser(idUser) {
  try {
    return await AsyncStorage.getItem('@AizonApp:Profile_User_' + idUser);
  } catch (e) {
    throw e;
  }
}

export function alertMessage( msg, fnGoToDataVisualization, data, title) {
  let arr =[
    {
      text: "Ok",
      style: "ok"
    }
  ]

  if (fnGoToDataVisualization) {
    arr = [
      {
        text: "Ok",
        onPress: () => fnGoToDataVisualization(data),
        style: "ok"
      }
    ]
  }

  Alert.alert(
      title,
      msg,
      arr,
      { cancelable: false }
  );
}



export function makeErrorLogAlessandro(error) {
  //console.log('makeErrorLog 2 = ', error);
  if (error) {
    let currentDate = moment().format('DD/MM/YYYY, hh:mm:ss a'); // December 13th 2018, 5:25:14 pm
    //let error = res.erro;
    let msgErro = '';

    console.log('\n Ocorrência do Erro às ', currentDate);
    msgErro.concat('\n Ocorrência do Erro às ', currentDate);

    console.log('error.config = ', error.config);
    msgErro.concat('\n 1) error.config = ', error.config);

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('error.response.data = ', error.response.data);
        msgErro.concat('\n 2)error.response.data = ', error.response.data);
        console.log('error.response.status = ', error.response.status);
        msgErro.concat('\n 3) error.response.status = ', error.response.status);
        console.log('error.response.headers = ', error.response.headers);
        msgErro.concat('\n 4) error.response.headers = ', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('error.request = ', error.request);
        msgErro.concat('\n 2) error.request = ', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error GERAL = ', error.message);
        msgErro.concat('\n 2) Error GERAL = ', error.message);
    }
  }
}


