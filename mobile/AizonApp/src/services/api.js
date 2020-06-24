import axios from 'axios'

import { Alert } from 'react-native'

//import { navigate } from '../util/util'

/**

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

axios({ url: 'items', baseURL: 'http://new-url.com' })

 */

const api = axios.create({
  //baseURL: 'https://api-jwt-tutorial.herokuapp.com',
  //baseURL: 'http://192.168.10.232:5000',
  baseURL: 'http://45.4.186.2:5000',
  //baseURL: 'https://api.storyblok.com',
  // baseURL: 'http://10.0.3.2:3000',

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  response => {
    //console.log('interceptors.response = ', response);

    // Do something with response data

    return response
  },
  error => {
    console.log('error interceptor api = ', error);

    // Do something with response error
    // You can even test for a response code
    // and try a new request before rejecting the promise

    if (
      error.request._hasError === true &&
      error.request._response.includes('connect')
    ) {
      Alert.alert(
        'Aviso',
        'Não foi possível conectar aos nossos servidores, sem conexão a internet',
        [ { text: 'OK' } ],
        { cancelable: false },
      )
    }

    if (error.response.status === 401) {
      const requestConfig = error.config

      // O token JWT expirou
      /**
      deleteUser()
        .then(() => {
          navigate('AuthLoading', {})
        })
        */

      return axios(requestConfig)
    }

    return Promise.reject(error)
  },
)

api.interceptors.request.use(
  config => {
    //console.log('interceptors.request = ', config);
    return Promise.resolve(config)
    /**
    return getUser()
      .then(user => {
        user = JSON.parse(user)
        if (user && user.token)
          config.headers.Authorization = `Bearer ${user.token}`
        return Promise.resolve(config)
      })
      .catch(error => {
        console.log(error)
        return Promise.resolve(config)
      })
      */
  },
  error => {
    return Promise.reject(error)
  },
)

export default api
