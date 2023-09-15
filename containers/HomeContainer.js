import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Screens
import NotesScreen from '../screens/NotesScreen'
import AddNoteScreen from '../screens/AddNoteScreen'
import AccountScreen from '../screens/AccountScreen'

const HomeContainer = ({ navigation, route }) => {

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user_session')
      navigation.replace('LoginContainer')
    } catch (e) {
      console.error(e)
    }
  }

  const data = route.params.data

  const initParams = {
    data: data,
    functions: {
      'logout': logout
    }
  }

  console.log(`home-data: ${JSON.stringify(data)}`)
  const Tab = createMaterialBottomTabNavigator()

  // Screen names
  const notesName = 'Notes'
  const addNoteName = 'Add Note'
  const profileName = 'Account'

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Notes"
        inactiveColor="#DED4FA"
        barStyle={{ backgroundColor: '#756AF5' }}

        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            size = focused ? 18 : 20
            color = focused ? '#000' : '#fff'

            if (route.name === notesName) {
              iconName = focused ? 'book' : 'book-outline'
            } else if (route.name === addNoteName) {
              iconName = focused ? 'add-circle' : 'add-circle-outline'
              size = focused ? 20 : 22
            } else if (route.name === profileName) {
              iconName = focused ? 'person' : 'person-outline'
            } else {
              iconName = 'help'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name={notesName} component={NotesScreen} initialParams={initParams} />
        <Tab.Screen name={addNoteName} component={AddNoteScreen} initialParams={initParams} />
        <Tab.Screen name={profileName} component={AccountScreen} initialParams={initParams} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default HomeContainer