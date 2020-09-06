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

import { Background } from './styles';
import { ContainerHeader, ContainerFooter } from '../Home/styles';

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
   export default function ScanbotDetailImage({ navigator, route }) {

    const [selected, setSelected] = useState(0);
    const [actionSheet, setActionSheet] = useState();
    const [list, setList] = useState([]);
    const [page, setPage] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
      console.log('route ScanbotImage = ', route);

      if (route.params?.pageSelected) {
        setPage(route.params.pageSelected);
      }

    }, [route.params?.pageSelected]);

    //const { heightx, widthx } = Dimensions.get('window');

    //https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render
    function useForceUpdate(){
      //const [value, setValue] = useState(0); // integer state
      //return () => setValue(value => ++value); // update the state to force render
    }


    function refresh() {
        useForceUpdate();
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

      //updateCurrentPage(updated);
    };

    async function cropButtonPress() {
      if (!(await SDKUtils.checkLicense())) {
        return;
      }
      const result = await ScanbotSDK.UI.startCroppingScreen(Pages.selectedPage, {
        doneButtonTitle: 'Aplicar',
        topBarBackgroundColor: '#c8193c',
        bottomBarBackgroundColor: '#c8193c',
        // See further config properties ...
      });

      if (result.status === 'OK') {
        if (result.page) {
          updateCurrentPage(result.page);
        }
      }
    }

    function updateCurrentPage(page) {
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
      props.navigation.pop();
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
              <SafeAreaView />
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
                title={'Filters'}
                message="Choose an image filter to see how it enhances the document"
                options={options}
                cancelButtonIndex={CANCEL_INDEX}
                onPress={handlePress}
              />
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