import api from '../api';
import moment from "moment";

/**
 * https://stackoverflow.com/questions/35855781/having-services-in-react-application
 * ver o ValidationService
 */
const SecurityService = {

    getJson: async function (url){
        let me = this;

        const response = await api.get(url)
            .catch(function (error) {
                me.makeErrorLog(error);
            });

        console.log('getJson response = ', response);

        if (!response) return null;

        return response.data;
    },

    getUserForID: async function (url, id) {
        let me = this;

        url = url + '/' + id;

        let resposta = {};
        resposta['isErro'] = false;

        let res = await api.get(url)
            .catch(function (error) {
                resposta['isErro'] = true;
                resposta['erro'] = error;
                me.makeErrorLog(error);
                //makeErrorLogAlessandro(error);
            });

        resposta['res'] = res;

        return resposta;
    },

    login: async function (url, email_, pwd){
        let me = this;

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
                    me.makeErrorLog(error);
                });

        resposta['res'] = res;

        return resposta;
    },


    registerNewUser: async function (url, newUser) {
        let me = this;

        let body = JSON.stringify(newUser);

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

          //console.log('\n Ocorrência do Erro às ', currentDate);
          msgErro.concat('\n Ocorrência do Erro às ', currentDate);

          //console.log('error.config = ', error.config);
          msgErro.concat('\n 1) error.config = ', error.config);

          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              //console.log('error.response.data = ', error.response.data);
              msgErro.concat('\n 2)error.response.data = ', error.response.data);
              //console.log('error.response.status = ', error.response.status);
              msgErro.concat('\n 3) error.response.status = ', error.response.status);
              //console.log('error.response.headers = ', error.response.headers);
              msgErro.concat('\n 4) error.response.headers = ', error.response.headers);
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              //console.log('error.request = ', error.request);
              msgErro.concat('\n 2) error.request = ', error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              //console.log('Error GERAL = ', error.message);
              msgErro.concat('\n 2) Error GERAL = ', error.message);
          }

          //console.log('====================================');
          //console.log(msgErro);
          //console.log('====================================');
        }

    }

};

export default SecurityService;