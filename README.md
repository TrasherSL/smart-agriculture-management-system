# Smart Agriculture Management System (SAMS)

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

## 🌱 Overview

SAMS is a comprehensive agricultural management platform designed to modernize farming practices through smart technology. The system combines real-time weather data, crop recommendations, irrigation management, and disease detection to help farmers make informed decisions and optimize their agricultural operations.

## ✨ Key Features

### 🌾 Agricultural Management
- **Smart Irrigation**
  - Automated scheduling based on weather data
  - Water usage optimization
  - Regional weather integration
  - Real-time monitoring

- **Crop Management**
  - Crop recommendation engine
  - Growth tracking
  - Disease detection
  - Pest management

- **Weather Integration**
  - Real-time weather updates
  - Weather forecasting
  - Climate analysis
  - Weather alerts

### 👥 User Features
- **Role-based Access**
  - Farmer dashboard
  - Agricultural expert portal
  - Administrator controls
  - Custom permissions

- **Knowledge Base**
  - Agricultural best practices
  - Expert articles
  - Interactive guides
  - Community support

## 🏗️ System Architecture

```
SAMS/
├── frontend/            # React-based user interface
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── contexts/    # React contexts
│   │   ├── auth/        # Authentication
│   │   └── ...
│   └── public/          # Static assets
│
├── backend/             # Node.js/Express server
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── ...
│   └── tests/           # Test files
│
└── docs/                # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/sams.git
cd sams
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Configure environment variables:
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📚 Documentation

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [API Documentation](http://localhost:5000/api-docs)

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secure password hashing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Department of Agriculture, Sri Lanka
- Agricultural experts and contributors
- Open-source community
- Farmers and agricultural professionals

---

<div align="center">
  <p>Made for sustainable agriculture</p>
  <p>© 2024 Smart Agriculture Management System</p>
</div> #   s m a r t - a g r i c u l t u r e - m a n a g e m e n t - s y s t e m -  
 