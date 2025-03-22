# Dapper Wear - E-commerce Recommendation System

A full-stack e-commerce platform with AI-powered product recommendations, image search, and sentiment analysis.

## 🌟 Features

### Customer Features
- **Product Search & Discovery**
  - Text-based search
  - Image-based search (find similar products)
  - Category-based browsing
  - Brand-based filtering

- **Personalization**
  - AI-powered product recommendations
  - Personalized shopping experience
  - Favorite products
  - Shopping cart

- **User Experience**
  - Responsive design
  - Real-time updates
  - User authentication
  - Order tracking

### Seller Features
- **Dashboard**
  - Sales analytics
  - Market insights
  - Product management
  - Order management

- **Analytics**
  - Sales trends
  - Category performance
  - Customer insights
  - Market news integration

## 🏗️ Project Structure

```
Dapper Wear/
├── dapperweb/           # Customer-facing web application
│   ├── components/     # Reusable UI components
│   ├── pages/         # Next.js pages
│   └── styles/        # CSS modules
├── dappersales/        # Seller dashboard
│   ├── components/    # Dashboard components
│   ├── pages/        # Dashboard pages
│   └── styles/       # Dashboard styles
├── api.dripy.com/     # Backend API
│   └── app.py        # Flask API server
├── model.ml/         # Machine Learning models
│   ├── sentiment_analysis.py
│   └── Dripy_Sales.ipynb
├── datasets/         # Training and test data
└── imgs/            # Image assets
```

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- Chart.js
- Firebase Authentication
- CSS Modules

### Backend
- Flask
- TensorFlow
- ResNet50
- scikit-learn
- Firebase

### Machine Learning
- Sentiment Analysis
- Image Recognition
- Product Recommendation System

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Firebase account
- News API key

## 🔧 API Endpoints

### Product Search
- `GET /recommend` - Get product recommendations
- `GET /image_search` - Search products by image
- `GET /search` - Text-based product search

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout


## 🤖 Machine Learning Features

### Image Recognition
- Uses ResNet50 for feature extraction
- Implements nearest neighbors for similarity search
- Supports product image matching

### Recommendation System
- Collaborative filtering
- Content-based filtering
- Hybrid recommendation approach

## 📊 Analytics Dashboard

### Features
- Sales trends visualization
- Category performance metrics
- Customer behavior analysis
- Market news integration
- Real-time updates

## 🔒 Security

- Firebase Authentication
- Secure API endpoints
- Data encryption
- Input validation
- XSS protection


## 🙏 Acknowledgments

- Firebase for authentication and database
- News API for market insights
- TensorFlow for ML models
- Next.js team for the amazing framework 