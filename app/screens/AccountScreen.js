import 'react-native-gesture-handler'
import { Alert, Button, StyleSheet, Text, View } from "react-native"
import COLORS from '../constants/colors'
import MyButton from '../components/MyButton'

const AccountScreen = ({ route }) => {

    const user = route.params.data.user
    const functions = route.params.functions
    const logout = functions.logout

    const logoutHandler = () => {
        Alert.alert("Warning", "Confirm logout ?",
            [
                {
                    text: "Cancel",
                    style: 'cancel',
                    isPreferred: true,
                },
                {
                    text: "Logout",
                    style: 'destructive',
                    onPress: () => logout(),
                }
            ],
            { cancelable: true })
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainWrapper}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Name: </Text>
                        <Text style={styles.value}>{user.fname} {user.lname}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Mobile: </Text>
                        <Text style={styles.value}>{user.mobile}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>User type: </Text>
                        <Text style={styles.value}>{user.user_type}</Text>
                    </View>
                </View>
                <View style={styles.btnDelete}>
                    <MyButton title="Logout" color={COLORS.white} backgroundColor={COLORS.danger} fontWeight="bold" width="60%"
                        onPress={logoutHandler}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
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
    btnDelete: {
        alignItems: 'center',
        marginTop: 50,
    },
    form: {
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,

    },
    field: {
        flexDirection: 'row',
        width: '60%',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    value: {
        fontSize: 16,
    },
})

export default AccountScreen