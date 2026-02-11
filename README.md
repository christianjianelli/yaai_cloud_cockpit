# ABAP AI tools Cloud Cockpit

The ABAP AI tools Cloud Cockpit is a frontend tool designed to streamline the creation and management of AI Agents using the ABAP AI tools Cloud.

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-main-view-screenshot.jpg" alt="Main View" width="600px">
</p>

---

## Main Features

### LLM APIs

Configure the Base URL of the API, register available LLM models, and set the default LLM model.

**Supported APIs:**
- OpenAI
- Anthropic
- Google Gemini
- Mistral

**Example:** Open AI API Settings

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-api-view-openai-screenshot.jpg" alt="API View OpenAI" width="600px">
</p>

---

### Tools

Configure the tools available in the system. These tools are used by AI Agents to perform tasks via Function Calling (also known as Tool Calling). In ABAP AI tools Cloud, these tools are instance methods of ABAP classes.

For each tool, you can define:
- **Class name**
- **Method name**
- **Proxy class name** (used when a type cast is necessary)
- **Tool description**

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-tools-view-screenshot.jpg" alt="Tools View" width="600px">
</p>

---

### Documents (RAG)

Upload markdown documents to be used in AI Agents' system instructions or for Retrieval Augmented Generation (RAG), providing context that the LLM model may lack.

For each document, you can set:
- **File name**
- **Description** of the file content
- **Keywords** to help search documents
- **File content** (must be a markdown `.md` file)

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-documents-view-screenshot.jpg" alt="Documents View" width="600px">
</p>

---

### Agents

Set up AI Agents with the following options:
- Assign a markdown document containing system instructions
- Assign a markdown document with information not available in the model's training data (RAG)
- Assign tools for the agent to use
- Set parameters such as LLM API, LLM model, model temperature, etc.

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-agents-view-screenshot.jpg" alt="Agents View" width="600px">
</p>

---

### Chats

Access all information about a chat, including:
- Messages exchanged between the user and the LLM model
- Tools called and their responses
- Sequence Diagram view to visualize message flow and tool usage during task execution
- All logs related to the chat
- Option to resume and continue the conversation from where it stopped

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-chats-view-screenshot.jpg" alt="Chats View" width="600px">
</p>

**Chat Details**

Messages

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-chat-view-screenshot-1.jpg" alt="Chat Messages" width="500px">
</p>

Messages Sequence Diagram

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-chat-view-screenshot-2.jpg" alt="Chat Messages Sequence Diagram" width="500px">
</p>

Chat Log

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-chat-view-screenshot-3.jpg" alt="Chat Log Messages" width="500px">
</p>

---

### Logs

Access all logged messages in the system.

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-logs-view-screenshot.jpg" alt="Logs View" width="600px">
</p>

---

### Async Tasks

All chats and tasks executed by AI Agents run as asynchronous processes. In this section, you can view information about these async tasks, such as:
- Task status
- Start date and time
- End date and time

<p style="margin-left: 50px">
   <img src="docs/images/cockpit-async-tasks-view-screenshot.jpg" alt="Async Tasks View" width="600px">
</p>

---

## Installation

### Prerequisites

The ABAP Cloud system must have the following packages installed:

 - **[ABAP AI tools Cloud](https://github.com/christianjianelli/yaai_cloud)**
 - **[ABAP AI tools Cloud REST API](https://github.com/christianjianelli/yaai_cloud_rest)**

### Installation Steps

 1 - Clone the [ABAP AI tools Cloud repository](https://github.com/christianjianelli/yaai_cloud_cockpit) in your Business Application Studio development environment. 

   This tutorial explains how to do it: https://developers.sap.com/tutorials/build-code-simple-git..html
 
 2 - Adjust the backend URL and the destination name in the `ui5-local.yaml` and `ui5.yaml` files.

   <p style="margin-left: 50px">
      <img src="docs/images/yaml.png" alt="ABAP Backend URL" width="500px">
   </p>

   To find the backend URL go to the Subaccount: trial -> Instances and Subscriptions.

   <p style="margin-left: 50px">
      <img src="docs/images/instances.png" alt="ABAP Backend URL" width="500px">
   </p>
   
   <p style="margin-left: 50px">
      <img src="docs/images/backend-URL.png" alt="Adjust .yaml files" width="500px">
   </p>

   To find the destination name go to Subaccount: trial - Destinations. 

   <p style="margin-left: 50px">
      <img src="docs/images/destination.png" alt="Destination Name" width="500px">
   </p>
 
 3 - Deploy the Application. See the Business Application Documentation: https://help.sap.com/docs/bas/developing-sap-fiori-app-in-sap-business-application-studio/deploying-application?locale=en-US
