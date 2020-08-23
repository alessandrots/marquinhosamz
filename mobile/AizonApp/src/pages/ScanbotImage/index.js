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
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { showAlert, checkLicense, } from '../../util/util';
import { addList, isEmpty, cleanList} from '../../components/ScannerBot';

import ScanbotSDK from 'react-native-scanbot-sdk';

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

      if (route.params?.post) {
        // Post updated, do something with `route.params.post`
        // For example, send the post to the server

        if (route.params.post) {
          console.log('route ScanbotImage list = ', route.params.post);
          setList(route.params.post);
        }
      }

    }, [route.params?.post]);



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
            addList(result.pages, setList);

            refresh();
        }
    }

    function saveButtonPress() {
        if (isEmpty(list)) {
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

        cleanList(list);

        refresh();
    }

    function onGalleryItemClick(page) {
        //Pages.selectedPage = page;

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
                Pages.getImageUris(),
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

            const result = await ScanbotSDK.performOCR(Pages.getImageUris(), ['en'], {
                outputFormat: 'FULL_OCR_RESULT',
            });

            showAlert('PDF with OCR layer created: ' + result.pdfFileUri, 'IMAGE');
        } catch (e) {
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

            const result = await ScanbotSDK.writeTIFF(Pages.getImageUris(), {
                oneBitEncoded: binarized, // "true" means create 1-bit binarized black and white TIFF
                dpi: 300, // optional DPI. default value is 200
                compression: binarized ? 'CCITT_T6' : 'ADOBE_DEFLATE', // optional compression. see documentation!
            });

            showAlert('TIFF file created: ' + result.tiffFileUri), 'IMAGE';
        } catch (e) {
            showAlert('ERROR: ' + JSON.stringify(e)), 'IMAGE';
        } finally {
            hideProgress();
        }
    }

    function getMontagemTela() {
        return (
            <>
              <SafeAreaView style={styles.imageResults.container}>
                <ActivityIndicator
                  size="large"
                  color='#c8193c'
                  style={styles.common.progress}
                  animating={progressVisible}
                />
                <View style={styles.imageResults.gallery}>
                  {Pages.list.map((page) => (
                    <TouchableOpacity
                      onPress={() => onGalleryItemClick(page)}
                      key={page.pageId}>
                      <Image
                        style={[
                          styles.imageResults.galleryCell,
                          styles.common.containImage,
                        ]}
                        source={{uri: page.documentImageFileUri}}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.common.bottomBar}>
                  <Text
                    style={styles.common.bottomBarButton}
                    onPress={() => addButtonPress()}>
                    ADD
                  </Text>
                  <Text
                    style={styles.common.bottomBarButton}
                    onPress={() => saveButtonPress()}>
                    SAVE
                  </Text>
                  <Text
                    style={[
                      styles.common.bottomBarButton,
                      styles.common.alignRight,
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
                <View style={styles.modal.centeredView}>
                  <View style={styles.modal.modalView}>
                    <Text style={styles.modal.text}>
                      How would you like to save the pages?
                    </Text>
                    <Text
                      style={[
                        styles.modal.button,
                        styles.modal.actionButton,
                      ]}
                      onPress={() => onSaveAsPDF()}>
                      PDF
                    </Text>
                    <Text
                      style={[
                        styles.modal.button,
                        styles.modal.actionButton,
                      ]}
                      onPress={() => onSaveAsPDFWithOCR()}>
                      PDF with OCR
                    </Text>
                    <Text
                      style={[
                        styles.modal.button,
                        styles.modal.actionButton,
                      ]}
                      onPress={() => onSaveAsTIFF(true)}>
                      TIFF (1-bit B&W)
                    </Text>
                    <Text
                      style={[
                        styles.modal.button,
                        styles.modal.actionButton,
                      ]}
                      onPress={() => onSaveAsTIFF(false)}>
                      TIFF (color)
                    </Text>
                    <Text
                      style={[
                        styles.modal.button,
                        styles.modal.closeButton,
                      ]}
                      onPress={() => onModalClose()}>
                      Cancel
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