# Smart Agriculture Management System (SAMS) - Backend

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

## 🌱 Overview

The SAMS backend is a robust server-side application built with Node.js and Express, providing a secure and scalable API for the Smart Agriculture Management System. It handles data processing, authentication, and integration with various agricultural services.

## ✨ Features

### 🚀 Core Functionalities
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password handling
  - Session management

- **Data Management**
  - MongoDB database integration
  - Efficient data modeling
  - Data validation and sanitization
  - Real-time data updates

- **API Endpoints**
  - RESTful API design
  - Comprehensive documentation
  - Rate limiting
  - Error handling

- **Integration Services**
  - Weather API integration
  - Irrigation system control
  - Crop recommendation engine
  - Disease detection system

### 🔒 Security Features
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secure password hashing
- JWT token management
- API key protection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: Express Validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Logging**: Winston

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/sams.git
cd sams/backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── validators/      # Input validation
├── tests/               # Test files
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## 🔑 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sams
JWT_SECRET=your_jwt_secret
WEATHER_API_KEY=your_weather_api_key
```

## 📚 API Documentation

The API documentation is available at `/api-docs` when running the server. It includes:
- Authentication endpoints
- User management
- Weather data
- Irrigation control
- Crop recommendations
- Disease detection

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## 🔍 Code Quality

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- Jest for testing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Department of Agriculture, Sri Lanka
- Open-source community
- Contributors and maintainers

---

<div align="center">
  <p>Made with ❤️ for sustainable agriculture</p>
  <p>© 2024 Smart Agriculture Management System</p>
</div> 