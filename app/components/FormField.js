import { useCallback, useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import DropDownPicker from 'react-native-dropdown-picker'
import COLORS from "../constants/colors"
import { useFocusEffect } from "@react-navigation/native"

const FormField = (props) => {

    const [labelColor, setLabelColor] = useState(COLORS.black)

    // label styles
    const labelDefaultStyle = {
        fontSize: 16,
        color: COLORS.black,
    }
    const labelFocusedStyle = {
        fontSize: 12,
        top: 0,
        color: labelColor,
    }
    const labelMatchedStyle = {
        fontSize: 12,
        top: 0,
        color: COLORS.success,
    }
    const labelNotMatchedStyle = {
        fontSize: 12,
        top: 0,
        color: COLORS.danger,
    }

    const defaultSubmit = () => {
        if (!isFocused && parentValue === '') {
            setLabelStyle(labelDefaultStyle)
        }
    }

    const errors = []
    const type = props.type ?? "text"
    const parentItems = props.items ?? []
    const label = props.label ?? "Label"
    const patterns = props.patterns ?? [/.+/]
    const minLength = props.minLength ?? 0
    const maxLength = props.maxLength ?? 254
    const parentValue = props.value ?? ''
    const setParentValue = props.setValue ?? (value => { return })
    const setParentItems = props.setItems ?? (items => { return })
    const setParentSelectorOpen = props.setOpen ?? (value => { return })
    const parentSelectorOpen = props.open ?? (value => { return })
    const setErrors = props.setErrors ?? (error => { return })
    const onSubmit = props.onSubmit ?? defaultSubmit
    const setConfirmPasswordRegex = props.setConfirmPasswordRegex ?? (regex => { return })
    const showPassword = props.showPassword ?? true
    const setShowPassword = props.setShowPassword ?? (val => { return })

    // States
    const [labelStyle, setLabelStyle] = useState(labelDefaultStyle)
    const [value, setValue] = useState(parentValue)
    const [items, setItems] = useState(parentItems)
    const [showText, setShowText] = useState(false)
    const [icon, setIcon] = useState('eye-outline')
    const [selecterOpen, setSelecterOpen] = useState(parentSelectorOpen)
    const [isFocused, setIsFocused] = useState(false)
    let patternMatched = false


    useFocusEffect(
        useCallback(() => {
            const focusLost = () => {
                setParentValue('')
                setLabelStyle(labelDefaultStyle)
                setIcon('eye-outline')
                setShowPassword(false)
                setParentSelectorOpen(false)
                setErrors([])
                setLabelColor(COLORS.black)
            }
            return focusLost
        }, [])
    )

    const validate = text => {

        errors.length = 0

        for (const pattern of patterns) {
            if (!pattern.regex.test(text)) {
                errors.push(pattern.msg)
            }
        }
        if (text.length < minLength) {
            errors.push(`Minimum length of ${label} should be ${minLength}`)
        }
        if (text.length > maxLength) {
            errors.push(`Maximum length of ${label} should be ${maxLength}`)
        }

        patternMatched = errors.length === 0

        if (patternMatched) {
            setLabelStyle(labelMatchedStyle)
            setLabelColor(COLORS.success)
            return
        }
        setErrors(errors)
        setLabelStyle(labelNotMatchedStyle)
        setLabelColor(COLORS.danger)
    }

    const focusHandler = () => {
        setLabelStyle(labelFocusedStyle)
    }

    const blurHandler = () => {
        if (parentValue === '')
            setLabelStyle(labelDefaultStyle)
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: COLORS.white,
            borderRadius: 60,
            height: 50,
            width: '100%',
            position: 'relative',
            justifyContent: 'center',
        },
        label: {
            position: 'absolute',
            left: 20,
            paddingVertical: 5,

        },
        input: {
            paddingLeft: 20,
            paddingRight: props.type.toLowerCase() === 'password' ? 40 : 20,
            paddingTop: 20,
            paddingBottom: 10,
            fontSize: 16,
            overflow: 'hidden'
        },
        dropdown: {
            paddingLeft: 20,
            fontSize: 16,
            borderRadius: 50,
            borderWidth: 0,
            overflow: 'hidden',
        },
        icon: {
            position: 'absolute',
            right: 10,
            paddingVertical: 5,
            paddingHorizontal: 6,
            borderRadius: 25,
            zIndex: 1,
        },
    })

    if (type === 'select')
        return (
            <View style={styles.container}>
                <DropDownPicker style={styles.dropdown} autoCorrect={false}
                    placeholder={label}
                    placeholderStyle={{ fontSize: 16 }}
                    open={parentSelectorOpen}
                    value={parentValue}
                    items={parentItems}
                    setOpen={setParentSelectorOpen}
                    setValue={val => {
                        setErrors([])
                        setParentValue(val)
                    }}
                    setItems={items => {
                        setParentItems(items)
                    }}
                />
            </View>
        )

    if (type === "password") {
        return (
            <View style={styles.container}>
                <Text style={[styles.label, labelStyle]}>{label}</Text>
                <Pressable style={styles.icon} hitSlop={10}
                    onPress={() => {
                        if (showPassword) {
                            setIcon('eye-outline')
                            setShowPassword(false)
                            return
                        }
                        setIcon('eye-off-outline')
                        setShowPassword(true)
                    }}
                >
                    <Ionicons name={icon} size={20} />
                </Pressable>
                <TextInput style={styles.input} secureTextEntry={!showPassword} autoCorrect={false}
                    value={parentValue}
                    onChangeText={text => {
                        setValue(text)
                        setParentValue(text)
                        setConfirmPasswordRegex(new RegExp(`/^${text}$/`))
                        validate(text)
                        if (!isFocused && parentValue === '') {
                            setLabelStyle(labelDefaultStyle)
                        }
                    }}
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                    blurOnSubmit={true}
                    onSubmitEditing={onSubmit}
                    onPressIn={() => {
                        setParentSelectorOpen(false)
                    }}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.label, labelStyle]}>{props.label}</Text>
            <TextInput style={styles.input} autoCorrect={false}
                value={parentValue}
                onChangeText={text => {
                    setValue(text)
                    setParentValue(text)
                    validate(text)
                    if (!isFocused && parentValue === '') {
                        setLabelStyle(labelDefaultStyle)
                    }
                }}
                onFocus={focusHandler}
                onBlur={blurHandler}
                onSubmitEditing={onSubmit}
                onPressIn={() => {
                    setParentSelectorOpen(false)
                }}
            />
        </View>
    )
}


export default FormField