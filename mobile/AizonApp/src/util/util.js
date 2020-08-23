import AsyncStorage from '@react-native-community/async-storage';
import { Alert, Platform } from 'react-native';

import {DocumentDirectoryPath, ExternalDirectoryPath} from 'react-native-fs';

import ScanbotSDK, {InitializationOptions} from 'react-native-scanbot-sdk';

const licenseKeyTrial =
  "aXI6+Ng6hXD7XS91p8sC7sJ2ywKwTZ" +
  "ypDof6AjVzDzrFMJ9Z8xFqY8CoFnXT" +
  "xICKH9FrZRelIXuh8HraMqYshBNHsf" +
  "DYUBPH4mDkX37KKgOHHG9q4gY18QpE" +
  "qYdPmfDAvFRtYDmzb2q4dsoWVGaSdy" +
  "9/TI4UQ22WNEvP8BbnrqvWC2L2mAin" +
  "t3Z8tAwCcxhprM1qZdSVsllYZKqd/y" +
  "guOJ5aQoKTNG7ntGBqb1gyCPiiN/PT" +
  "iQZIZI090lbtI0OwOSpKKCkz3XB7CF" +
  "82huoeCG2LAmO+So40jVsCkw5vEddI" +
  "cXSExmZso0eIO5+NITmKvV8oGiCyEl" +
  "LAM5Pk436HLw==\nU2NhbmJvdFNESw" +
  "pjb20uYWl6b25hcHAKMTYwMDY0NjM5" +
  "OQoxMDcxMDIKMw==\n";

const options = {
  licenseKey: licenseKeyTrial,
  loggingEnabled: true, // Consider switching logging OFF in production builds for security and performance reasons!
  storageImageFormat: 'JPG',
  storageImageQuality: 80,
  storageBaseDirectory: getCustomStoragePath(), // Optional custom storage path. See comments below!
  documentDetectorMode: 'ML_BASED',
};


export async function getTokenUser() {
  try {
    return await AsyncStorage.getItem('@AizonApp:userToken');
  } catch (e) {
    throw e;
  }
}

export async function storeTokenUser(userToken) {
  try {
    return await AsyncStorage.setItem('@AizonApp:userToken', userToken);
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

export async function storageUpload(id){
  await AsyncStorage.setItem('@AizonApp:CURRENT_ID_UPLOAD', JSON.stringify(id));
}

export async function loadStorageUpload(){
  return await AsyncStorage.getItem('@AizonApp:CURRENT_ID_UPLOAD');
}

export async function storageBoardingPage(){
  await AsyncStorage.setItem('@AizonApp:boardingPage', JSON.stringify(true));
}

export async function loadBoardingPage(){
  return await AsyncStorage.getItem('@AizonApp:boardingPage');
}

export async function storageTermoUso(){
  await AsyncStorage.setItem('@AizonApp:TermoUso', JSON.stringify(true));
}

export async function loadTermoUso(){
  return await AsyncStorage.getItem('@AizonApp:TermoUso');
}

export function showAlert( msg, title) {
  alertMessage( msg, null, null, title)
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

export async function initScanbotSdk() {
  return await ScanbotSDK.initializeSDK(options)
  .then((data) => {
    console.log('initScanbotSdk data = ', data);
  })
  .catch((err) => {
    console.log('initScanbotSdk err = ', err);
  });
}

function getCustomStoragePath()  {
  // tslint:disable:max-line-length
  // !! Please note !!
  // It is strongly recommended to use the default (secure) storage location of the Scanbot SDK.
  // However, for demo purposes we overwrite the "storageBaseDirectory" of the Scanbot SDK by a custom storage directory.
  //
  // On Android we use the "ExternalDirectoryPath" which is a public(!) folder.
  // All image files and export files (PDF, TIFF, etc) created by the Scanbot SDK in this demo app will be stored
  // in this public storage directory and will be accessible for every(!) app having external storage permissions!
  // Again, this is only for demo purposes, which allows us to easily fetch and check the generated files
  // via Android "adb" CLI tools, Android File Transfer app, Android Studio, etc.
  //
  // On iOS we use the "DocumentDirectoryPath" which is accessible via iTunes file sharing.
  //
  // For more details about the storage system of the Scanbot SDK RN Module please see our docs:
  // - https://scanbotsdk.github.io/documentation/react-native/
  //
  // For more details about the file system on Android and iOS we also recommend to check out:
  // - https://developer.android.com/guide/topics/data/data-storage
  // - https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html
  // tslint:enable:max-line-length

  if (Platform.OS === 'ios') {
    return DocumentDirectoryPath + '/my-custom-storage';
  } else if (Platform.OS === 'android') {
    return ExternalDirectoryPath + '/my-custom-storage';
  }
  return '';
}

/**
export async function getLicense() {
  let licenseKey =
  "aXI6+Ng6hXD7XS91p8sC7sJ2ywKwTZ" +
  "ypDof6AjVzDzrFMJ9Z8xFqY8CoFnXT" +
  "xICKH9FrZRelIXuh8HraMqYshBNHsf" +
  "DYUBPH4mDkX37KKgOHHG9q4gY18QpE" +
  "qYdPmfDAvFRtYDmzb2q4dsoWVGaSdy" +
  "9/TI4UQ22WNEvP8BbnrqvWC2L2mAin" +
  "t3Z8tAwCcxhprM1qZdSVsllYZKqd/y" +
  "guOJ5aQoKTNG7ntGBqb1gyCPiiN/PT" +
  "iQZIZI090lbtI0OwOSpKKCkz3XB7CF" +
  "82huoeCG2LAmO+So40jVsCkw5vEddI" +
  "cXSExmZso0eIO5+NITmKvV8oGiCyEl" +
  "LAM5Pk436HLw==\nU2NhbmJvdFNESw" +
  "pjb20uYWl6b25hcHAKMTYwMDY0NjM5" +
  "OQoxMDcxMDIKMw==\n";

  return licenseKey;
}
 */

export async function checkLicense() {
    const info = await ScanbotSDK.getLicenseInfo();
    if (info.isLicenseValid) {
      // OK - we have a trial session, a valid trial license or valid production license.
      alert('Scanbot SDK trial period or license OK! - Início: 20/08/2020', 500);
      return true;
    }
    // @ts-ignore
    // eslint-disable-next-line no-alert
    alert('Scanbot SDK trial period or license has expired!', 500);
    return false;
  }


export function makeErrorLog2(error) {
  console.log('makeErrorLog 2 = ');
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


