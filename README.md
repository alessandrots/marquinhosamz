# marquinhosamz
Branch Alexandre 

https://stackoverflow.com/questions/44506207/reactjs-lifecycle-method-inside-a-function-component
https://www.youtube.com/watch?v=jcc9T-5inrk&vl=pt

tem q ir para a pasta tools do SDK, depois list os avds e por fim chama o comando emulator
$ cd $ANDROID_HOME/tools
$ emulator -list-avds
$ emulator -avd <name_of_avd>

- STARTAR EMULADOR com internet
tools$ emulator -avd Nexus_5X_API_28 -dns-server 8.8.8.8 &


INSTALADOS:

https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
https://chrome.google.com/webstore/detail/octotree/bkhaagjahfmjljalopjnoealnfndnagc/related?hl=pt-BR
https://whimsical.com/PqiiqvuTdD3DYqVHUdBKJF
https://devdocs.io/

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

https://github.com/wonday/react-native-pdf/blob/master/README.md

https://github.com/react-native-community/react-native-webview

https://github.com/joltup/rn-fetch-blob


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
