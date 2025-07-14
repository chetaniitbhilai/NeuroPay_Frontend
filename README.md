
# 🧠 NeuroPay (Walmart Sparkathon)

NeuroPay is a secure mobile payment application that leverages behavioral biometrics (sensor data) and advanced fraud analytics to authenticate transactions. It integrates UPI and Stripe payment methods, offering both real-time fraud detection and seamless user experience.

## 📁 Project Structure

```
.
├── assets/                     # App assets (images, fonts, etc.)
├── components/                # Reusable UI components
│   ├── FraudAlert.js
│   ├── ProductCard.js
│   └── SensorLogger.js        # Logs accelerometer, gyroscope, magnetometer data
├── context/                   # Global React Context (e.g., CartContext)
├── navigation/                # App navigation (Stacks and Tabs)
├── redux/                     # Redux setup
│   ├── cartSlice.js           # Redux slice for cart operations
│   └── store.js               # Redux store config
├── screens/                   # Main app screens
│   ├── CartScreen.js
│   ├── FraudAnalyticsScreen.js
│   ├── LoginScreen.js
│   ├── PaymentFailure.js
│   ├── PaymentSuccess.js
│   ├── ProductScreen.js
│   ├── ProfileScreen.js
│   └── SignUpScreen.js
├── services/                  # API service layers
│   ├── authService.js         # Auth API calls (login/signup)
│   └── fraudService.js        # Fraud prediction or biometric APIs
├── utils/                     # Utility and helper functions
│   ├── api.js                 # Base Axios instance
│   ├── handleStripePayment.js
│   ├── handleUPIPayment.js
│   ├── handleUPIPaymentSuccess.js
│   └── paymentService.js      # Shared payment logic
├── App.js                     # App entry point
├── app.json                   # Expo config
├── package.json               # Project metadata and dependencies
└── README.md                  # You're here!
```

## 🚀 Features

- 🔐 **Two-Stage Transaction Verification**  
  Combines financial patterns and behavioral biometrics.

- 📱 **Biometric Sensor Logging**  
  Uses motion sensors (gyroscope, accelerometer, magnetometer) for user validation.

- 💳 **Multiple Payment Integrations**  
  UPI and Stripe Checkout.

- 📊 **Fraud Analytics Dashboard**  
  Displays fraud risk scores and patterns.

## 🧠 Technologies Used

- React Native with Expo
- Redux for state management
- Axios for API communication
- Stripe API and UPI integration
- Accelerometer & Gyroscope via Expo Sensors

## 🛠️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/YOUR_USERNAME/NeuroPay_front.git
   cd NeuroPay_front
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
   npx expo start
   ```

4. **Backend**

   Ensure your backend for fraud detection, biometric validation, and payment APIs is running and URLs are configured in `utils/api.js`.

## 📬 Contact

For any queries or contributions, contact [chetan@iitbhilai.ac.in, arpang@iitbhilai.ac.in, shivam@iitbhilai.ac.in].
