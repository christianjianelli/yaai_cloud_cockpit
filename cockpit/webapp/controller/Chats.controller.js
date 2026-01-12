sap.ui.define([
    "aaic/cockpit/controller/BaseController",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Messaging",
    "sap/m/IllustratedMessage",
    "sap/m/IllustratedMessageType",
    "sap/ui/core/message/Message",
    "sap/ui/core/message/MessageType",
    "sap/m/MessageBox"
], (BaseController, UIComponent, Messaging, IllustratedMessage, IllustratedMessageType, Message, MessageType, MessageBox) => {
    "use strict";

    return BaseController.extend("aaic.cockpit.controller.Chats", {

        _dateFrom:"",
        
        _dateTo: "",

        onInit() {

            const ownerComponent = this.getOwnerComponent();

            const router = ownerComponent.getRouter();

            router.getRoute("RouteChats").attachPatternMatched(this.onRouteMatched, this);

            let view = this.getView();

            let dynamicDateRange = view.byId("_IDChatsFilterDynamicDateRange");
            
            let today = {
                "operator": "TODAY",
                "values": []
            };

            dynamicDateRange.setValue(today);

            this._dateFrom = this._formatDateYYYYMMDD(new Date());
            this._dateTo = this._formatDateYYYYMMDD(new Date());

        },

        onRouteMatched: function (event) {

            const ownerComponent = this.getOwnerComponent();

            ownerComponent.setOnHoldNavigation();

            const sideNavigation = ownerComponent.getSideNavigation();

            if (sideNavigation) {
                sideNavigation.setSelectedKey("chats");
            }

            Messaging.removeAllMessages();

        },

        onAfterRendering: function (event) {

            const view = this.getView();

            this.setMessagePopover(view);

            const table = view.byId("_IDChatsTable");

            const illustratedMessage = new IllustratedMessage();

            illustratedMessage.setIllustrationType(IllustratedMessageType.NoData);
            illustratedMessage.setIllustrationSize(sap.m.IllustratedMessageSize.Medium);

            table.setNoData(illustratedMessage);

        },

        onItemPress: function (event) {

            const id = event.getSource().getBindingContext("chats").getProperty("id");

            const router = UIComponent.getRouterFor(this);

            router.navTo("RouteChat", { id: id });

        },

        onDateFilterChange: function (event) {
            
            this._dateFrom = "";
            this._dateTo = "";

            if ( event.getParameter("value") !== undefined ) {
                
                let dates = event.getSource().toDates(event.getParameter("value"));
                
                this._dateFrom = this._formatDateYYYYMMDD(dates[0]);
                
                this._dateTo = this._formatDateYYYYMMDD(dates[1]);
            }

        },

        onSearch: function (event) {
            
            const view = this.getView();

            const usernameInput = view.byId("_IDChatsUserNameFilter");

            let username;

            if (usernameInput) {
               username = usernameInput.getValue();
            }

            this._loadData(username);
          
        },

        //################ Private APIs ###################

        _loadData: async function(username = "") {

            const view = this.getView();

            view.setBusy(true);
         
            const model = view.getModel("chats");

            model.setData({chats: []});
            
            const endpoint = this.getEndpoint('chat');

            try {
          
                const responseData = await this.fetchData(endpoint + "&datefrom=" + this._dateFrom + "&dateto=" + this._dateTo + "&username=" + username);

                model.setData(responseData);

                view.setBusy(false);

            } catch (error) {

                view.setBusy(false);

                MessageBox.error(error.message);

                const resourceBundle = view.getModel("i18n").getResourceBundle();

                const message = new Message({
                    message: error.message,
                    description: resourceBundle.getText("communicationError"),
                    type: MessageType.Error
                });
                
                Messaging.addMessages(message);

            }

        }
    });
});