import { AnimatedFAB,IconButton, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { changeSwapPosition } from "../../store/slice/swapPosition";


interface ScHandSwitchProps {
    docRefresh: () => void;
    cancelAction: () => void;
}

function ScHandSwitch(props: ScHandSwitchProps) {
    const { docRefresh, cancelAction } = props;
    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    // Command buttons position
    const { buttonPosition, swapPosition, orderPosition } = useAppSelector(state => state.swapPosition);
    // Switch command buttons postion
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    return (
        <>
            {isOffline === 0
                ? <AnimatedFAB
                    icon="refresh"
                    label={t("refresh")}
                    extended={false}
                    visible={true}
                    onPress={docRefresh}
                    animateFrom={buttonPosition}
                    style={{ bottom: 128, position: "absolute", ...orderPosition }}
                />
                : null
            }
            <AnimatedFAB
                icon="keyboard-return"
                label={t("back")}
                extended={false}
                visible={true}
                onPress={cancelAction}
                animateFrom={buttonPosition}
                style={{ bottom: 64, position: "absolute", ...orderPosition }}
            />
            <IconButton
                icon="swap-horizontal"
                iconColor={theme.colors.primary}
                onPress={handleSwapPosition}
                style={{ bottom: 160, position: "absolute", ...swapPosition }}
            />
        </>
    );
}

export default ScHandSwitch;