# 🟧 SYSBOX

### Inspect • Manage • Build

SYSBOX is a full-stack JavaScript application built using **Node.js, Express, React, and Vite**. It gathers and displays system information and selected environment variables and provides CRUD operations on code/text files inside a secure workspace.

Developed for **Thunder Hackathon 3.0 – "Create a Virus in JS"**, SYSBOX is a safe developer utility. It only reads information from the machine it runs on and performs file operations explicitly requested by the user inside a sandboxed directory.

<img width="4964" height="4944" alt="sysbox" src="https://github.com/user-attachments/assets/dabffc9e-f600-4b8c-9a0e-7bc77060fd93" />
---

## ✨ Features

* Display Operating System information
* View CPU architecture, hostname, Node.js version, memory, and uptime
* Show selected environment variables in a structured format
* Create, Read, Update, and Delete files inside a sandboxed workspace
* Support for both console and JSON output
* Interactive React dashboard with Express APIs
* Automatic port recovery if the default port is occupied

---

## 🛠️ Tech Stack

**Frontend:** React + Vite + Tailwind CSS

**Backend:** Node.js + Express

**Communication:** REST APIs (JSON)

**Modules Used:** `os`, `fs`, `path`, `process`

---

## 🏗️ Architecture Flow

```text
                ┌─────────────────┐
                │ Operating System│
                │ (OS, CPU, Env)  │
                └────────┬────────┘
                         │
                         ▼
              ┌───────────────────┐
              │ Node.js Services  │
              │ System • Env • FS │
              └────────┬──────────┘
                       │
                       ▼
              ┌───────────────────┐
              │ Express REST APIs │
              │    /api/* Routes  │
              └────────┬──────────┘
                       │ JSON
                       ▼
              ┌───────────────────┐
              │ React Dashboard   │
              │ System • Files    │
              │ Environment • JSON│
              └───────────────────┘
```

The backend acts as the **single source of truth**, and the frontend only fetches and displays the data.

---

## 📂 Project Structure

```text
SYSBOX
Directory structure:
└── tu-lasizzzz-sysbox/
    ├── README.md
    ├── backend/
    │   ├── package.json
    │   ├── src/
    │   │   ├── index.js
    │   │   ├── config/
    │   │   │   └── constants.js
    │   │   ├── controllers/
    │   │   │   ├── env.controller.js
    │   │   │   ├── files.controller.js
    │   │   │   └── system.controller.js
    │   │   ├── middleware/
    │   │   │   ├── errorHandler.js
    │   │   │   └── validator.js
    │   │   ├── routes/
    │   │   │   ├── env.routes.js
    │   │   │   ├── files.routes.js
    │   │   │   └── system.routes.js
    │   │   ├── services/
    │   │   │   ├── envService.js
    │   │   │   ├── fileService.js
    │   │   │   └── systemInfoService.js
    │   │   └── utils/
    │   │       ├── banner.js
    │   │       ├── formatter.js
    │   │       ├── logger.js
    │   │       └── portManager.js
    │   └── workspace/
    │       ├── create.js
    │       ├── hello.js
    │       └── test.js
    └── frontend/
        ├── index.html
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── vite.config.js
        └── src/
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            ├── components/
            │   ├── CodeEditor.jsx
            │   ├── EnvironmentTable.jsx
            │   ├── FileExplorer.jsx
            │   └── SystemCard.jsx
            ├── pages/
            │   ├── Dashboard.jsx
            │   ├── FilesPage.jsx
            │   └── JsonViewer.jsx
            └── services/
                └── api.js

```

---

## 📋 Information Collected

| Category              | Data                              |
| --------------------- | --------------------------------- |
| Operating System      | Type, Release, Version            |
| CPU                   | Architecture, Model, Core Count   |
| Host                  | Hostname                          |
| Runtime               | Node Version, Platform            |
| Paths                 | Home Directory, Working Directory |
| System Status         | Memory, Uptime                    |
| Environment Variables | Selected allow-listed variables   |

---

## 🌍 Environment Variables Displayed

* PATH *(privacy redacted)*
* HOME / USERPROFILE
* USERNAME / USER
* SHELL / ComSpec
* NODE_ENV

Missing values are displayed as **"Not Available"** or **"Not Set"** instead of causing errors.

---

## ⚙️ Code Flow & Strategy

1. `systemInfoService.js` collects system information using Node's `os` and `process` modules.
2. `envService.js` reads only allow-listed environment variables and hides sensitive values.
3. `fileService.js` performs CRUD operations only inside the `workspace` directory and blocks path traversal attempts.
4. `index.js` starts the server, prints console output, and exposes REST APIs.
5. The React dashboard fetches the same JSON data from the backend and renders it.

---

## 🛡️ Error Handling

| Scenario                     | Behaviour                                        |
| ---------------------------- | ------------------------------------------------ |
| Port already in use          | Automatically switches to another available port |
| Missing environment variable | Displays `Not Available`                         |
| Sensitive PATH variable      | Displays `[Hidden for privacy] (X entries)`      |
| Invalid file path            | Returns `403 Forbidden`                          |
| File not found               | Returns `404 File not found`                     |

---

## 🚀 Run the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 Note

SYSBOX is a **developer utility and system auditor**. It does not modify system files, execute arbitrary code, self-replicate, or communicate with external servers. All file operations are restricted to the `workspace/` directory.
