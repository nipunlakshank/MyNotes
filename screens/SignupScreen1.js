import 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import { FlatList, Keyboard, Pressable, StyleSheet, Text, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import COLORS from "../constants/colors"
import FormField from "../components/FormField"
import MyButton from "../components/MyButton"
import LoadingScreen from './LoadingScreen'
import { API } from '../constants/app'

const SignupScreen1 = ({ navigation, route }) => {

    // states
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [fnameErrors, setFnameErrors] = useState(['First name is not valid.'])
    const [lnameErrors, setLnameErrors] = useState(['Last name is not valid.'])
    const [userTypeErrors, setUserTypeErrors] = useState(['Select a user type.'])
    const [displayErrors, setDisplayErrors] = useState('none')
    const [userType, setUserType] = useState(0)
    const [userTypeOpen, setUserTypeOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userTypes, setUserTypes] = useState([])

    useEffect(() => {
        fetch(`${API.root}/usertypes/get`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log(`\nusertypes: ${JSON.stringify(json)}\n`)
            const items = []
            json.forEach(type => {
                const formatted = {label: type.name, value: type.id}
                items.push(formatted)
            })
            setUserTypes(items)
            setIsLoading(false)
        })
        .catch(e => console.error(e))
    }, [])

    if(isLoading){
        return <LoadingScreen />
    }

    const mainNavigation = route.params.mainNavigation
    const fnamePatterns = [
        { regex: /^[a-z]+$/i, msg: 'First name is not valid.' },
    ]
    const lnamePatterns = [
        { regex: /^[a-z]+$/i, msg: 'Last name is not valid.' },
    ]


    const renderError = (error) => {
        return <Text style={styles.fieldError}>◉ {error}</Text>
    }

    const tryNext = () => {
        console.log(`\nuser type: ${userType}\nfname: ${fname}\nlname: ${lname}\nfname errors: ${fnameErrors}\nlname errors: ${lnameErrors}\nuser type errors: ${userTypeErrors}`)
        setDisplayErrors('flex')
        if (fnameErrors.length || lnameErrors.length || userTypeErrors.length) return
        navigation.navigate('Signup2', { mainNavigation: mainNavigation, data: { fname: fname, lname: lname, userType: userType } })
    }

    return (
        <Pressable style={styles.container} onPress={() => {
            Keyboard.dismiss()
            setUserTypeOpen(false)
        }}>
            <LinearGradient style={styles.bg} colors={[COLORS.secondary, COLORS.primary]}>
                <View style={styles.form}>
                    <View style={styles.formFields}>
                        <View style={styles.fieldGroup}>
                            <FormField type="text" label='First Name'
                                value={fname}
                                patterns={fnamePatterns}
                                setValue={setFname}
                                setErrors={setFnameErrors}
                                setOpen={setUserTypeOpen}
                            />
                            <View style={[styles.errorList, { display: displayErrors }]}>
                                <FlatList data={fnameErrors} renderItem={({ item }) => renderError(item)} />
                            </View>
                        </View>
                        <View style={styles.fieldGroup}>
                            <FormField type="text" label='Last Name'
                                value={lname}
                                patterns={lnamePatterns}
                                setValue={setLname}
                                setErrors={setLnameErrors}
                                setOpen={setUserTypeOpen}
                            />
                            <View style={[styles.errorList, { display: displayErrors }]}>
                                <FlatList data={lnameErrors} renderItem={({ item }) => renderError(item)} />
                            </View>
                        </View>
                        <View style={styles.fieldGroup}>
                            <FormField type="select" label='User type'
                                items={userTypes}
                                value={userType}
                                open={userTypeOpen}
                                setItems={setUserTypes}
                                setValue={setUserType}
                                setErrors={setUserTypeErrors}
                                setOpen={setUserTypeOpen}
                            />
                            <View style={[styles.errorList, { display: displayErrors }]}>
                                <FlatList data={userTypeErrors} renderItem={({ item }) => renderError(item)} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.formButtons}>
                        <MyButton title="Already have an account ?" width={140} fontSize={14} color={COLORS.grey} backgroundColor={COLORS.black}
                            onPress={() => navigation.goBack()}
                        />
                        <MyButton title="Next →" width={140} color={COLORS.white} backgroundColor={COLORS.highlight}
                            onPress={tryNext}
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
        zIndex: 1,
    },
    fieldGroup: {
        marginBottom: 10,
        gap: 5,
    },
    errorList: {
        borderRadius: 10,
        paddingHorizontal: 15,
        overflow: 'hidden',
        zIndex: -1,
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
        zIndex: 0,
    },
})

export default SignupScreen1