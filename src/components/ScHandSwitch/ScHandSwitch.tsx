import { useRef, useState, useEffect } from "react";
import { AnimatedFAB, IconButton, MD3Theme } from "react-native-paper";
import { TFunction } from "i18next";
import { PanResponder, View } from "react-native";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { changeSwapPosition, setBottomDistance } from "../../store/slice/swapPosition";

interface ScHandSwitchProps {
    refreshDisplay: boolean;
    docRefresh: () => void;
    cancelAction: () => void;
    theme: MD3Theme;
    t: TFunction;
}

function ScHandSwitch(props: ScHandSwitchProps) {
    const { refreshDisplay = true, docRefresh, cancelAction, theme, t } = props;
    const dispatch = useAppDispatch();
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    // Command buttons position
    const { buttonPosition, swapPosition, orderPosition, bottomDistance } = useAppSelector(state => state.swapPosition);
    // Switch command buttons postion
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };
console.log("render ScHandSwitch with bottomDistance:", bottomDistance);
    // Drag to change bottomDistance using PanResponder
    const MIN_BOTTOM = 40;   // clamp min
    const MAX_BOTTOM = 300;  // clamp max
    const [tempBottom, setTempBottom] = useState<number>(bottomDistance);
    const startBottomRef = useRef<number>(bottomDistance);
    useEffect(() => {
        // keep local temp in sync if redux value changes externally
        setTempBottom(bottomDistance);
    }, [bottomDistance]);

    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                startBottomRef.current = tempBottom;
            },
            onPanResponderMove: (_evt, gestureState) => {
                // gestureState.dy > 0 means finger moved down -> increase bottom
                const newBottom = clamp(startBottomRef.current - gestureState.dy, MIN_BOTTOM, MAX_BOTTOM);
                setTempBottom(newBottom);
            },
            onPanResponderRelease: (_evt, gestureState) => {
                const finalBottom = clamp(startBottomRef.current - gestureState.dy, MIN_BOTTOM, MAX_BOTTOM);
                setTempBottom(finalBottom);
                // Persist the new bottom distance to redux (replace with your actual action)
                dispatch(setBottomDistance(finalBottom));
                // If you don't have setBottomDistance action, implement one in swapPosition slice.
                console.log("save bottomDistance:", finalBottom);
            }
        })
    ).current;

    return (
        <>
            {isOffline === 0 && refreshDisplay
                ? <AnimatedFAB
                    icon="refresh"
                    label={t("refresh")}
                    extended={false}
                    visible={true}
                    onPress={docRefresh}
                    animateFrom={buttonPosition}
                    style={{ bottom: bottomDistance, position: "absolute", ...orderPosition }}
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
                style={{ bottom: tempBottom - 64, position: "absolute", ...orderPosition }}
            />
            <IconButton
                icon="swap-horizontal"
                iconColor={theme.colors.primary}
                onPress={handleSwapPosition}
                style={{ bottom: tempBottom + 48, position: "absolute", ...swapPosition }}
            />
            {/* Drag handle wrapper: attach pan handlers here */}
            <View {...panResponder.panHandlers} style={{ position: "absolute", bottom: tempBottom, ...swapPosition }}>
                <IconButton
                    id="dragSwap"
                    icon="swap-vertical"
                    iconColor={theme.colors.primary}                   
                />
            </View>
        </>
    );
}

export default ScHandSwitch;