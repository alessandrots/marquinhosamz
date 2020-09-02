import React, { useContext, useState, useEffect } from 'react';

import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Colors,
  Dimensions,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { showAlert, checkLicense, } from '../../util/util';
//import { addList, isEmpty, cleanList} from '../../components/ScannerBot';

import ScanbotSDK from 'react-native-scanbot-sdk';
import RNFetchBlob from 'rn-fetch-blob';

/**
 *
 * TENTAR https://github.com/CharlesStover/use-force-update
 *
 * const forceUpdate = useForceUpdate();

 const handleClick = () => {
     alert('I will re-render now.');
     forceUpdate();
    };

    return <button onClick={handleClick} />;
    *
    *
    */
   export default function ScanbotImage({ navigator, route }) {

    useEffect(() => {
      console.log('route ScanbotImage = ', route);

      if (route.params?.pages) {
        // pages updated, do something with `route.params.pages`
        // For example, send the pages to the server

        if (route.params.pages) {
          //console.log('route ScanbotImage pages = ', route.params.pages);



          showImagesScanbot(route.params.pages);
        }
      }

    }, [route.params?.pages]);

    //const { heightx, widthx } = Dimensions.get('window');

    //https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render
    function useForceUpdate(){
      //const [value, setValue] = useState(0); // integer state
      //return () => setValue(value => ++value); // update the state to force render
    }

    const [progressVisible, setProgressVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [list, setList] = useState([]);

    const navigation = useNavigation();

    function refresh() {
        useForceUpdate();
    }

    function pushPage(name) {
        // @ts-ignore
        //TODO
        //props.navigation.push(name);

        //navigation.navigate('ViewData', { side: '0', 'identificacaoDocumento': data.id});
    }

    function showProgress() {
        setProgressVisible(true);
        refresh();
    }

    function hideProgress() {
        setProgressVisible(false);
        refresh();
    }

    function getImageUris() {
      return list.map(
        (p) => p.documentImageFileUri || p.originalImageFileUri,
      );
    }

    //create your forceUpdate hook
    async function addButtonPress() {
        if (!(await checkLicense())) {
            return;
        }

        const config = {
            // Customize colors, text resources, etc..
            cameraPreviewMode: 'FIT_IN',
            orientationLockMode: 'PORTRAIT',
            multiPageEnabled: false,
            multiPageButtonHidden: true,
            ignoreBadAspectRatio: true,
            // See further config properties ...
        };

        const result = await ScanbotSDK.UI.startDocumentScanner(config);

        if (result.status === 'OK') {
            addList(result.pages);

            refresh();
        }
    }

    function saveButtonPress() {
        if (isEmpty()) {
            showAlert(
            'You have no images to save. Please scan a few documents first.',
            'IMAGE'
            );
        }
        //modalVisible = true;
        setModalVisible(true);

        refresh();
    }

    async function deleteAllButtonPress() {
        try {
            await ScanbotSDK.cleanup();
        } catch (e) {
            showAlert('ERROR: ' + JSON.stringify(e), 'IMAGE');
            return;
        }

        cleanList();

        refresh();
    }

    function add(page) {
        //let listTmp = list;
        //listTmp.push(page);
        //setList(listTmp);

        setList(page);
    }

    function cleanList() {
        //let listTmp = list;
        //listTmp.push(page);
        //setList(listTmp);

        setList([]);
    }

    function addList(pages) {
        pages.forEach((page) => {
            add(page);
        });
    }

    function isEmpty() {
        return (!list && list.length === 0);
    }

    function update(page) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
            let pageTmp = list[i];

            if (pageTmp.pageId === page.pageId) {
                index = i;
            }
        }

        if (index !== -1) {
          //list[index] = page;
          setList(page);
        }
    }

    function showImagesScanbot(pages) {
      console.log(' showImagesScanbot pages = ', pages);
      setList(pages);

      for (let i = 0; i < pages.length; i++) {
          let pageTmp = pages[i];
          console.log('showImagesScanbot documentImageFileUri = ', pageTmp.documentImageFileUri);
      }
  }



    function onGalleryItemClick(page) {
      //selectedPage = page;

      // @ts-ignore TODO implementar tela de DETAIL
      //props.navigation.push(Navigation.IMAGE_DETAILS);

      //navigation.navigate('ViewData', { side: '0', 'identificacaoDocumento': data.id});
    }

    function onModalClose() {
      //modalVisible = false;
      setModalVisible(false);

      refresh();
    }

    async function onSaveAsPDF() {
        onModalClose();

        if (!(await checkLicense())) {
            return;
        }

        try {
            showProgress();

            const result = await ScanbotSDK.createPDF(
                getImageUris(),
                'FIXED_A4',
            );

            showAlert('PDF file created: ' + result.pdfFileUri, 'IMAGE');
        } catch (e) {
            showAlert('ERROR: ' + JSON.stringify(e), 'IMAGE');
        } finally {
            hideProgress();
        }
    }
    async function onSaveAsPDFWithOCR() {
        onModalClose();

        if (!(await checkLicense())) {
            return;
        }

        try {
            showProgress();

            const result = await ScanbotSDK.performOCR(getImageUris(), ['en'], {
                outputFormat: 'FULL_OCR_RESULT',
            });

            showAlert('PDF with OCR layer created: ' + result.pdfFileUri, 'IMAGE');
        } catch (e) {
            console.log('====================================');
            console.log('PDF with OCR layer created error : ', JSON.stringify(e));
            console.log('====================================');
            showAlert('ERROR: ' + JSON.stringify(e), 'IMAGE');
        } finally {
            hideProgress();
        }
    }

    async function onSaveAsTIFF(binarized) {
        onModalClose();

        if (!(await checkLicense())) {
            return;
        }
        try {
            showProgress();

            const result = await ScanbotSDK.writeTIFF(getImageUris(), {
                oneBitEncoded: binarized, // "true" means create 1-bit binarized black and white TIFF
                dpi: 300, // optional DPI. default value is 200
                compression: binarized ? 'CCITT_T6' : 'ADOBE_DEFLATE', // optional compression. see documentation!
            });

            showAlert('TIFF file created: ' + result.tiffFileUri, 'IMAGE');
        } catch (e) {
            showAlert('ERROR: ' + JSON.stringify(e), 'IMAGE');
        } finally {
            hideProgress();
        }
    }

    async function getDataToUpload() {
        let arrUpl = [];
        //console.log(' RNFetchBlobBase = ', list);

        for (let i = 0; i < 2; i++) {
            let pageTmp = list[i];
            let objImg  = {};
            let resultado = pageTmp.originalImageFileUri.split("?");

            if (i == 0) {
              //convertFile(resultado[0]);
              objImg['name'] = 'frente';
              objImg['filename'] ='frente.jpg';
              objImg['data'] = RNFetchBlob.wrap(resultado[0]);
            } else {
              //convertFile(resultado[0]);
              objImg['name'] = 'tras';
              objImg['filename'] ='tras.jpg';
              objImg['data'] = RNFetchBlob.wrap(resultado[0]);
            }
            arrUpl.push(objImg);
        }

        for (let i = 0; i < 2; i++) {
          let pageTmp = list[i];
          let objImg  = {};
          let resultado = pageTmp.polygon;

          //console.log(' RNFetchBlobBase resultado = ', resultado);
          if (i == 0) {
            objImg['name'] = 'polygon-img1';
            objImg['data'] = JSON.stringify(resultado);
          } else {
            objImg['name'] = 'polygon-img2';
            objImg['data'] = JSON.stringify(resultado);
          }
          arrUpl.push(objImg);
        }

        return arrUpl;
    }

    async function upload() {
      let arrUpl = await getDataToUpload();

      let url = 'http://45.4.186.2:5000/image/upload4';
      //let url = 'http://192.168.10.81:5000/image/upload4';

      console.log(' \n RNFetchBlobBase url = ', url);

      console.log(' \n RNFetchBlobBase arrUpl = ', arrUpl);

      let task = RNFetchBlob.fetch('POST', url, {
          'Content-Type' : 'multipart/form-data'
      }, arrUpl);

      task.then((dataF) => {
        console.log('RNFetchBlobBase sucess = ', dataF);
      })
      .catch((err) => {
        console.log('RNFetchBlobBase error = ', err);
      })
    }



    function convertFile (exampleFilePath) {
      const fs = RNFetchBlob.fs;

      let mime = 'application/octet-stream';

      fs.readFile(exampleFilePath, 'base64')
        .then((dataF) => {
          //let blob =  Blob.build(dataF, { type: `${mime};BASE64` })
          //let blob = new File(exampleFilePath);
          //let blob = new File([dataF], 'exampleFilePath', `${mime};BASE64`);
          let blob =  new Blob([dataF], {type: mime, lastModified: new Date()});
          getBase64(blob);
        }).catch((err) => {
          console.log('RNFetchBlobBase err = ', err);
        });

    }

    function getBase64(file) {
      console.log("\n RNFetchBlobBase file:", file);

     let  reader = new FileReader();
      //console.log("\n RNFetchBlobBase reader:", reader);

      reader.readAsDataURL(file);

      reader.onload = function () {
        console.log('RNFetchBlobBase sucess getBase64 = ',reader.result);
      };
      reader.onerror = function (error) {
        console.log('RNFetchBlobBase error getBase64 = ',error);
      };
   }

   /**
    async function upload2() {
      let options = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
      };

      options.body = new FormData();

      for (let i = 0; i < 2; i++) {
        let pageTmp = list[i];
        let objImg  = {};
        let resultado = pageTmp.originalImageFileUri.split("?");
        let polygon = pageTmp.polygon;

        if (i == 0) {
          objImg['name1'] = 'frente';
          objImg['filename1'] ='frente.jpg';
          objImg['imagem1'] = RNFetchBlob.wrap(resultado[0]);
          objImg['polygon-img1'] = JSON.stringify(polygon);
          options.body.append('frente', objImg);
        } else {
          objImg['name2'] = 'tras';
          objImg['filename2'] ='tras.jpg';
          objImg['imagem2'] = RNFetchBlob.wrap(resultado[0]);
          objImg['polygon-img2'] = JSON.stringify(resultado);
          options.body.append('tras', objImg);
        }

        //arrUpl.push(objImg);
      }

      console.log('\n  upload2 options.body = ',  options.body);

      try {
        //let response = await fetch('http://45.4.186.2:5000/image/upload4', options);
        let response = await fetch('http://192.168.10.81:5000/image/upload4', options);

        console.log('\n upload2 1)===================');
        console.log('upload2 response = ', response);

        let json = await response.json();

        console.log('\n upload2 2)===================');
        console.log('upload2 json = ', json);
      } catch (error) {
        console.log('upload2 error = ', error);
      }


    }
    */

    function getMontagemTela() {
        return (
            <>
              <SafeAreaView style={imageResults.container}>
                <ActivityIndicator
                  size="large"
                  color='#c8193c'
                  style={common.progress}
                  animating={progressVisible}
                />
                <View style={imageResults.gallery}>
                  {list.map((page) => (
                    <TouchableOpacity
                      onPress={() => onGalleryItemClick(page)}
                      key={page.pageId}>
                      <Image
                        style={[
                          imageResults.galleryCell,
                          common.containImage,
                        ]}
                        source={{uri: page.documentImageFileUri}}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={common.bottomBar}>
                  <Text
                    style={common.bottomBarButton}
                    onPress={() => addButtonPress()}>
                    ADD
                  </Text>
                  <Text
                    style={common.bottomBarButton}
                    onPress={() => saveButtonPress()}>
                    SAVE
                  </Text>
                  <Text
                    style={[
                      common.bottomBarButton,
                      common.alignRight,
                    ]}
                    onPress={() => deleteAllButtonPress()}>
                    DELETE ALL
                  </Text>
                </View>
              </SafeAreaView>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={modal.centeredView}>
                  <View style={modal.modalView}>
                    <Text style={modal.text}>
                      Fazer upload das páginas ?
                    </Text>

                    <Text
                      style={[
                        modal.button,
                        modal.actionButton,
                      ]}
                      onPress={() => upload()}>
                      upload
                    </Text>

                      {/**
                    <Text
                      style={[
                        modal.button,
                        modal.actionButton,
                      ]}
                      onPress={() => onSaveAsPDF()}>
                      PDF
                    </Text>
                    <Text
                      style={[
                        modal.button,
                        modal.actionButton,
                      ]}
                      onPress={() => onSaveAsPDFWithOCR()}>
                      PDF with OCR
                    </Text>
                       */}


                  </View>
                </View>
              </Modal>
            </>
          );
    }

    return (
      getMontagemTela()
    )

}

  imageResults = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gallery: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    galleryCell: {
      width: (Dimensions.get("window").width - 4 * 20) / 3,
      height: (Dimensions.get("window").width - 4 * 20) / 3,
      marginLeft: 20,
      marginTop: 20,
      backgroundColor: 'rgb(245, 245, 245)',
    },
  });

 common = StyleSheet.create({
    bottomBar: {
      width: '100%',
      height: 50,
      backgroundColor: '#c8193c',
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
    },
    bottomBarButton: {
      flex: 0,
      height: 50,
      lineHeight: 50,
      textAlignVertical: 'center',
      textAlign: 'center',
      color: 'white',
      paddingLeft: 10,
      paddingRight: 10,
      marginRight: 10,
      fontWeight: 'bold',
      fontSize: 13,
    },
    alignRight: {
      marginLeft: 'auto',
    },
    progress: {
      color: '#c8193c',
      position: 'absolute',
      left: '47%',
      top: '40%',
      width: '6%',
    },
    containImage: {
      resizeMode: 'contain',
    },
    copyrightLabel: {
      textAlign: 'center',
      lineHeight: 40,
      width: '100%',
      height: 40,
      position: 'absolute',
      bottom: 0,
      color: 'gray',
      fontSize: 12,
    },
  });

   imageDetails = StyleSheet.create({
    image: {
      width: '94%',
      height: '70%',
      marginLeft: '3%',
      marginTop: '3%',
    },
  });

   home = StyleSheet.create({
    list: {
      marginTop: '1%',
      marginLeft: '5%',
      height: '90%',
      width: '90%',
    },
    sectionHeader: {
      fontSize: 13,
      marginTop: 25,
      marginBottom: 0,
      fontWeight: 'bold',
      color: '#696969',
    },
    sectionItemContainer: {
      borderBottomColor: '#bdbdbd',
      borderBottomWidth: 1,
    },
    sectionItem: {
      fontSize: 17,
      marginTop: 14,
      marginBottom: 5,
    },

    footer: {
      // color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });

   barcodeFormats = StyleSheet.create({
    list: {
      paddingTop: '2%',
      height: '98%',
    },
    listItemContainer: {
      paddingLeft: 20,
      flexDirection: 'row',
      height: 40,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      marginLeft: 10,
      marginRight: 10,
    },
    listItemText: {
      fontSize: 12,
      height: 40,
      textAlignVertical: 'center',
      lineHeight: 40,
      width: '80%',
    },
    listItemSwitch: {
      marginTop: 5,
    },
  });

   modal = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    text: {
      marginBottom: 15,
      textAlign: 'center',
    },
    button: {
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 10,
      height: 40,
      width: 200,
      marginTop: 10,
      textAlign: 'center',
      lineHeight: 40,
      overflow: 'hidden',
    },
    actionButton: {
      color: 'white',
      backgroundColor: '#c8193c',
      fontWeight: 'bold',
    },
    closeButton: {
      borderColor: 'gray',
      borderWidth: 1,
    },
  });