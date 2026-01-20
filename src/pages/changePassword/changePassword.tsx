import React, { useState } from "react";
import { View, Text, Button, Modal } from "react-native";
import { dayjs } from "../../i18n/i18n"
import { DateTimeSpinner } from "react-native-date-time-spinner";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

export default function ChangePassword() {
    const [value, setValue] = useState(new Date());
    const [visible, setVisible] = useState(false);

    const handleDateChange = (date: any) => {
        console.log("handleDateChange:", dayjs(date.date).toISOString())
    }

    return (
        <SafeAreaView style={{ padding: 16, flex: 1 }}>
            {/* <Text>{value.toDateString()}</Text> */}
            <Button title="选择日期" onPress={() => setVisible(!visible)} />
            <Modal
                visible={visible}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <DateTimeSpinner
                            mode="datetime"
                            minDate={new Date(1990, 0, 1)}
                            maxDate={new Date(2050, 12, 31)}
                            onDateChange={handleDateChange}
                            LinearGradient={LinearGradient}
                            pickerGradientOverlayProps={{                                
                                locations: [0, 0.4, 0.6, 1],
                            }}
                            styles={{
                                theme: "dark",
                                pickerItem: { fontSize: 20},
                                timeSeparatorText: { fontWeight: "700" },
                                dateTimeSpacer: { width: 20 },
                            }}
                        />
                        <Button title="确定" onPress={() => setVisible(!visible)} />
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}