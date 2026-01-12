sap.ui.define(
  [
    "aaic/cockpit/controller/BaseController",
    "aaic/cockpit/controller/Chat",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Messaging",
    "sap/ui/core/message/Message",
	  "sap/ui/core/message/MessageType",
    "sap/m/MessageBox"
  ], (BaseController, Chat, UIComponent, Messaging, Message, MessageType, MessageBox) => {
    "use strict";

    return BaseController.extend("aaic.cockpit.controller.App", {

      _remainingTextTemplate: "",

      onInit() {

        const view = this.getView();

        const sidePanel = view.byId("_IDAppSidePanel");

        const sideNavigation = view.byId("_IDAppSideNavigation");

        const ownerComponent = this.getOwnerComponent();

        ownerComponent.setSideNavigation(sideNavigation);

        Chat.setSidePanel(sidePanel);
      },

      onAfterRenderingHTMLControl: function (event) {

        Chat.addWelcomeMessage();

        const view = this.getView();

        const resourceBundle = view.getModel("i18n").getResourceBundle();

        this._remainingTextTemplate = resourceBundle.getText("remainingTextTemplate");

        const selectApi = view.byId("_IDAppSelectApi");

        if (selectApi) {
          selectApi.setSelectedKey(Chat.api);
        }

        const textApiKey = view.byId("_IDAppTextApiKey");

        if (textApiKey) {
          textApiKey.setValue(Chat.apiKey);
        }

        const textAgentId = view.byId("_IDAppTextAgentId");

        if (textAgentId) {
          textAgentId.setValue(Chat.agentId);
        }

      },

      onSidePanelToggle: function (event) {

        this._loadApis();

        Chat.resumeChat();

      },

      onSideNavButtonPress: function () {

        const toolPage = this.byId("_IDAppToolPage");

        const sideExpanded = toolPage.getSideExpanded();

        toolPage.setSideExpanded(!sideExpanded);

      },

      onItemSelect: function (event) {

        const resourceBundle = this.getView().getModel("i18n").getResourceBundle();

        const router = UIComponent.getRouterFor(this);

        const ownerComponent = this.getOwnerComponent();

        switch (event.getSource().getSelectedKey()) {

          case "home":
            ownerComponent.setOnHoldNavigation("RouteMain");
            break;

          case "apis":
            ownerComponent.setOnHoldNavigation();
            break;

          case "openai-api":
            ownerComponent.setOnHoldNavigation("RouteApi", { id: "OPENAI" });
            break;

          case "anthropic-api":
            ownerComponent.setOnHoldNavigation("RouteApi", { id: "ANTHROPIC" });
            break;

          case "google-api":
            ownerComponent.setOnHoldNavigation("RouteApi", { id: "GOOGLE" });
            break;

          case "mistral-api":
            ownerComponent.setOnHoldNavigation("RouteApi", { id: "MISTRAL" });
            break;

          case "agents":
            ownerComponent.setOnHoldNavigation("RouteAgents");
            break;

          case "tools":
            ownerComponent.setOnHoldNavigation("RouteTools");
            break;

          case "documents":
            ownerComponent.setOnHoldNavigation("RouteDocuments");
            break;

          case "chats":
            ownerComponent.setOnHoldNavigation("RouteChats");
            break;

          case "logs":
            ownerComponent.setOnHoldNavigation("RouteLogs");
            break;

          case "async-tasks":
            ownerComponent.setOnHoldNavigation("RouteAsyncTasks");
            break;

          default:
            break;
        }
        
        const preventDataLoss = ownerComponent.preventDataLoss();

        if (preventDataLoss === true) {
          return;
        } else {

          const onHoldNavigation = ownerComponent.getOnHoldNavigation();

          if (onHoldNavigation.route === "") {
            //MessageToast.show(resourceBundle.getText("noNavigationtarget"));
            return;
          } 

          router.navTo(onHoldNavigation.route, onHoldNavigation.params);

        }
      },

      onSend: async function (event) {

        const view = this.getView();

        const textArea = view.byId("_IDAppTextAreaUserPrompt");

        const userPrompt = textArea.getValue();

        if (userPrompt === "") {
          return;
        }

        const selectApi = view.byId("_IDAppSelectApi");

        const api = selectApi.getSelectedKey();

        if (api === "") {
          return;
        }

        const textApiKey = view.byId("_IDAppTextApiKey");

        const apiKey = textApiKey.getValue();

        if (apiKey === "") {
          return;
        }

        const textAgentId = view.byId("_IDAppTextAgentId");

        const agentId = textAgentId.getValue();

        await new Promise(resolve => setTimeout(resolve, 300));

        const button = view.byId("_IDAppButtonSend");

        button.setEnabled(false);

        textArea.setValue("");

        // Send User Prompt
        //Chat.sendUserPrompt(userPrompt, api, apiKey);
        await Chat.sendUserPromptAsync(userPrompt, api, apiKey, agentId);

        button.setEnabled(true);
        
      },

      onRefresh: async function (event) {

        if (Chat.chatId === "") {
          return;
        }

        const responseData = await this._loadChatMessages();

        if (!responseData.chat) {
          return;
        }

        Chat.clear();

        Chat.addWelcomeMessage();

        responseData.chat.messages.forEach(message => {

          const msg = JSON.parse(message.msg);

          if (msg.role === 'user') {

            Chat.addUserMessage(msg.content, message.seqno);

          } else if (msg.role === 'assistant') {

            const content = JSON.parse(msg.content);

            content.forEach(element => {

              if (element.type = 'text') {
                Chat.addLlmMessage(element.text, message.seqno);
              }

            });

          }

        });

      },

      onClear: function (event) {

        const view = this.getView();

        const textArea = view.byId("_IDAppTextAreaUserPrompt");

        textArea.setValue("");

        textArea.fireLiveChange();

      },

      onNewChat: function (event) {

        this.onClear(event);

        Chat.clear();

        const view = this.getView();

        const button = view.byId("_IDAppButtonSend");

        button.setEnabled(true);

      },

      onSelectApiChange: function (event) {

        const select = event.getSource();

        Chat.api = select.getSelectedKey();

      },

      onTextApiKeyChange: function (event) {

        const text = event.getSource();

        Chat.apiKey = text.getValue();

      },

      onTextAgentIdChange: function (event) {

        const text = event.getSource();

        Chat.agentId = text.getValue();

      },

      onUserPromptLiveChange: function (event) {

        const textArea = event.getSource();

        const maxLength = textArea.getMaxLength();

        const userPrompt = textArea.getValue();

        const view = this.getView();

        const remainingLength = maxLength - userPrompt.length;

        const remainingLengthText = view.byId("_IDAppTextUserPromptRemainingLength");

        //remainingLengthText.setText( remainingLength + ' of ' + maxLength + ' remaining' );

        remainingLengthText.setText(this._remainingTextTemplate.replace("&1", remainingLength.toString()).replace("&2", maxLength.toString()));

      },

      //################ Private APIs ###################

      _loadApis: async function () {

        const view = this.getView();

        const sidePanel = view.byId("_IDAppVerticalLayoutChat");

        sidePanel.setBusy(true);

        let model = view.getModel("apis");

        try {

          const endpoint = this.getEndpoint('llm_api');

          const modelData = await this.fetchData(endpoint);

          model.setModelData(modelData);

          sidePanel.setBusy(false);

        } catch (error) {

          sidePanel.setBusy(false);

          MessageBox.error(error.message);

          const message = new Message({
              message: error.message,
              description: resourceBundle.getText("communicationError"),
              type: MessageType.Error
          });
          
          Messaging.addMessages(message);
          
        }

      },

      _loadChatMessages: async function () {

        const view = this.getView();

        let model = view.getModel("chat");

        const endpoint = this.getEndpoint("chat");

        try {
        
          const modelData = await this.fetchData(endpoint + "&id=" + Chat.chatId);

          model.setData(modelData);

          return modelData;

        } catch (error) {

          MessageBox.error(error.message);

          const message = new Message({
              message: error.message,
              description: resourceBundle.getText("communicationError"),
              type: MessageType.Error
          });
          
          Messaging.addMessages(message);

          return false;
          
        }

      }
    });
  });