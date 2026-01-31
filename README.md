# 🏃‍➡️ Fun-Run-UWP
UWP Fun Run is a platform for registering for running events organized by one of the campuses in Surabaya, namely Wijaya Putra University.

---
## 📖 Overview
**Fun Run UWP** is a running event registration platform at Wijaya Putra University, aimed at promoting an active and healthy lifestyle among the community. The event is more than just a casual gathering, but an experience that combines exercise, camaraderie, and a healthy competitive spirit. The project aims to make it easier for local residents and UWP students to register for running events using the platform's built-in features.

---

## ✨ Features
- Input data form for registration event.
- Login admin for survey the participants.
- Payment integration on event registration form.
- Export button to save data in Excel format.

---

## 🛠️ Tech Stack

**Front end**
- HTML/Hyper Text Markup Languange
- CSS/Cascading StyleSheet
- JS/Javascript

**Back end**
- NodeJs
- ExpressJs
- Mysql

**Others**
- Midtrans

---

## 📁 Project Structure
```text
📦Fun Run UWP
 ┣ 📂data
 ┣ 📂public
 ┃ ┣ 📜admin.css
 ┃ ┣ 📜admin.html
 ┃ ┣ 📜admin.js
 ┃ ┣ 📜admin_login.html
 ┃ ┣ 📜index.html
 ┃ ┗ 📜style.css
 ┣ 📜.env
 ┣ 📜.env.example
 ┣ 📜.gitignore
 ┣ 📜README.md
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜server.js
```

---

## ⚙️ Installation & 📐 Setup
1. Clone repository

1.1 Clone repository with ssh method
```bash
git clone git@github.com:fauzan18296/Fun-Run-UWP.git
```

1.2 Clone repository with web url method

```bash
git clone https://github.com/fauzan18296/Fun-Run-UWP.git
```

2. Install dependecies
```bash
npm install
```
📍If you run `npm install`, it will create a directory named `node_modules/`

3. Setup environment  

```bash
cp .env.example .env
```

>📓 **Note:** You need setup **env(environment)** for configure applications by securely storing, environment, and sensitive information.

4. Run project
```bash
npm start
```
📍This will run the back-end project in the **Fun-Run-UWP** directory.

---

## 🔐 Configuration
This is very important because **configuration** relates to **env(environment)**, this **configuration** contains among others:
- **PORT**
- **USERNAME DATABASE**
- **HOSTNAME DATABASE**
- **PASSWORD DATABASE**
- **DATABASE NAME**
- etc.
Example:

```
PORT=4000
```


