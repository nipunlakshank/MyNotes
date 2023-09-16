import 'react-native-gesture-handler'
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './constants/api';

// Containers
import HomeContainer from './containers/HomeContainer';
import LoginContainer from './containers/LoginContainer';

// Screens
import LoadingScreen from './screens/LoadingScreen';
import { postData } from './functions/request';

export default function App() {

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
  ])

  const [isLoading, setIsLoading] = useState(true)
  const [initialScreen, setInitialScreen] = useState('LoginContainer')
  const [data, setData] = useState({})


  useEffect(() => {
    AsyncStorage.getItem("@user_session").then(sessionKey => {
      if (sessionKey == null) {
        setIsLoading(false);
        return
      }
      const session = JSON.parse(sessionKey)
      const authorize = async () => {
        const res = await postData('/login', session)
        if (res.success) {
          setData(res)
          setInitialScreen('HomeContainer')
          setIsLoading(false)
          return
        }

        if (res.msg && res.msg.toLowerCase() === "user not found") {
          AsyncStorage.removeItem("@user_session")
            .then(val => {
              console.log(val)
              setIsLoading(false)
            })
            .catch(e => console.error(e))
        }
      }
      authorize()
    })
      .catch(e => console.error(e))
  }, [])


  if (isLoading) {
    return <LoadingScreen />;
  }

  // this content will show after the promise has resolved
  const Stack = createStackNavigator()
  return (
    <NavigationContainer independent={true} >
      <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
        <Stack.Screen name='LoginContainer' component={LoginContainer} />
        <Stack.Screen name='HomeContainer' component={HomeContainer} initialParams={{ data: data }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
