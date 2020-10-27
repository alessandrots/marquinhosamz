import api from '../api'
import moment from "moment";


/**
 * https://stackoverflow.com/questions/35855781/having-services-in-react-application
 * ver o ValidationService
 */
const PhotoService = {
    getJson: async function (url){
        const response = await api.get(url)
                        .catch(function (error) {
                            me.makeErrorLog(error);
                        });

        console.log('getJson response = ', response);

        if (!response) return null;

        return response.data;
    },

    realGetDataForConfig: async function (url, id) {
        url = url + '/' + id;

        const response = await api.get(url)
                        .catch(function (error) {
                            me.makeErrorLog(error);
                        });

        console.log('realGetDataForConfig response = ', response);

        if (!response) return null;

        return response.data;
    },

    getIdForProcessImage: async function (url) {
        /**
        const response = await api.get(url)
                        .catch(function (error) {
                            me.makeErrorLog(error);
                        });

        console.log('getIdForProcessImage response = ', response);

        if (!response) return null;
        */

        let resposta = {};
        resposta['isErro'] = false;

        let res = await api.get(url)
                .catch(function (error) {
                    resposta['isErro'] = true;
                    resposta['erro'] = error;
                    me.makeErrorLog(error);
                });

        resposta['res'] = res;

        return resposta;
    },

    getImageForIdAndType: async function (url) {
        /**
        const response = await api.get(url)
                        .catch(function (error) {
                            me.makeErrorLog(error);
                        });

        console.log('getIdForProcessImage response = ', response);

        if (!response) return null;
        */

        let resposta = {};
        resposta['isErro'] = false;

        let res = await api.get(url)
                .catch(function (error) {
                    resposta['isErro'] = true;
                    resposta['erro'] = error;
                    me.makeErrorLog(error);
                });

        resposta['res'] = res;

        return resposta;
    },


    // /image/getDataForConfig/6sn96FINoUghUbh
    getDataForConfig: async function (url, id) {


        // VER https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data

        //let res = await api.post(url, form, { headers: form.getHeaders() });

        /**
        let body = {
            "origin":true,
            "classification":true,
            "pre_processing":false,
            "data_extract":true,
            "data_validation":false,
            "certification":false,
            "score":true,
            "origin_image":false,
            "best_image":false,
            "binary_image":false,
            "binary_image_data_anchors":false,
            "ia_image_analisys_anchors":false,
            "list_img_to_analisys":false,
            "validate_img_anchors":false,
            "blur_validate_img_anchors":false
        }
        */

        let body = {
            "best_image":false,
            "classification":true,
            "data_extract":true,
            "certification":true,
            "score":true
        }

        let headersImg= {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        url = url + '/' + id;

        let res = await api.post(url, body, { headers: headersImg })
                 .catch(function (error) {
                    me.makeErrorLog(error);
                 });

        return res;
    },


    uploadBase64ToAizonViaBody: async function (url, fileImageFront, fileImageVerso){
        let me = this;

        let body = JSON.stringify({file1: fileImageFront, file2: fileImageVerso});

        //console.log('body = ', body);


        let headersImg= {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        let resposta = {};
        resposta['isErro'] = false;

        let res = await api.post(url, body, { headers: headersImg })
                .catch(function (error) {
                    resposta['isErro'] = true;
                    resposta['erro'] = error;
                    me.makeErrorLog(error);
                });

        resposta['res'] = res;

        return resposta;
    },

    makeErrorLog: function(error) {
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

};

export default PhotoService;