
# pra rodar o react-native para buildar para aparelho
https://stackoverflow.com/questions/55763428/react-native-error-enospc-system-limit-for-number-of-file-watchers-reached

# REACT NATIVE
https://reactnative.dev/docs/0.60/getting-started
*** meu projeto já tá na versão 0.64

AizonApp$ react-native info
info Fetching system and libraries information...
(node:23401) Warning: Accessing non-existent property 'padLevels' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
    System:
        OS: Linux 4.19 Debian GNU/Linux 10 (buster) 10 (buster)
        CPU: (4) x64 Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz
        Memory: 1.12 GB / 15.55 GB
        Shell: 5.0.3 - /bin/bash
    Binaries:
        Node: 15.12.0 - ~/.nvm/versions/node/v15.12.0/bin/node
        Yarn: Not Found
        npm: 7.7.6 - ~/.nvm/versions/node/v15.12.0/bin/npm
        Watchman: Not Found
    SDKs:
        Android SDK:
        API Levels: 29, 30
        Build Tools: 28.0.3, 29.0.3, 30.0.3
        System Images: android-30 | Google APIs Intel x86 Atom
        Android NDK: Not Found
    IDEs:
        Android Studio: Not Found
    Languages:
        Java: 1.8.0_281 - /home/alessandrots/ambiente/desenvolvimento/java/jdk1.8.0_281/bin/javac
    npmPackages:
        @react-native-community/cli: Not Found
        react: 16.11.0 => 16.11.0 
        react-native: ^0.64.1 => 0.64.1 
    npmGlobalPackages:
        *react-native*: Not Found

# NODE NPM
https://pt.stackoverflow.com/questions/433378/qual-a-diferen%C3%A7a-entre-npm-e-npx

instalar com nvm
https://github.com/nvm-sh/nvm#installing-and-updating
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash


https://blog.rocketseat.com.br/conhecendo-o-npx-executor-de-pacote-do-npm/

npx react-native init MyApp --template react-native-template-typescript

# Usando npx
    https://stackoverflow.com/questions/59310296/how-can-i-create-new-react-native-app-using-npx

    use npx react-native init ProjectName to create new project
    use yarn react-native run-android or yarn react-native run-ios to run the project
    @Raeygzz if you want to use react-native related command add yarn/npx in the beginning of the command

    yarn react-native run-android
    yarn react-native run-ios
    
    or

    npx react-native run-android
    npx react-native run-ios
    
    if you want to create apk debug use in your root project

    cd android && gradlew assembleDebug

    apk release in your root project

    cd android && gradlew assembleRelease

    Debug with bundle in your root project

    yarn react native run-android

    and get the apk file in



# INSTALANDO NO LINUX
https://docs.rocketseat.dev/ambiente-react-native/android/linux


# ANDROID STUDIO
https://developer.android.com/studio#downloads

# Atualizar Licenças
no .bashrc
    ANDROID_HOME=/home/alessandrots/ambiente/desenvolvimento/java/android-studio
    ANDROID_TOOLS=/home/alessandrots/Android/Sdk/tools
    ANDROID_PTF_TOOLS=/home/alessandrots/Android/Sdk/platform-tools
    PATH= ....:$ANDROID_HOME/bin:$ANDROID_TOOLS/bin:$ANDROID_PTF_TOOLS:$PATH

    export JAVA_HOME ANDROID_HOME PATH

# atualizar licenças a cmd via source
$ cd ANDROIDO_TOOLS
$ cd tools/bin/
$ ./sdkmanager --licenses

# flipper
https://fbflipper.com/
$ sudo ./flipper --no-sandbox

# pra rodar o react-native para buildar para aparelho
https://stackoverflow.com/questions/55763428/react-native-error-enospc-system-limit-for-number-of-file-watchers-reached

tem q ir para a pasta tools do SDK, depois list os avds e por fim chama o comando emulator
$ cd $ANDROID_HOME/tools
$ emulator -list-avds
$ emulator -avd <name_of_avd>

# STARTAR EMULADOR com internet
tools$ emulator -avd Nexus_5X_API_28 -dns-server 8.8.8.8 &

# LINKS IMPORTANTES
https://stackoverflow.com/questions/44506207/reactjs-lifecycle-method-inside-a-function-component
https://www.youtube.com/watch?v=jcc9T-5inrk&vl=pt

# INSTALADOS:
https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
https://chrome.google.com/webstore/detail/octotree/bkhaagjahfmjljalopjnoealnfndnagc/related?hl=pt-BR
https://whimsical.com/PqiiqvuTdD3DYqVHUdBKJF
https://devdocs.io/
https://styled-components.com/docs/basics

# LIBs INSTALADAS
npm install --save styled-components

*** usando o firebase temporariamente para testar autenticação e fluxo
$ npm install --save firebase

https://console.firebase.google.com/

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

# REDUX
$ npm install --save react-redux
$ npm install --save redux

npm install axios --save

https://github.com/jobtoday/react-native-image-viewing

https://github.com/wonday/react-native-pdf/blob/master/README.md

https://github.com/react-native-community/react-native-webview

https://github.com/joltup/rn-fetch-blob


#### PRA PRODUÇÃO (para INSTALAR no device)
$ rm android/app/src/main/assets/index.android.bundle

(na pasta do projeto) execute o comando
mkdir android/app/src/main/assets (se esta pasta não existir)

Na sequência execute
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Para Rodar
react-native run-android

# Regenerate ios and android folder in React Native Project
Delete ios and android folders.
Inside your project directory.
    npx react-native init YourProjectName
    mv YourProjectName/ios ios
    rm -rf YourProjectName

# Document Scanner
https://github.com/Michaelvilleneuve/react-native-document-scanner

# OpenCV
https://medium.com/@henriqueassunodossantos/react-native-document-scanner-opencv-4-instala%C3%A7%C3%A3o-8f910cb9a893

https://www.npmjs.com/package/react-native-image-crop-picker

yarn add react-native-svg

npm i react-native-orientation-locker

https://github.com/react-native-community/toolbar-android

# Foto de Perfil
https://github.com/archriss/react-native-image-gallery

# Splash screen, nome app, ícone
https://github.com/crazycodeboy/react-native-splash-screen

Ao invés do plugin acima, fiz a configuração toda no Android:
https://www.youtube.com/watch?v=3Gf9yb53bJM
https://apetools.webprofusion.com/#/

# Boarding (tutorial page)
https://github.com/leecade/react-native-swiper

# Integracao Autenticacao

# Integração OpenCV
https://www.youtube.com/watch?v=oNn68UX0194
https://github.com/jhansireddy/AndroidScannerDemo
https://medium.com/hackernoon/how-to-use-opencv-in-react-native-for-image-processing-db997e73678c
https://medium.com/@filswino/making-rest-calls-download-upload-files-with-one-line-of-code-on-android-no-retrofit-needed-5c0574f41476
https://github.com/amitshekhariitbhu/Fast-Android-Networking