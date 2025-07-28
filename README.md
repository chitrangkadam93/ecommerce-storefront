# Ecommerce Storefront

A full-stack e-commerce application built with Django REST Framework backend and React.js frontend

## Tech Stack

**Backend:**
- Django + Django REST Framework
- PostgreSQL
- JWT Authentication (simplejwt)

**Frontend:**
- React.js

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL

## Setup Instructions

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers psycopg2-binary djangorestframework-simplejwt stripe python-decouple pillow sendgrid

# Create database
createdb ecommerce

# Configure environment
cp .env

# Run migrations
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```env
# Django Settings
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DATABASE_URL=postgres://ecommerce_user:yourpassword@localhost:5432/ecommerce_store

SLACK_BOT_TOKEN=your_slack_bot_token_here
SLACK_CHANNEL_ID=your_slack_channel_id_here

# Email Configuration (for order confirmations)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend  # For development
DEFAULT_FROM_EMAIL=noreply@yourecommerce.com

FRONTEND_URL=http://localhost:3000

REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### Frontend (.env.local)
```env
REACT_APP_PAYPAL_CLIENT_ID =your_key
```

## Project Structure

```
ecommerce-storefront/
├── backend/
│   ├── backend/
│   ├── media/
│   ├── store/          
│   ├── orders/         
│   └── users/          
└── frontend/
    ├── src/
    │   ├── context/        
    │   ├── components/ 
    │   ├── hooks/      
    │   ├── services/        
    │   └── utils/   
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/token/` 
- `POST /api/register/` 
- `POST /api//token/refresh/` 

### Products
- `GET /api/products/` - List products (with search & pagination)
- `GET /api/products/{id}/` - Product details

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/{id}/` - Update cart item

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/create/` - Create new order with payment

## Features

- User authentication (login/register)
- Shopping cart management
- Secure checkout with PayPal
- Order history and tracking
- Responsive design
- Email notifications
- JWT token authentication

## Running the Application

1. Start the Django backend server: `python manage.py runserver`
2. Start the Next.js frontend server: `npm run dev`
3. Access the application at `http://localhost:3000`
4. Admin panel available at `http://localhost:8000/admin`

## Development Notes

- Frontend uses ReactJS
- API calls include JWT token authentication
- Error handling and loading states implemented
