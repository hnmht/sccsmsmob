import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BusinessScreen from "../pages/businessScreen/businessScreen";
import AddressBook from "../pages/addressBook/addressBook";
import WorkOrderDoc from "../pages/workOrder/workOrder";
// import WorkOrderList from "../pages/workOrderList/workOrderList";
// import ExecuteDoc from "../pages/executeDoc/executeDoc";
// import ExecuteDocList from "../pages/executeDocList/executeDocList";
// import ExecuteDocReview from "../pages/executeDocReview/executeDocReview";
// import ExecuteDocReviewList from "../pages/executeDocReviewList/executeDocReviewList";
// import DisposeDoc from "../pages/disposeDoc/disposeDoc";
// import DisposeDocList from "../pages/disposeList/disposeDocList";
// import LookupDocument from "../pages/lookupDocument/lookupDocument";
// import ReciveTraining from "../pages/reciveTraining/reciveTraining";
// import LpaQuery from "../pages/lpaQuery/lpaQuery";

const BusinessStack = createNativeStackNavigator();

const BusinessNav = () => {
    return (
        <BusinessStack.Navigator initialRouteName="BusinessScreen">
            <BusinessStack.Screen name="BusinessScreen" options={{ headerShown: true, title: "业务" }} component={BusinessScreen} />
            <BusinessStack.Screen name="AddressBook" options={{ headerShown: false, title: "通讯录" }} component={AddressBook} />
            <BusinessStack.Screen
                name="WorkOrder"
                options={{ headerShown: false, title: "指令单" }}
                initialParams={{ isNew: true, isModify: false, oriWO: undefined }}
                component={WorkOrderDoc}
            />
            {/* <BusinessStack.Screen
                name="WorkOrderList"
                options={{ headerShown: false, title: "指令单列表" }}
                component={WorkOrderList}
            />
            <BusinessStack.Screen
                name="ExecuteDoc"
                options={{ headerShown: false, title: "执行单" }}
                initialParams={{ isNew: true, isModify: false, oriWO: undefined }}
                component={ExecuteDoc}
            />
            <BusinessStack.Screen
                name="ExecuteDocList"
                options={{ headerShown: false, title: "执行单列表" }}
                component={ExecuteDocList}
            />
            <BusinessStack.Screen
                name="ExecuteDocReview"
                options={{ headerShown: false, title: "执行单审阅" }}
                component={ExecuteDocReview}
            />
            <BusinessStack.Screen
                name="ExecuteDocReviewList"
                options={{ headerShown: false, title: "执行单审阅列表" }}
                component={ExecuteDocReviewList}
            />
            <BusinessStack.Screen
                name="DisposeDoc"
                options={{ headerShown: false, title: "处理单" }}
                component={DisposeDoc}
            />
            <BusinessStack.Screen
                name="DisposeDocList"
                options={{ headerShown: false, title: "处理单列表" }}
                component={DisposeDocList}
            />
            <BusinessStack.Screen
                name="LookupDocument"
                options={{ headerShown: false, title: "查阅文档" }}
                component={LookupDocument}
            />
            <BusinessStack.Screen
                name="ReciveTraining"
                options={{ headerShown: false, title: "培训查询" }}
                component={ReciveTraining}
            />
            <BusinessStack.Screen
                name="LpaQuery"
                options={{ headerShown: false, title: "劳保发放查询" }}
                component={LpaQuery}
            /> */}
        </BusinessStack.Navigator>
    );
};

export default BusinessNav;