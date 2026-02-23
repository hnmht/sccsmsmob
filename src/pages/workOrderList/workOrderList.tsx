import { useState, useEffect } from "react";
import { View } from "react-native";
import {  useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
// import RemoteWorkOrderList from "./remoteWorkOrderList";
// import LocalWorkOrderList from "./localWorkOrderList";
// import ScSwapButton from "../../components/ScSwapButton/ScSwapButton";
import { useAppSelector } from "../../store/hooks";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import ScSegmentLocalOrRemote from "../../components/ScSegmentLocalOrRemote/ScDegmentLocalOrRemote";
import { SafeAreaView } from "react-native-safe-area-context";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

const WorkOrderList = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useBusinessNavigation();
    const route = useBusinessRoute();
    const [localOrRemote, setLocalOrRemote] = useState<"local" | "remote">("local");
    const isOffline = useAppSelector(state => state.appInfo.isOffline);

    const handleGoBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        let newDisplay = localOrRemote;
        if (isOffline === 1) {
            newDisplay = "local";
        }
        setLocalOrRemote(newDisplay);
    }, [isOffline]);

    //远程和本地切换
    const handleChangeDataSource = (value: "local" | "remote") => {
        setLocalOrRemote(value);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScFunctionTitle title="MenuWOList" icon="bookmark-multiple" theme={theme} t={t} />
            <ScSegmentLocalOrRemote
                localOrRemote={localOrRemote}
                setLocalOrRemote={handleChangeDataSource}
                theme={theme}
                t={t}
                isOffline={isOffline}
            />
           {localOrRemote === "remote"
              /*   ? <RemoteWorkOrderList navigation={navigation} route={route} />
                : <LocalWorkOrderList navigation={navigation} route={route} /> */
            }
           
            <ScHandSwitch
                docRefresh={() => { }}
                cancelAction={handleGoBack}
                theme={theme}
                t={t}
            />
        </SafeAreaView>
    );
};

export default WorkOrderList;