import { Pressable, StyleSheet, Text, View } from "react-native"
import COLORS from "../constants/colors"


const MyButton = props => {

    const height = props.height ? props.height : 'auto'
    const width = props.width ? props.width : 'auto'
    const title = props.title ? props.title : 'Click Me'
    const backgroundColor = props.backgroundColor ? props.backgroundColor : COLORS.highlight
    const color = props.color ? props.color : COLORS.black
    const fontSize = props.fontSize ? props.fontSize : 16
    const fontWeight = props.fontWeight ? props.fontWeight : 'normal'

    const styles = StyleSheet.create({
        container: {
            height: height,
            width: width,
            backgroundColor: backgroundColor,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 50,
            justifyContent: 'center',
        },
        bg: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            color: color,
            fontSize: fontSize,
            fontWeight: fontWeight,
        },
    })

    return (
        <Pressable style={styles.container}
            onPress={props.onPress}
            onLongPress={props.onLongPress}
        >
            <View style={styles.bg}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </Pressable>
    );
};


export default MyButton
