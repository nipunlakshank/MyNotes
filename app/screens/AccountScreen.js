import 'react-native-gesture-handler'
import { Alert, Button, StyleSheet, Text, View } from "react-native"
import COLORS from '../constants/colors'

const AccountScreen = ({ navigation, route }) => {

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
                <View style={styles.btnDelete}>
                    <Button color={COLORS.danger} title='Logout' onPress={logoutHandler} />
                </View>
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
        alignSelf: 'flex-end',
        marginVertical: 10,
    },
    form: {
        marginTop: 40,
        height: '80%',
        paddingVertical: 20,
        gap: 40,
    },
    field: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
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