sap.ui.define([
    "aaic/cockpit/controller/BaseController",
    "sap/ui/core/UIComponent",
    "sap/m/Dialog",
	"sap/m/Button",
    "sap/m/Text",
    "sap/m/IllustratedMessage",
    "sap/m/IllustratedMessageType",
    "sap/ui/core/Messaging",
    "sap/ui/core/message/Message",
	"sap/ui/core/message/MessageType",
    "sap/m/MessageBox",
], (BaseController, UIComponent, Dialog, Button, Text, IllustratedMessage, IllustratedMessageType, Messaging, Message, MessageType, MessageBox) => {
    "use strict";

    return BaseController.extend("aaic.cockpit.controller.Tools", {
        
        onInit() {
        
            const ownerComponent = this.getOwnerComponent();

            const router = ownerComponent.getRouter();

            router.getRoute("RouteTools").attachPatternMatched(this.onRouteMatched, this);
        
        },

        onRouteMatched: function (event) {

            const ownerComponent = this.getOwnerComponent();

            ownerComponent.setOnHoldNavigation();

            const sideNavigation = ownerComponent.getSideNavigation();

            if (sideNavigation) {
                sideNavigation.setSelectedKey("tools");
            }
           
            Messaging.removeAllMessages();

            this.onSearch()

        },

        onAfterRendering: function (event) {

            const view = this.getView();

            this.setMessagePopover(view);

            const table = view.byId("_IDToolsTable");

            const illustratedMessage = new IllustratedMessage();

            illustratedMessage.setIllustrationType(IllustratedMessageType.NoData);
            illustratedMessage.setIllustrationSize(sap.m.IllustratedMessageSize.Medium);

            table.setNoData(illustratedMessage);

        },

        onItemPress: function (event) {
                
            const className = event.getSource().getBindingContext("tools").getProperty("className");
            const methodName = event.getSource().getBindingContext("tools").getProperty("methodName");
         
            const router = UIComponent.getRouterFor(this);
            
            router.navTo("RouteTool", { className: className, methodName: methodName });
            
        },

        onSearch: function () {

            const view = this.getView();

            const className = view.byId("_IDToolsClassNameFilter").getValue();
            const methodName = view.byId("_IDToolsMethodNameFilter").getValue();
            const description = view.byId("_IDToolsDescriptionFilter").getValue();
                        
            this._loadData(className, methodName, description);

        },

        onAdd: function (event) {
            
            this.onOpenDialog();   

        },

        onDelete: function (event) {

            const view = this.getView();

            const table = view.byId("_IDToolsTable");

            const selectedItems = table.getSelectedItems();

            const resourceBundle = view.getModel("i18n").getResourceBundle();

            const selectedTools = [];

            if (selectedItems.length > 0) {

                selectedItems.forEach(element => {
                    selectedTools.push({ 
                        className: element.getBindingContext("tools").getProperty("className"),
                        methodName: element.getBindingContext("tools").getProperty("methodName")
                    });
                });

                if (table) {
                    table.removeSelections();
                }
                
                if (!this._confirmDialog) {
                    
                    this._confirmDialog = new Dialog({
                        id: "_IDToolsConfirmDialogDelete",
                        type: "Message",
                        title: resourceBundle.getText("confirm"),
                        content: new Text({ text: resourceBundle.getText("confirmDeleteTools") }),
                        beginButton: new Button({
                            type: "Emphasized",
                            text: resourceBundle.getText("yes"),
                            press: function () {              
                                this._confirmDialog.setBusy(true);              
                                this._deleteTools(selectedTools, view);
                                this._confirmDialog.setBusy(false);
                                this._confirmDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: resourceBundle.getText("cancel"),
                            press: function () {
                                this._confirmDialog.close();
                            }.bind(this)
                        })
                    });
                }

                this._confirmDialog.open();

            }

        },

        onOpenDialog: async function () {

			// Create dialog lazily
			this.Dialog ??= await this.loadFragment({
				name: "aaic.cockpit.fragment.AddTool",
                controller: this
			});

			this.Dialog.open();
		},

        onCloseDialog: function(event) {            
            
            this.Dialog.close();
        
        },

        onAddTool: async function (event) {

            const view = this.getView();

            this.Dialog.setBusy(true);

            const tool = {
                class_name: view.byId("_IDAddToolInputClassName").getValue(),
                method_name: view.byId("_IDAddToolInputMethodName").getValue(),
                proxy_class: view.byId("_IDAddToolInputProxyClass").getValue(),
                description: view.byId("_IDAddToolInputDescription").getValue()
            };

            if ( tool.class_name === "" || tool.method_name === "" || tool.description === "") {

                MessageBox.alert("Fill all required fields!");

                return;
            }

            const formData = new FormData();
            
            // Fill form data
            Object.keys(tool).forEach(key => {
                formData.append(key, tool[key]);
            });
            
            const endpoint = this.getEndpoint('llm_tool');

            try {

                // 1. Await the fetch call. This pauses execution until the response is received.
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData
                });
                 
                if (!response.ok) {
                    // Throw an error to be caught by the catch block
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // 2. Await the response.json() call to parse the body.
                const responseData = await response.json();

                // 3. Handle the successful data

                // Reset fields
                view.byId("_IDAddToolInputClassName").setValue("");
                view.byId("_IDAddToolInputMethodName").setValue("");
                view.byId("_IDAddToolInputProxyClass").setValue("");
                view.byId("_IDAddToolInputDescription").setValue("");

                this.onSearch();

            } catch (error) {

                // 4. Handle any errors during the fetch or parsing process

                this.Dialog.setBusy(false);

                MessageBox.error(error.message);

                const resourceBundle = view.getModel("i18n").getResourceBundle();

                const message = new Message({
                    message: error.message,
                    description: resourceBundle.getText("communicationError"),
                    type: MessageType.Error
                });
                
                Messaging.addMessages(message);

            }

            this.Dialog.setBusy(false);

            this.Dialog.close();

        },

        //################ Private APIs ###################

        _loadData: async function(className = "", methodName = "", description = "") {

            const view = this.getView();

            view.setBusy(true);
         
            let model = view.getModel("tools");

            const endpoint = this.getEndpoint('llm_tool');
          
            try {
                
                const modelData = await this.fetchData(endpoint + "&class_name=" + className + "&method_name=" + methodName + "&description=" + description);

                model.setModelData(modelData);

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

        },

        _deleteTools: async function(selectedTools, view) {

            view.setBusy(true);
         
            const model = view.getModel("tools");
            
            const modelData = model.getData();

            for (const selectedTool of selectedTools) {
                
                const endpoint = this.getEndpoint('llm_tool') + '&class_name=' + selectedTool.className + '&method_name=' + selectedTool.methodName;

                try {

                    // 1. Await the fetch call. This pauses execution until the response is received.
                    const response = await fetch(endpoint, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        // Throw an error to be caught by the catch block
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // 2. Await the response.json() call to parse the body.
                    const responseData = await response.json();
                    
                    // 3. Handle the successful data
                    if ( responseData.error === "" ) {
                        //console.log('Tool deleted successfully!', responseData);
                    } else {
                        throw new Error(`Delete failed! error: ${responseData.error}`);
                    }
                                         
                } catch (error) {

                    view.setBusy(false);

                    // 4. Handle any errors during the fetch or parsing process
                    MessageBox.error(error.message);

                    const resourceBundle = view.getModel("i18n").getResourceBundle();

                    const message = new Message({
                        message: error.message,
                        description: resourceBundle.getText("communicationError"),
                        type: MessageType.Error
                    });
                    
                    Messaging.addMessages(message);
                    
                    // Exit the for...in
                    break;
                }

                // Remove deleted tool from the local JSON Model
                const tools = modelData.tools.filter((tool) => tool.className !== selectedTool.className && tool.methodName !== selectedTool.methodName );

                modelData.tools = tools;

            };

            model.setModelData(modelData);

            const table = view.byId("_IDToolsTable");

            if (table) {
                table.removeSelections();
            }

            view.setBusy(false);
        
        }
    });
});