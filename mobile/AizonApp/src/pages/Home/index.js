import React, { useContext, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../services/api'

import PhotoService from '../../services/photo/PhotoService';

import { Background, ContainerHeader, ContainerFooter, ContainerMain } from './styles';
import { SubmitButton, SubmitText } from '../SignIn/styles';

export default function Home() {

  const { user } = useContext(AuthContext);

  const [imageBase64, setImageBase64] = useState();

  async function getJson(){
    //const response = await api.get('/v1/cdn/stories/health?version=published&token=wANpEQEsMYGOwLxwXQ76Ggtt');
    //console.log('getJson = ', response.data)

    let img = await PhotoService.getImageBase64();
    //console.log(img);
    setImageBase64(img);

  }

  async function getDataForConfig() {
    let res = await PhotoService.getDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');
    //let res = await PhotoService.realGetDataForConfig('/image/getDataForConfig', '6sn96FINoUghUbh');

    if (res) {
      console.log(`Status code: ${res.status}`);
      console.log(`Status text: ${res.statusText}`);
      console.log(`Request method: ${res.request.method}`);
      console.log(`Path: ${res.request.path}`);

      console.log(`Date: ${res.headers.date}`);
      console.log(`Data: ${res.data}`);
    }
  }

  async function getJsonFromPhotoService(){
    const dataFromResponse = await PhotoService.getJson('/v91/cdn/stories/health?version=published&token=wANpEQEsMYGOwLxwXQ76Ggtt');

    if (dataFromResponse) {
      console.log('getJsonFromPhotoService() = ', dataFromResponse)
    }
  }

  async function postJsonFromPhotoService(){
    const res = await PhotoService.makePostRequest('posts');

    if (res) {
      console.log(`Status code: ${res.status}`);
      console.log(`Status text: ${res.statusText}`);
      console.log(`Request method: ${res.request.method}`);
      console.log(`Path: ${res.request.path}`);

      console.log(`Date: ${res.headers.date}`);
      console.log(`Data: ${res.data}`);
    }
  }

  async function postFormDataFromPhotoService(){
    const res = await PhotoService.makePostFormData();

    if (res) {
      console.log('Status code: ',res.status);
      console.log('Status text: ',res.statusText);
      console.log('Request method: ',res.request.method);
      console.log('Path: ',res.request.path);

      console.log('Date: ',res.headers.date);
      console.log('Data: ',res.data);
    }
  }

  async function uploadBase64ToAizonViaFormData(){
    const res = await PhotoService.uploadBase64ToAizonViaFormData('/image/upload');

    if (res) {
      console.log(`Status code: ${res.status}`);
      console.log(`Status text: ${res.statusText}`);
      console.log(`Request method: ${res.request.method}`);
      console.log(`Path: ${res.request.path}`);

      console.log(`Date: ${res.headers.date}`);
      console.log(`Data: ${res.data}`);
    }
  }

  async function uploadBase64ToAizonViaBody() {
    console.log('uploadBase64ToAizonViaBody ...');
    const res = await PhotoService.uploadBase64ToAizonViaBody('/image/upload2');

    if (res) {
      console.log('Status code: ',res.status);
      console.log('Status text: ',res.statusText);
      console.log('Request method: ',res.request.method);
      console.log('Path: ',res.request.path);

      console.log('Date: ',res.headers.date);
      console.log('Data: ',res.data);
    }
  }

  //let one = "https://api.storyblok.com/v1/cdn/stories/health?version=published&token=wANpEQEsMYGOwLxwXQ76Ggtt"

 return (
    <Background>
      <ContainerHeader>
        <Header titlePage="Home de Testes"/>
      </ContainerHeader>

      {/** trocar VIew por ImageBackground
       * TODO importante
       *  source={require('../../assets/home-background.png')}
       *  styles={styles.container}
       *  imageStyle={{width:74, height:383}}
      */}

      <ContainerMain>
        <Text>MAIN</Text>

        {imageBase64 && (
          <Image
            source={{uri: `${imageBase64}`}}
            style={{
              width: 51,
              height: 51,
              resizeMode: 'contain'
            }}
            />
        )}


        <SubmitButton onPress={getJson}>
            <SubmitText>Get IMAGE</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={getDataForConfig}>
            <SubmitText>Get DATA CONFIG</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={uploadBase64ToAizonViaBody}>
            <SubmitText>Upload Foto Body</SubmitText>
        </SubmitButton>

      {/**
        <SubmitButton onPress={getJsonFromPhotoService}>
            <SubmitText>Get Service Foto</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={postJsonFromPhotoService}>
            <SubmitText>Post Service Foto</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={postFormDataFromPhotoService}>
            <SubmitText>Post Form Service Foto</SubmitText>
        </SubmitButton>

        <SubmitButton onPress={uploadBase64ToAizonViaFormData}>
            <SubmitText>Upload Foto FormData</SubmitText>
        </SubmitButton>
      */}



      </ContainerMain>

      <ContainerFooter>
        <Footer titlePage="AIZON"/>
      </ContainerFooter>

    </Background>
  );
}