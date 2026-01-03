import { useState, useEffect } from "react";
import { Button, ActivityIndicator, Text } from "react-native-paper";
import { Alert, ScrollView, View, KeyboardAvoidingView } from "react-native";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { UserInfo } from "../../dataType/types/user";
import { useSettingNavigation } from "../../navigation/config/screenParams";

import ScInput from "../../components/ScInput";
import { reqUserInfo } from "../../api/user";
import { getEmptyUser } from "../../dataType/dataZero/user";
import { ScDataTypeList } from "../../dataType/types/scInput";
import { getEmptyFile } from "../../dataType/dataZero/file";
import { SafeAreaView } from "react-native-safe-area-context";
/* import { setUserInfo } from "../../store/slice/user";
import ScInput from "../../components/ScInput";

import { pubParams } from "../../components/pub/pubParms"; */

/* const checkError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
}; */

const Profile = () => {
    const [currentUser, setCurrentUser] = useState<UserInfo | undefined>(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const token = useAppSelector(state => state.user.token);
    const navigation = useSettingNavigation();

    useEffect(() => {
        async function initialData() {
            let userRes = await reqUserInfo();
            let user: UserInfo | undefined = getEmptyUser();
            if (userRes.status) {
                user = userRes.data;
            } else {
                Alert.alert("错误", userRes.msg);
                user = undefined;
            }
            setCurrentUser(user);
        }
        initialData();
    }, []);
    /* 
        const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
            if (currentUser === undefined || !isEdit) {
                return
            }
            //更新errors
            setErrors((prevState) => {
                return ({
                    ...prevState,
                    [itemkey]: errMsg,
                });
            });
            //更新输入的用户信息
            setCurrentUser((prevState) => {
    
                // 结构赋值方法
                return ({
                    ...prevState,
                    [itemkey]: value,
                });
            });
        }; 
        //修改提交
        const handleModifyUser = async () => {
            setIsLoading(true)
            let thisUser = cloneDeep(currentUser);
            delete thisUser.menulist;
            delete thisUser.createdate;
            delete thisUser.modifydate;
            delete thisUser.roles;
            const modifyRes = await reqModifyProfile(thisUser);
            if (modifyRes.data.status === 0) {
                thisUser = modifyRes.data.data;
                Alert.prompt("提示", "修改成功!");
            } else {
                Alert.alert("错误", modifyRes.data.statusMsg);
            }
            setCurrentUser(thisUser);
            setIsEdit(false);
            setIsLoading(false);
            handleUpdateUserInfo();
        };
    
        //更新用户信息
        const handleUpdateUserInfo = () => {
            reqUserInfo(token).then(userInfoRes => {
                if (userInfoRes.data.status !== 0) {
                    Alert.alert(
                        "错误",
                        `请求用户信息失败:${userInfoRes.data.statusMsg}`,
                        [{
                            text: "确定",
                        }]);
                    return
                }
                //将userInfo存入store
                const latestUserInfo = userInfoRes.data.data;
                dispatch(setUserInfo(latestUserInfo));
            })
        };
    */
    return (

        <KeyboardAvoidingView style={{ flex: 1 }}>
            {currentUser !== undefined
                ? <ScrollView>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <ScInput
                            dataType={ScDataTypeList.FileUpload}
                            positionID={0}
                            rowIndex={0}
                            rowNumber={0}
                            allowNull={true}
                            itemShowName="附件"
                            errInfo={{ isErr: false, msg: "" }}
                            isEdit={true}
                            itemKey="avatar"
                            width={"100%"}
                            initValue={[]}
                            pickDone={() => { }}
                            isBackendTest={false}
                            isOnSitePhoto={false}
                            key="avatar"
                            onCancel={() => navigation.goBack()}
                        />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                        {/*    {isEdit
                            ? <>
                                <Button mode='text' loading={isLoading} onPress={() => setIsEdit(false)} sx={{ mr: 5 }} maxFontSizeMultiplier={1}>取消</Button>
                                <Button mode='contained' loading={isLoading} disabled={checkError(errors) || isLoading} onPress={handleModifyUser} maxFontSizeMultiplier={1}>保存</Button>
                            </>
                            : <>
                                <Button mode="text" onPress={() => props.navigation.goBack()} style={{ marginHorizontal: 4 }} maxFontSizeMultiplier={1} >返回</Button>
                                <Button mode="contained" onPress={() => setIsEdit(true)} style={{ marginHorizontal: 4 }} maxFontSizeMultiplier={1}>修改</Button>
                            </>
                        } */}
                    </View>
                </ScrollView>
                : <ActivityIndicator />
            }
        </KeyboardAvoidingView>
    );
};

export default Profile;