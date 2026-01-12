import { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    
    KeyboardAvoidingView,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard
} from 'react-native';
import { TextInput } from 'react-native-paper';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
    SafeAreaView
} from 'react-native-safe-area-context';


function ChangePassword() {
    const safeAreaInsets = useSafeAreaInsets();
    const [text, onChangeText] = useState('Useless Text');
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <View style={styles.inner}>
                    <Text style={styles.header}>Header</Text>
                    <TextInput placeholder="Username" style={styles.textInput} />
                    <View style={styles.btnContainer}>
                        <Button title="Submit" onPress={() => null} />
                    </View>                    
                </View>
            {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-around',
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default ChangePassword; 