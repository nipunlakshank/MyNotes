import 'react-native-gesture-handler'
import { useState } from 'react'
import { FlatList, Keyboard, Pressable, StyleSheet, Text, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import COLORS from "../constants/colors"
import FormField from "../components/FormField"
import MyButton from "../components/MyButton"
import { postData } from '../functions/request'


const SignupScreen2 = ({ navigation, route }) => {

    const functions = route.params.functions
    const data = route.params.data
    const mobilePatterns = [
        { regex: /^(\+94|0)7[01245678][0-9]{7}$/, msg: 'Mobile not valid.' },
    ]
    const passwordPatterns = [
        { regex: /[a-z]+/, msg: 'Password should contain at least one simple letter.' },
        { regex: /[A-Z]+/, msg: 'Password should contain at least one capital letter.' },
        { regex: /[0-9]+/, msg: 'Password should contain at least one digit.' },
        { regex: /[!"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~\\]+/, msg: 'Password should contain at least one special character.' },
        { regex: /^[abcdefghijklmnopqrstuvwxyz0123456789 !"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~\\]*$/i, msg: 'Password contains illegal characters.' },
    ]

    // states
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [mobileErrors, setMobileErrors] = useState(['Mobile not valid'])
    const [passwordErrors, setPasswordErrors] = useState(['Password cannot be empty'])
    const [displayErrors, setDisplayErrors] = useState('none')


    const setErrors = errors => {
        if (errors.mobile) {
            setMobileErrors([errors.mobile])
        }
        if (errors.password) {
            setPasswordErrors([errors.password])
        }
    }

    const trySignup = async () => {
        setDisplayErrors('flex')
        setMobileErrors([])
        setPasswordErrors([])
        if (mobileErrors.length || passwordErrors.length) return

        const res = await postData('/register', { fname: data.fname, lname: data.lname, user_types_id: data.userType, mobile: mobile, password: password })

        if (!res.success) {
            if (res.errors) {
                setErrors(res.errors)
            }
            return
        }

        const user_session = {id: res.user.id, token: res.user.token}
        try {
            await AsyncStorage.setItem('@user_session', JSON.stringify(user_session))
            await functions.login({ id: res.user.id, token: res.user.token }, res)
        } catch (e) {
            console.error(e)
        }
    }

    const renderError = (error) => {
        if (error === '') return
        return <Text style={styles.fieldError}>◉ {error}</Text>
    }

    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <LinearGradient style={styles.bg} colors={[COLORS.secondary, COLORS.primary]}>
                <View style={styles.form}>
                    <View style={styles.formFields}>
                        <View style={styles.fieldGroup}>
                            <FormField label='Mobile'
                                patterns={mobilePatterns}
                                setValue={setMobile}
                                setErrors={setMobileErrors}
                            />
                            <View style={[styles.errorList, { display: displayErrors }]}>
                                <FlatList data={mobileErrors} renderItem={({ item }) => renderError(item)} />
                            </View>
                        </View>
                        <View style={styles.fieldGroup}>
                            <FormField type="password" minLength={6} label='Password'
                                patterns={passwordPatterns}
                                setValue={setPassword}
                                setErrors={setPasswordErrors}
                            />
                            <View style={[styles.errorList, { display: displayErrors }]}>
                                <FlatList data={passwordErrors} renderItem={({ item }) => renderError(item)} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.formButtons}>
                        <MyButton title="← Back" width={140} fontSize={14} color={COLORS.grey} backgroundColor={COLORS.black}
                            onPress={() => navigation.goBack()}
                        />
                        <MyButton title="Signup" width={140} color={COLORS.white} backgroundColor={COLORS.highlight} fontWeight="bold"
                            onPress={trySignup}
                        />
                    </View>
                </View>
            </LinearGradient>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: '80%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formFields: {
        width: '100%',
    },
    fieldGroup: {
        marginBottom: 10,
        gap: 5,
    },
    errorList: {
        borderRadius: 10,
        paddingHorizontal: 15,
        overflow: 'hidden',
    },
    fieldError: {
        color: COLORS.warning,
        marginVertical: 3,
        fontSize: 13,
    },
    formButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginVertical: 30,
    },
})

export default SignupScreen2