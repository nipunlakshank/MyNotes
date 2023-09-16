import 'react-native-gesture-handler'
import { useState } from 'react'
import { FlatList, Keyboard, Pressable, StyleSheet, Text, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import COLORS from "../constants/colors"
import FormField from "../components/FormField"
import MyButton from "../components/MyButton"
import API from '../constants/api'
import { postData } from '../functions/request'

const LoginScreen = ({ navigation, route }) => {

    const functions = route.params.functions
    const mobilePatterns = [
        { regex: /^(\+94|0)7[01245678][0-9]{7}$/, msg: 'Mobile not valid.' },
    ]
    const passwordPatterns = [
        { regex: /.*/, msg: '' },
    ]


    // states
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [mobileErrors, setMobileErrors] = useState(['Mobile not valid'])
    const [passwordErrors, setPasswordErrors] = useState(['Password cannot be empty'])
    const [displayErrors, setDisplayErrors] = useState('none')

    const tryLogin = async () => {

        setMobileErrors([])
        setPasswordErrors([])
        if (mobileErrors.length || passwordErrors.length) {
            setDisplayErrors('flex')
        }

        const res = await postData('/login', { mobile: mobile, password: password })

        if (!res.success) {
            if (res.errors) {
                setErrors(res.errors)
            }
            return
        }

        try {
            await functions.login({ id: res.user.id, token: res.user.token }, res)
        } catch (e) {
            console.error(e)
        }
    }

    const setErrors = errors => {
        setDisplayErrors('flex')

        if (errors.mobile)
            setMobileErrors([errors.mobile])

        if (errors.password)
            setPasswordErrors([errors.password])

        console.log(errors)
    }

    const renderError = (error) => {
        return <Text style={styles.fieldError}>◉ {error}</Text>
    }

    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <LinearGradient style={styles.bg} colors={[COLORS.secondary, COLORS.primary]}>
                <View style={styles.form}>
                    <View style={styles.formFields}>
                        <View style={styles.fieldGroup}>
                            <FormField type="text" label='Mobile'
                                patterns={mobilePatterns}
                                value={mobile}
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
                                value={password}
                                setValue={setPassword}
                                setErrors={setPasswordErrors}
                            />
                            <View style={[styles.errorList, { display: displayErrors }]}>
                                <FlatList data={passwordErrors} renderItem={({ item }) => renderError(item)} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.formButtons}>
                        <MyButton title="Don't have an account ?" fontSize={14} width={160} color={COLORS.grey} backgroundColor={COLORS.black}
                            onPress={() => navigation.navigate('Signup1')}
                        />
                        <MyButton title="Login" width={140} color={COLORS.white} backgroundColor={COLORS.highlight} fontWeight="bold"
                            onPress={tryLogin}
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

export default LoginScreen