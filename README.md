# marquinhosamz
freela Marquinhos

INSTALADOS:

  https://styled-components.com/docs/basics
    npm install --save styled-components
_________________________________________________________________________
*** usando o firebase temporariamente para testar autenticação e fluxo
$ npm install --save firebase

https://console.firebase.google.com/
_________________________________________________________________________

https://github.com/react-native-community/async-storage
npm install @react-native-community/async-storage

https://reactnavigation.org/docs/getting-started
npm install @react-navigation/native
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

https://reactnavigation.org/docs/hello-react-navigation/
npm install @react-navigation/stack

https://reactnavigation.org/docs/drawer-based-navigation
npm install @react-navigation/drawer

$ npm install --save react-native-vector-icons
$ react-native link react-native-vector-icons

#### REDUX
  $ npm install --save react-redux
  $ npm install --save redux

npm install axios --save

https://github.com/jobtoday/react-native-image-viewing


#### PRA PRODUÇÃO
$ rm android/app/src/main/assets/index.android.bundle


(na pasta do projeto) execute o comando
mkdir android/app/src/main/assets (se esta pasta não existir)

Na sequência execute
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

Agora rode react-native run-android

#### Regenerate ios and android folder in React Native Project
Delete ios and android folders.
Inside your project directory.
npx react-native init YourProjectName
mv YourProjectName/ios ios
rm -rf YourProjectName