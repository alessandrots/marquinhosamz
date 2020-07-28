import api from '../api'

/**
 * https://stackoverflow.com/questions/35855781/having-services-in-react-application
 * ver o ValidationService
 */
const SecurityService = {

    getJson: async function (url){
        const response = await api.get(url)
                                .catch(function (error) {
                                    if (error.response) {
                                    // The request was made and the server responded with a status code
                                    // that falls out of the range of 2xx
                                    console.log('error.response.data = ', error.response.data);
                                    console.log('error.response.status = ', error.response.status);
                                    console.log('error.response.headers = ', error.response.headers);
                                    } else if (error.request) {
                                    // The request was made but no response was received
                                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                    // http.ClientRequest in node.js
                                    console.log('error.request = ', error.request);
                                    } else {
                                    // Something happened in setting up the request that triggered an Error
                                    console.log('Error GENERAL = ', error.message);
                                    }
                                    console.log('error.config = ', error.config);

                                    return null;
                                });

        console.log('getJson response = ', response);

        if (!response) return null;

        return response.data;
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
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log('error.response.data = ', error.response.data);
                        console.log('error.response.status = ', error.response.status);
                        console.log('error.response.headers = ', error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log('error.request = ', error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error GENERAL = ', error.message);
                    }
                        console.log('error.config = ', error.config);

                    return null;
                });

        return res;

        return res;
    },



    login: async function (url, email_, pwd){

        let body = JSON.stringify({email: email_, password: pwd});

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
                });

        resposta['res'] = res;

        return resposta;
    },

};

export default SecurityService;