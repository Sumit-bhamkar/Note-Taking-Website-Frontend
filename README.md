# 📒 Note Taking App – Frontend

Frontend application for the Note Taking App built using:

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 📝 React Hook Form
* 🔁 Context API
* 🌐 Axios
* 🔀 React Router DOM

---

## 🚀 Features

* ✅ Create Note
* ✅ View All Notes
* ✅ Update Note
* ✅ Delete Note
* ✅ Form Validation (React Hook Form)
* ✅ Backend Validation Handling (Zod Errors)
* ✅ Responsive UI (Tailwind CSS)
* ✅ Loading States

---

## 📂 Project Structure

```
frontend
├── src
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Notecard.jsx
│   │   └── Noteform.jsx
│   │
│   ├── pages
│   │   ├── Home.jsx
│   │   └── Createnote.jsx
│   │
│   ├── context
│   │   └── NoteContext.jsx
│   │
│   ├── api
│   │   └── url.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd frontend
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variable

Create `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000
```

⚠️ For production, replace with your deployed backend URL.

---

## ▶️ Run Development Server

```bash
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

## 🔌 API Integration

All API calls are managed using Axios inside:

```
src/api/url.js
```

Example:

```js
const BACKEND_URL = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
```

---

## 📝 Form Validation

Frontend validation handled using **React Hook Form**.

Example:

```js
register("title", {
  required: "Title is required",
});
```

Backend validation errors (Zod) are mapped into form fields automatically.

---

## 🎨 Styling

Styled using **Tailwind CSS**.

Tailwind directives inside:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🌍 Deployment

Recommended deployment:

| Layer    | Platform          |
| -------- | ----------------- |
| Frontend | Vercel            |
| Backend  | Render / Railway  |
| Database | Neon (PostgreSQL) |

---

## 🧠 Future Improvements

* 🔐 Authentication (Login/Register)
* 🔍 Search Notes
* 📄 Pagination
* 🌓 Dark/Light Mode Toggle
* 🔔 Toast Notifications
* 📱 Better Mobile UI

## 👩‍💻 Author

Sumit



