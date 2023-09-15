import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen1 from '../screens/SignupScreen1';
import SignupScreen2 from '../screens/SignupScreen2';


const LoginContainer = ({ navigation }) => {

  const Stack = createStackNavigator()

  const login = async (user_session, data) => {
    const initParams = {
      'data': data
    }
    try {
      await AsyncStorage.setItem('@user_session', JSON.stringify(user_session))
      navigation.replace('HomeContainer', initParams)
    } catch (e) {
      console.error(e)
    }
  }

  const initParams = {
    functions: {
      'login': login
    }
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerLeft: false }}>
        <Stack.Screen name='Login' component={LoginScreen} initialParams={initParams} />
        <Stack.Screen name='Signup1' options={{ title: "Signup" }} component={SignupScreen1} initialParams={ initParams } />
        <Stack.Screen name='Signup2' options={{ title: "Signup" }} component={SignupScreen2} initialParams={ initParams } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoginContainer