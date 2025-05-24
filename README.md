# 🌍 WanderLust - Travel Listing Platform
Wanderlust is a travel exploration platform designed to help users discover exciting destinations and plan personalized itineraries. It provides essential travel information, user-friendly planning tools, and an interactive community for sharing experiences. Whether you're a solo traveler or planning a group trip, Wanderlust makes travel planning seamless and enjoyable.
WanderLust is a full-stack travel listing web application built using **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to view, create, and edit listings with proper validation and error handling.


---

## ⚙️ Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** with **Mongoose** – Database and ORM
- **EJS** – Templating engine
- **ejs-mate** – Layout support for EJS
- **Bootstrap** – Styling (via CDN)
- **Custom Middleware** – For error handling and async wrappers

---

## 📁 Project Setup


### 1. 📦 Clone the Repository

git clone https://github.com/123anamika09/WanderLust.git
cd WanderLust


### 2. 🧱 Initialize Project
npm init -y

### 3. 📥 Install Dependencies
npm install express mongoose ejs ejs-mate

### 4.🛠 Running the Project
 nodemon app.js

### 5. open this url
http://localhost:8080

```bash
### 4. 🗃️ Project Structure Overview
WanderLust/
├── init/ # Database seeding & initialization
│ ├── data.js
│ └── index.js
│
├── modals/ # Mongoose schemas
│ └── listing.js
│
├── public/ # Static files
│ ├── css/
│ └── js/
│
├── utils/ # Reusable utilities
│ ├── ExpressError.js
│ └── wrapAsync.js
│
├── views/ # EJS templates
│ ├── includes/ # Navbar & footer partials
│ ├── layouts/ # Layout with boilerplate
│ ├── listings/ # Views for listings (CRUD)
│ └── error.ejs
│
├── .gitignore
├── app.js # Main app file
├── schema.js # Joi schemas
├── package.json
├── package-lock.json
└── README.md



✍️ Git Commands Summary (for contribution)

git status
git add .
git commit -m "Meaningful message"
git pull origin main --rebase
git push origin main
