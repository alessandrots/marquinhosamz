{
    /**
     * cadastro de login, login, etc
     * rotas não logadas
    */
}
import React from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const AuthStack = createStackNavigator();

 function AuthRoutes() {
 return (
    <AuthStack.Navigator>
        <AuthStack.Screen
            name="Login-Aizon"
            component={SignIn}
            options={{
                headerStyle: {
                    backgroundColor: '#0EABB5',
                },
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
          }}
        />

        <AuthStack.Screen
            name="SignUp"
            component={SignUp}
            options={{
                headerStyle:{
                    backgroundColor: '#0EABB5',
                    borderBottomWidth: 1,
                    borderBottomColor: '#00b94a'
                },
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false,
                headerTitle: 'Voltar'
            }}
        />
    </AuthStack.Navigator>
  );
}

export default AuthRoutes;