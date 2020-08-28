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

import base64 from 'react-native-base64'

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

    /**

       { documentImageSizeLimit: null,
    documentPreviewImageFileUri: 'file:///storage/emulated/0/Android/data/com.aizonapp/files/my-custom-storage/snapping_pages/91e4ea57-c8c3-4539-a8b9-959183933476/document_image_preview.jpg?minihash=a30bf89bd3f90f8b37d4917e14ce1cbe',
    documentImageFileUri: 'file:///storage/emulated/0/Android/data/com.aizonapp/files/my-custom-storage/snapping_pages/91e4ea57-c8c3-4539-a8b9-959183933476/document_image.jpg?minihash=dcb8afba0fe7c106b5d1a89b03da5e49',
    originalPreviewImageFileUri: 'file:///storage/emulated/0/Android/data/com.aizonapp/files/my-custom-storage/snapping_pages/91e4ea57-c8c3-4539-a8b9-959183933476/original_image_preview.jpg?minihash=c22f78a932de41e7afcae9336e7f3a1e',
    originalImageFileUri: 'file:///storage/emulated/0/Android/data/com.aizonapp/files/my-custom-storage/snapping_pages/91e4ea57-c8c3-4539-a8b9-959183933476/original_image.jpg?minihash=5416ed73e2bf793261eeab3f5e7aad1c',
    filter: 'NONE',
    polygon:
     [ { y: 0.1901647299528122, x: 0.21705426275730133 },
       { y: 0.17102713882923126, x: 0.7270671725273132 },
       { y: 0.7781007885932922, x: 0.7861757278442383 },
       { y: 0.7914243936538696, x: 0.24483203887939453 } ],
    detectionResult: 'OK_BUT_TOO_SMALL',
    pageId: '91e4ea57-c8c3-4539-a8b9-959183933476' },
    //{ name : 'frente', filename : 'frente.jpg', data : RNFetchBlob.wrap(path_to_the_file) },
    console.log('showImagesScanbot documentImageFileUri = ', pageTmp.documentImageFileUri);
    //list.length somente os dois primeiros elementos
     */
    function upload() {
      let arrUpl = [];
      console.log(' upload list = ', list);

      for (let i = 0; i < 2; i++) {
          let pageTmp = list[i];
          let objImg  = {};
          console.log(' RNFetchBlobBase pageTmp = ', pageTmp);

          let resultado = pageTmp.originalImageFileUri.split("?");

          //console.log(' RNFetchBlobBase resultado = ', resultado);
          if (i == 0) {
            convertFile(resultado[0]);
            objImg['name'] = 'frente';
            objImg['filename'] ='frente.jpg';
            objImg['data'] = RNFetchBlob.wrap(pageTmp.documentImageFileUri);
          } else {
            //convertFile(RNFetchBlob.wrap(pageTmp.documentImageFileUri));
            convertFile(resultado[0]);
            objImg['name'] = 'tras';
            objImg['filename'] ='tras.jpg';
            objImg['data'] = RNFetchBlob.wrap(pageTmp.documentImageFileUri);
          }
          arrUpl.push(objImg);
      }

      //console.log(' \n RNFetchBlobBase:', arrUpl);

      /**
      let task = RNFetchBlob.fetch('POST', 'http://45.4.186.2:5000/image/upload4', {
          'Content-Type' : 'multipart/form-data'
      }, arrUpl);

      task.then((data) => {
        console.log('RNFetchBlob sucess = ', data);
      })
      .catch((err) => {
        console.log('RNFetchBlob err = ', data);
      })


      RNFetchBlob.fetch('POST', 'http://myupload.com/upload', {
          'Content-Type' : 'multipart/form-data'
      }, [
   convertFile(pageTmp.documentImageFileUri);   ])
       */
    }

    function convertFile (exampleFilePath) {
      const fs = RNFetchBlob.fs;

      //console.log('RNFetchBlobBase exampleFilePath = ', exampleFilePath);

      //console.log('RNFetchBlobBase base64 = ', RNFetchBlob.base64.encode(exampleFilePath));

      //console.log('RNFetchBlobBase react-native-base64 = ', base64.encode(exampleFilePath));
      //getBase64(exampleFilePath);

      //let mime = 'data:image/jpeg;base64,'
      //let mime = 'image/jpeg';
     /*
      let metadata = {
        type: 'image/jpeg'
      };
      */

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
        })

        /**
      fs.readFile(exampleFilePath, 'base64')
        .then(dataF => {
            //console.log("\n RNFetchBlobBase sucess:", dataF);
        })
        .catch((err) => {
          //console.log('RNFetchBlobBase err = ', err);
        }) */
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
                      How would you like to save the pages?
                    </Text>

                    <Text
                      style={[
                        modal.button,
                        modal.actionButton,
                      ]}
                      onPress={() => upload()}>
                      upload
                    </Text>

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