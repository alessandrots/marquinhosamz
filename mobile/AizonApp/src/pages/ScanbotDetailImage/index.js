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
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pages from '../../components/Pages';

import { Background } from './styles';
import { ContainerHeader, ContainerFooter } from '../Home/styles';

import ScanbotSDK from 'react-native-scanbot-sdk';
import RNFetchBlob from 'rn-fetch-blob';
import {ActionSheetCustom as ActionSheet} from 'react-native-custom-actionsheet';
import { alertMessage } from '../../util/util';

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
   export default function ScanbotDetailImage({ navigator, route }) {

    const [selected, setSelected] = useState(0);
    const [actionSheet, setActionSheet] = useState();
    const [list, setList] = useState([]);
    //const [page, setPage] = useState(null);

    const navigation = useNavigation();

    const CANCEL_INDEX = 0;

    const options = [
      'NONE',
      'COLOR_ENHANCED',
      'GRAYSCALE',
      'BINARIZED',
      'COLOR_DOCUMENT',
      'PURE_BINARIZED',
      'BACKGROUND_CLEAN',
      'BLACK_AND_WHITE',
      'OTSU_BINARIZATION',
      'DEEP_BINARIZATION',
      'LOW_LIGHT_BINARIZATION',
      'EDGE_HIGHLIGHT',
      'LOW_LIGHT_BINARIZATION_2',
    ];

    /** */
    useEffect(() => {
      //console.log('Pages.selectedPage ScanbotImage = ', Pages.selectedPage);
    }, []);


    //https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render
    function useForceUpdate(){
      //const [value, setValue] = useState(0); // integer state
      //return () => setValue(value => ++value); // update the state to force render
    }

    function refresh() {
        useForceUpdate();
    }

    function getActionSheetRef (ref) {
      //actionSheet = ref;
      setActionSheet(ref);
    }


    function pushPage(name) {
        // @ts-ignore
        //TODO
        //props.navigation.push(name);

        //navigation.navigate('ViewData', { side: '0', 'identificacaoDocumento': data.id});
    }

    async function handlePress(index) {
      setSelected(index);
      const filter = options[index];

      const updated = await ScanbotSDK.applyImageFilterOnPage(
        Pages.selectedPage,
        // @ts-ignore
        filter,
      );

      console.log('ScanbotImage updated = ', updated);

      //updateCurrentPage(updated);
    };

    async function cropButtonPress() {
      console.log('ScanbotImage Pages.selectedPage = ', Pages.selectedPage);

      const result = await ScanbotSDK.UI.startCroppingScreen(Pages.selectedPage, {
        doneButtonTitle: 'Aplicar',
        backgroundColor: '#f0f2b5',
        topBarBackgroundColor: '#00ffff',
        bottomBarBackgroundColor: '#00ffff',
        bottomBarButtonsColor: '#000000',
        topBarButtonsActiveColor: '#F0B42F',
        polygonColor: '#d60a0a',
        polygonColorMagnetic: '#88ff00',
        rotateButtonTitle: 'Rotacionar',
        titleColor: '#000000',
        /**
          * Title of the cancel button.
          */
        cancelButtonTitle: 'Cancelar',
        /**
         * Title of the Done button.
         */
        doneButtonTitle: 'Ok',
        // See further config properties ...
      });

      console.log('ScanbotImage result = ', result);

      alertMessage( 'startCroppingScreen', null, null, 'ScanbotSDK')

      if (result.status === 'OK') {
        if (result.page) {
          updateCurrentPage(result.page);
        }
      }
    }

    function updateCurrentPage(page) {
      /**
       * chama update no ScanbotImage
       */
      Pages.update(page);


      Pages.selectedPage = page;

      refresh();
    }

    async function filterButtonPress() {
      if (!(await SDKUtils.checkLicense())) {
        return;
      }
      actionSheet.show();
    }

    function deleteButtonPress() {
      Pages.list.splice(Pages.list.indexOf(Pages.selectedPage), 1);
      // @ts-ignore
      //props.navigation.pop();
    }


   function getMainScreen() {
      return  (

        <Background>
          <ContainerHeader>
            <Header titlePage="Detalhe Imagem"/>
          </ContainerHeader>

          { getMontagemTela() }

          <ContainerFooter>
            <Footer titlePage="AIZON"/>
          </ContainerFooter>

        </Background>
      );
    }

    function getMontagemTela() {
        return (
            <>
            <SafeAreaView style={imageResults.container}>
                <Image
                  style={[
                    imageDetails.image,
                    common.containImage,
                  ]}
                  source={{uri: Pages.selectedPage.documentImageFileUri}}
                  key={Pages.selectedPage.pageId}
                />
                <View style={common.bottomBar}>
                  <Text
                    style={common.bottomBarButton}
                    onPress={() => cropButtonPress()}>
                    CROP & ROTATE
                  </Text>
                  <Text
                    style={common.bottomBarButton}
                    onPress={() => filterButtonPress()}>
                    FILTER
                  </Text>
                  <Text
                    style={[
                      common.bottomBarButton,
                      common.alignRight,
                    ]}
                    onPress={() => deleteButtonPress()}>
                    DELETE
                  </Text>
                </View>
                <ActionSheet
                  ref={getActionSheetRef}
                  title={'Filtros'}
                  message="Escolha um filtro de imagem para ver como melhora o documento"
                  options={options}
                  cancelButtonIndex={CANCEL_INDEX}
                  onPress={handlePress}
                />
            </SafeAreaView>
            </>
          );
    }

    return (
      getMainScreen()
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
      width: (Dimensions.get("window").width - 4 * 10) / 3,
      height: (Dimensions.get("window").width - 4 * 10) / 3,
      marginLeft: 20,
      marginTop: 20,
      backgroundColor: 'rgb(245, 245, 245)',
    },
  });

 common = StyleSheet.create({
    bottomBar: {
      width: '100%',
      height: 50,
      backgroundColor: '#00ffff',
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
      color: '#F0B42F',
      paddingLeft: 10,
      paddingRight: 10,
      marginRight: 10,
      fontWeight: 'bold',
      fontSize: 14,
    },
    alignRight: {
      marginLeft: 'auto',
    },
    progress: {
      color: '#F0B42F',
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
      backgroundColor: '#F0B42F',
      fontWeight: 'bold',
    },
    closeButton: {
      borderColor: 'gray',
      borderWidth: 1,
    },
  });