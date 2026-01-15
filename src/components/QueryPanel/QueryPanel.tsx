import { useState, memo, useEffect, useCallback, useMemo } from "react";
import { View, ScrollView } from "react-native";
import { Text, Divider, useTheme, Surface, IconButton, Portal, Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import ScInput from "../ScInput";
import LogicSelect from "./LogicSelect";
import ComparisonsSelect from "./ComparisonsSelect";
import FieldSelect from "./FieldSelect";
import { GetDataTypeDefaultValue } from "../../db/dataTypes";
import { Comparisons, checkConditionsErrors, checkErrors } from "./constructor";

//获取初始查询条件值
const getDefaultCondition = (queryFields) => {
    let condition = {
        logic: "and",
        field: queryFields[0],
        compare: { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
        value: GetDataTypeDefaultValue(queryFields[0].inputType),
        isNecessary: false
    };
    return condition;
};

const QueryPanel = ({ title, queryFields, initalConditions, onOk, onCancel }) => {
    const [conditons, setConditons] = useState([]);
    const theme = useTheme();
    const errors = useMemo(() => checkConditionsErrors(conditons), [conditons]);
    const hasErr = useMemo(() => checkErrors(errors), [conditons]);
    useEffect(() => {
        setConditons(initalConditions);
    }, [initalConditions]);

    //命令按钮位置
    const { buttonPosition } = useSelector(state => state.swapposition);
    //获取输入
    const handleGetValue = useCallback((value, itemKey, positionID, rowIndex, errMsg) => {
        //更新输入值        
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);
            if (itemKey === "field") {//如果修改的是field字段          
                let oldCompareId = newConditions[rowIndex].compare.id;
                //判断返回值类型
                const currentComps = Comparisons.filter((item) => item.applicable.includes(value.resultType));
                const inComps = currentComps.some((item) => item.id === oldCompareId);
                if (!inComps) {
                    newConditions[rowIndex].compare = currentComps[0];
                }
                //修改value值
                newConditions[rowIndex].value = GetDataTypeDefaultValue(value.inputType);
            }
            newConditions[rowIndex][itemKey] = value;
            return newConditions;
        });
    }, []);
    //增加查询条件行
    const handleAddCondition = () => {
        //增加条件行       
        const newConditions = cloneDeep(conditons);
        newConditions.push(getDefaultCondition(queryFields));
        //更新 
        setConditons(newConditions);
    };
    //删除查询条件
    const handleDeleteCondition = (index) => {
        //删除行
        const newConditions = cloneDeep(conditons);
        newConditions.splice(index, 1);
        //更新
        setConditons(newConditions);

    };
    //点击确定按钮
    const handleOk = () => {
        onOk(conditons);
    };

    return (
        <Portal.Host>
            <View style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 40,
                width: "100%",
                backgroundColor: theme.colors.background
            }}>
                <Surface style={{ padding: 4, minHeight: 40, width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text variant="titleMedium">{title}</Text>
                </Surface>
            </View>
            <Divider />
            <View style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}>
                <ScrollView>
                    {conditons.map((condition, index) => {
                        return <Surface key={index} style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", alignItems: "center", margin: 4, padding: 4 }}>
                            <View style={{ width: "40%", height: 64 }}>
                                {index !== 0
                                    ? <LogicSelect
                                        itemShowName="逻辑"
                                        itemKey="logic"
                                        rowIndex={index}
                                        pickDone={handleGetValue}
                                        isEdit={!condition.isNecessary}
                                    />
                                    : null
                                }
                            </View>
                            <View style={{ width: "60%", height: 64 }}>
                                <FieldSelect
                                    itemShowName="字段"
                                    itemKey="field"
                                    rowIndex={index}
                                    pickDone={handleGetValue}
                                    fields={queryFields}
                                    selected={condition.field}
                                    isEdit={!condition.isNecessary}
                                />
                            </View>
                            <View style={{ width: "40%", height: 64, padding: 0, margin: 0 }}>
                                <ComparisonsSelect
                                    itemShowName="比较"
                                    itemKey="compare"
                                    rowIndex={index}
                                    pickDone={handleGetValue}
                                    dataType={condition.field.resultType}
                                    selected={condition.compare}
                                    isEdit={!condition.isNecessary}
                                />
                            </View>
                            <View style={{ width: "60%", height: 64 }}>
                                {condition.compare.needInput
                                    ? <ScInput
                                        dataType={condition.field.inputType}
                                        errInfo={errors[index]}
                                        itemShowName={condition.field.label}
                                        pickDone={handleGetValue}
                                        initValue={condition.value}
                                        rowIndex={index}
                                        itemKey="value"
                                        isEdit={true}
                                        allowNull={false}
                                        udc={condition.field.inputType === 550 ? condition.field.udc : { id: 0, code: '', name: "" }}
                                    />
                                    : null
                                }
                            </View>
                            <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", margin: 0, padding: 0 }}>
                                <IconButton
                                    icon="delete"
                                    disabled={condition.isNecessary}
                                    iconColor={theme.colors.primary}
                                    onPress={() => handleDeleteCondition(index)}
                                />
                            </View>
                        </Surface>
                    })}
                </ScrollView>
            </View>
            <Surface style={{ minHeight: 60, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center", padding: 2, backgroundColor: theme.colors.background }}>
                <Button mode="text" onPress={onCancel} textColor={theme.colors.error} style={{ margin: 4 }}>取消</Button>
                <Button icon="plus" onPress={handleAddCondition} style={{ margin: 4 }}>增加</Button>
                <Button icon="check" mode="contained" disabled={hasErr} onPress={handleOk} style={{ margin: 4 }}>确定</Button>
            </Surface>
        </Portal.Host>
    );
};

QueryPanel.defaultProps = {
    title: "查询条件",
};

export default memo(QueryPanel);