import 'react-native-gesture-handler'
import { SafeAreaView, StyleSheet, Text } from "react-native"

const LoadingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Loading...</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default LoadingScreen