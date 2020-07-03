import api from '../api'

/**
 * https://stackoverflow.com/questions/35855781/having-services-in-react-application
 * ver o ValidationService
 */
const PhotoService = {
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

    secondValidationMethod: function(value) {
        /**
        curl "https://mapi.storyblok.com/v1/spaces/606/stories/" \
            -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: YOUR_OAUTH_TOKEN" \
            -d "{\"story\":
            {\"name\":\"Story Name\",\"slug\":
            \"story-name\",
            \"content\":{\"component\":\"page\",\"body\":[]}},
            \"publish\":1}"
         */
        console.log('secondValidationMethod = ');
    },

    makePostRequest: async function (url) {

        api.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';
        let res = await api.post(url)
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
    },

    makePostFormData: async function () {

        console.log(' \n makePostFormData \n');
        //const FormData = require('form-data');


        const form = new FormData();
        form.append('userId', '10');
        form.append('id', 1001);
        form.append('title', "TesteAlesxeiTS");
        form.append('body', "AlesxeiTS");

        /**
         * https://stackoverflow.com/questions/32441963/how-to-use-formdata-in-react-native
         *
         * fetch('http://192.168.1.101:3000/products',{
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  body: formdata
  }).then(response => {
    console.log("image uploaded")
  }).catch(err => {
    console.log(err)
  })
});
         */


         // VER https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data

        //api.post('https://jsonplaceholder.typicode.com/posts', form, { headers: form.getHeaders() });
        //api.post('https://jsonplaceholder.typicode.com/posts', form);

        let res = await api.post('https://jsonplaceholder.typicode.com/posts', form)
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
    },

    uploadBase64ToAizonViaFormData: async function(url) {

        let fileImage = this.getImageBase64();

        const form = new FormData();
        form.append('file', fileImage);

        // VER https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data

        //let res = await api.post(url, form, { headers: form.getHeaders() });

        let headersImg= {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
        };

        //let res = await api.post(url, form)
        let res = await api.post(url, form, { headers: headersImg })
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

           /*
            - https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
            Se precisar converter a imagem.. tem q carregar ela do assets e testar a rotina abaixo

            const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))


            toDataURL('https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0')
            .then(dataUrl => {
                console.log('RESULT:', dataUrl)
            })


            */
    },

    realGetDataForConfig: async function (url, id) {
        url = url + '/' + id;
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

    uploadBase64ToAizonViaBody: async function (url){
        /**
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            img: image

            https://medium.com/@cherifmezdarii/image-upload-base64-to-server-react-native-18488988bf49
            */
            let fileImage = this.getImageBase64();
            let body = JSON.stringify({file: fileImage});

            console.log(body);

            // VER https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data

            //let res = await api.post(url, form, { headers: form.getHeaders() });

            let headersImg= {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };

            console.log('ANTES DO POST = ', url);

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
    },

    uploadBase64ToAizonViaBody3: async function (url){

            let fileImageFront = this.getRGAlexandreFrontBase64();
            let fileImageVerso = this.getRGAlexandreVersoBase64();
            let body = JSON.stringify({file1: fileImageFront, file2: fileImageVerso});

            //console.log(body);

            // VER https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data

            //let res = await api.post(url, form, { headers: form.getHeaders() });

            let headersImg= {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };

            //console.log('ANTES DO POST = ', url);

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
    },

    uploadBase64ToAizonViaBody: async function (url, fileImageFront, fileImageVerso){

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
                });

        resposta['res'] = res;

        return resposta;
},

};

export default PhotoService;