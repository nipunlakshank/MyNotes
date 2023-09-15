import { useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import DropDownPicker from 'react-native-dropdown-picker'
import COLORS from "../constants/colors"

const FormField = (props) => {

    const [labelColor, setLabelColor] = useState('#000')

    // default styles
    const labelDefaultStyle = {
        fontSize: 16,
        color: '#000',
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

    const errors = []
    const type = props.type ? props.type : "text"
    const parentItems = props.items ? props.items : []
    const label = props.label ? props.label : "Label"
    const patterns = props.patterns ? props.patterns : [/.+/]
    const minLength = props.minLength ? props.minLength : 0
    const maxLength = props.maxLength ? props.maxLength : 254
    const defaultValue = props.value ? props.value : ''
    const setParentValue = props.setValue ? props.setValue : value => { return }
    const setParentItems = props.setItems ? props.setItems : items => { return }
    const setParentSelectorOpen = props.setOpen ? props.setOpen : value => { return }
    const parentOpen = props.open ? props.open : value => { return }
    const setErrors = props.setErrors ? props.setErrors : error => { return }
    const onSubmit = props.onSubmit ? props.onSubmit : () => { return }
    const setConfirmPasswordRegex = props.setConfirmPasswordRegex ? props.setConfirmPasswordRegex : regex => { return }

    // States
    const [labelStyle, setLabelStyle] = useState(labelDefaultStyle)
    const [value, setValue] = useState(defaultValue)
    const [items, setItems] = useState(parentItems)
    const [showText, setShowText] = useState(false)
    const [icon, setIcon] = useState('eye-outline')
    const [selecterOpen, setSelecterOpen] = useState(parentOpen)
    let patternMatched = false


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
        setErrors(errors)

        if (patternMatched) {
            setLabelStyle(labelMatchedStyle)
            setLabelColor(COLORS.success)
            return
        }
        setLabelStyle(labelNotMatchedStyle)
        setLabelColor(COLORS.warning)
    }

    const focusValidation = () => {
        setLabelStyle(labelFocusedStyle)
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
            paddingRight: props.secureTextEntry ? 40 : 20,
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
                    open={selecterOpen}
                    value={value}
                    items={items}
                    setOpen={opened => {
                        setSelecterOpen(opened)
                        setParentSelectorOpen(opened)
                    }}
                    setValue={selected => {
                        setErrors([])
                        setValue(selected)
                        setParentValue(selected)
                    }}
                    setItems={items => {
                        setItems(items)
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
                        if (showText) {
                            setIcon('eye-outline')
                            setShowText(false)
                            return
                        }
                        setIcon('eye-off-outline')
                        setShowText(true)
                    }}
                >
                    <Ionicons name={icon} size={20} />
                </Pressable>
                <TextInput style={styles.input} secureTextEntry={!showText} autoCorrect={false}
                    onChangeText={text => {
                        setValue(text)
                        setParentValue(text)
                        setConfirmPasswordRegex(new RegExp(`/^${text}$/`))
                        validate(text)
                    }}
                    onFocus={focusValidation}
                    onBlur={() => {
                        if (value === '')
                            setLabelStyle(labelDefaultStyle)
                    }}
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
                onChangeText={text => {
                    setValue(text)
                    setParentValue(text)
                    validate(text)
                }}
                onFocus={focusValidation}
                onBlur={() => {
                    if (value === '')
                        setLabelStyle(labelDefaultStyle)
                }}
                onSubmitEditing={onSubmit}
                onPressIn={() => {
                    setParentSelectorOpen(false)
                }}
            />
        </View>
    )
}


export default FormField