import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ActivityIndicator, Text, TextInput } from "react-native-paper";
import { Alert, ScrollView, View, KeyboardAvoidingView } from "react-native";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { UserInfo } from "../../dataType/types/user";
import { useSettingNavigation } from "../../navigation/config/screenParams";
import { pubParams } from "../../components/pub/pubParams";


import ScInput from "../../components/ScInput";
import { reqUserInfo } from "../../api/user";
import { getEmptyUser } from "../../dataType/dataZero/user";
import { ScDataTypeList, InitialValueMap, ErrMsg } from "../../dataType/types/scInput";
import { getEmptyFile } from "../../dataType/dataZero/file";

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
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.user.token);
    const navigation = useSettingNavigation();
    const { t } = useTranslation();

    useEffect(() => {
        async function initialData() {
            let userRes = await reqUserInfo();
            let user: UserInfo | undefined = getEmptyUser();
            if (userRes.status) {
                user = userRes.data;
            } else {
                Alert.alert(t("error"), userRes.msg);
                user = undefined;
            }
            console.log("user:", user)
            setCurrentUser(user);
        }
        initialData();
    }, []);

    const handleGetValue = <T extends keyof InitialValueMap>(value: InitialValueMap[T], itemkey: string, positionID: 0 | 1 | 2, rowIndex: number, errMsg: ErrMsg) => {
        console.log("value:", value);
        if (currentUser === undefined || !isEdit) {
            return
        }

        //更新errors
        setErrors((prevState: any) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新输入的用户信息
        setCurrentUser((prevState: any) => {
            // 结构赋值方法
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };
    /* //修改提交
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
                            dataType={ScDataTypeList.AvatarUpload}
                            positionID={0}
                            rowIndex={0}
                            rowNumber={0}
                            allowNull={true}
                            itemShowName={t("avatar")}
                            errInfo={{ isErr: false, msg: "" }}
                            isEdit={isEdit}
                            itemKey="avatar"
                            width={"100%"}
                            initValue={getEmptyFile()}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            isOnSitePhoto={false}
                            key="avatar"
                            onCancel={() => navigation.goBack()}
                        />
                        <ScInput
                            dataType={ScDataTypeList.Text}
                            positionID={0}
                            rowIndex={0}
                            rowNumber={0}
                            allowNull={false}
                            itemShowName={t("code")}
                            errInfo={{ isErr: false, msg: "" }}
                            isEdit={false}
                            itemKey="code"
                            initValue={currentUser.code}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="code"
                            width={pubParams.screen.isOverSize ? "100%" : "50%"}
                        />
                        <ScInput
                            dataType={ScDataTypeList.Text}
                            positionID={0}
                            rowIndex={0}
                            rowNumber={0}
                            allowNull={false}
                            itemShowName={t("name")}
                            errInfo={{ isErr: false, msg: "" }}
                            isEdit={false}
                            itemKey="name"
                            initValue={currentUser.name}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="name"
                            width={pubParams.screen.isOverSize ? "100%" : "50%"}
                        />
                        <ScInput
                            dataType={ScDataTypeList.Gender}
                            positionID={0}
                            rowIndex={0}
                            rowNumber={0}
                            allowNull={true}
                            isEdit={false}
                            itemShowName={t("gender")}
                            errInfo={{ isErr: false, msg: "" }}
                            itemKey="gender"
                            initValue={currentUser.person.gender}
                            pickDone={handleGetValue}
                            placeholder="请选择性别"
                            key="gender"
                            isBackendTest={false}
                            width={pubParams.screen.isOverSize ? "100%" : "50%"}
                        />
                        <ScInput
                            dataType={ScDataTypeList.SimpDept}
                            positionID={0}
                            rowIndex={0}
                            rowNumber={0}
                            allowNull={true}
                            isEdit={true}
                            itemShowName="所属部门"
                            itemKey="department"
                            initValue={currentUser.department}
                            pickDone={handleGetValue}
                            errInfo={{ isErr: false, msg: "" }}
                            placeholder="请选择部门"
                            key="department"
                            isBackendTest={false}
                            width={pubParams.screen.isOverSize ? "100%" : "50%"}
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