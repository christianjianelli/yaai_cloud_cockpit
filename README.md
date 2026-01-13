# YAAI Cloud Cockpit

**ABAP AI Tools Cloud Cockpit**

The ABAP AI Tools Cloud Cockpit is a frontend tool designed to streamline the creation and management of AI Agents using the ABAP AI Tools Cloud.

![Main View](docs/images/cockpit-main-view-screenshot.jpg)

---

## Features

### LLM APIs

Configure the Base URL of the API, register available LLM models, and set the default LLM model.

**Supported APIs:**
- OpenAI
- Anthropic
- Google Gemini
- Mistral

**Example:** Open AI API Settings

![API View OpenAI](docs/images/cockpit-api-view-openai-screenshot.jpg)

---

### Tools

Configure the tools available in the system. These tools are used by AI Agents to perform tasks via Function Calling (also known as Tool Calling). In ABAP AI Tools Cloud, these tools are instance methods of ABAP classes.

For each tool, you can define:
- **Class name**
- **Method name**
- **Proxy class name** (used when a type cast is necessary)
- **Tool description**

![Tools View](docs/images/cockpit-tools-view-screenshot.jpg)

---

### Documents (RAG)

Upload markdown documents to be used in AI Agents' system instructions or for Retrieval Augmented Generation (RAG), providing context that the LLM model may lack.

For each document, you can set:
- **File name**
- **Description** of the file content
- **Keywords** to help search documents
- **File content** (must be a markdown `.md` file)

![Documents View](docs/images/cockpit-documents-view-screenshot.jpg)

---

### Agents

Set up AI Agents with the following options:
- Assign a markdown document containing system instructions
- Assign a markdown document with information not available in the model's training data (RAG)
- Assign tools for the agent to use
- Set parameters such as LLM API, LLM model, model temperature, etc.

![Agents View](docs/images/cockpit-agents-view-screenshot.jpg)

---

### Chats

Access all information about a chat, including:
- Messages exchanged between the user and the LLM model
- Tools called and their responses
- Sequence Diagram view to visualize message flow and tool usage during task execution
- All logs related to the chat
- Option to resume and continue the conversation from where it stopped

![Chats View](docs/images/cockpit-chats-view-screenshot.jpg)

**Chat Details**

Messages

![Chats View](docs/images/cockpit-chat-view-screenshot-1.jpg)

Messages Sequence Diagram

![Chats View](docs/images/cockpit-chat-view-screenshot-2.jpg)

Chat Log

![Chats View](docs/images/cockpit-chat-view-screenshot-3.jpg)

---

### Logs

Access all logged messages in the system.

![Logs View](docs/images/cockpit-logs-view-screenshot.jpg)

---

### Async Tasks

All chats and tasks executed by AI Agents run as asynchronous processes. In this section, you can view information about these async tasks, such as:
- Task status
- Start date and time
- End date and time

![Async Tasks View](docs/images/cockpit-async-tasks-view-screenshot.jpg)

---






