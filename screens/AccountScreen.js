import 'react-native-gesture-handler'
import { Button, StyleSheet, Text, View } from "react-native"

const AccountScreen = ({navigation, route}) => {

    const data = route.params.data
    const functions = route.params.functions
    const logout =  functions.logout

    return (
        <View style={styles.container}>
            <View style={styles.mainWrapper}>
                <Text style={styles.sectionTitle}>Account</Text>
                <Text>Account screen</Text>
                <Button title='Logout' onPress={() => logout()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E7EAEC',
    },
    mainWrapper: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
})

export default AccountScreen