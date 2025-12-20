import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BusinessScreen from "../pages/businessScreen/businessScreen";
import AddressBook from "../pages/addressBook/addressBook";
import WorkOrder from "../pages/workOrder/workOrder";
import WorkOrderList from "../pages/workOrderList/workOrderList";
import ExecutionOrder from "../pages/executionOrder/executionOrder";
import ExecutionOrderList from "../pages/executionOrderList/executionOrderList";
import ExecutionOrderReview from "../pages/executionOrderReview/executionOrderReview";
import ExecutionOrderReviewList from "../pages/executionOrderReviewList/executionOrderReviewList";
import IssueResolutionForm from "../pages/issueResolutionForm/issueResolutionForm";
import IssueResolutionFormList from "../pages/issueResolutionFormList/issueResolutionFormList";
import LookupDocument from "../pages/lookupDocument/lookupDocument";
import ReceivedTraining from "../pages/receivedTraining/receivedTraining";
import PPEReport from "../pages/ppeReport/ppeReport";
import { BusinessNavParamList } from "./config/screenParams";

const BusinessStack = createNativeStackNavigator<BusinessNavParamList>();

const BusinessNav = () => {
    return (
        <BusinessStack.Navigator initialRouteName="BusinessScreen">
            <BusinessStack.Screen name="BusinessScreen" options={{ headerShown: true, title: "业务" }} component={BusinessScreen} />
            <BusinessStack.Screen name="AddressBook" options={{ headerShown: false, title: "通讯录" }} component={AddressBook} />
            <BusinessStack.Screen
                name="WorkOrder"
                options={{ headerShown: false, title: "指令单" }}
                initialParams={{ isNew: true, isModify: false, oriWO: undefined }}
                component={WorkOrder}
            />
            <BusinessStack.Screen
                name="WorkOrderList"
                options={{ headerShown: false, title: "指令单列表" }}
                component={WorkOrderList}
            />
            <BusinessStack.Screen
                name="ExecutionOrder"
                options={{ headerShown: false, title: "执行单" }}
                initialParams={{ isNew: true, isModify: false, oriWO: undefined }}
                component={ExecutionOrder}
            />
            <BusinessStack.Screen
                name="ExecutionOrderList"
                options={{ headerShown: false, title: "执行单列表" }}
                component={ExecutionOrderList}
            />
            <BusinessStack.Screen
                name="ExecutionOrderReview"
                options={{ headerShown: false, title: "执行单审阅" }}
                component={ExecutionOrderReview}
            />
            <BusinessStack.Screen
                name="ExecutionOrderReviewList"
                options={{ headerShown: false, title: "执行单审阅列表" }}
                component={ExecutionOrderReviewList}
            />
            <BusinessStack.Screen
                name="IssueResolutionForm"
                options={{ headerShown: false, title: "处理单" }}
                component={IssueResolutionForm}
            />
            <BusinessStack.Screen
                name="IssueResolutionFormList"
                options={{ headerShown: false, title: "处理单列表" }}
                component={IssueResolutionFormList}
            />
            <BusinessStack.Screen
                name="LookupDocument"
                options={{ headerShown: false, title: "查阅文档" }}
                component={LookupDocument}
            />
            <BusinessStack.Screen
                name="ReceivedTraining"
                options={{ headerShown: false, title: "培训查询" }}
                component={ReceivedTraining}
            />
            <BusinessStack.Screen
                name="PPEReport"
                options={{ headerShown: false, title: "劳保发放查询" }}
                component={PPEReport}
            />
        </BusinessStack.Navigator>
    );
};

export default BusinessNav;