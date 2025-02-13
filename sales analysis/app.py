from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import logging
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Initialize Flask app
app = Flask(__name__)

# Allow cross-origin requests from the React frontend (localhost:5173)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load dataset
try:
    df = pd.read_csv('sales_data_sample.csv', encoding='ISO-8859-1')
    logging.info("Dataset loaded successfully.")
except Exception as e:
    df = None
    logging.error(f"Error loading data: {e}")

# Prepare data for ML model
if df is not None:
    features = df[['QUANTITYORDERED', 'PRICEEACH', 'MSRP', 'QTR_ID', 'MONTH_ID']]
    target = df['SALES']

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    logging.info("ML model trained successfully.")
else:
    model = None

# API health check
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working"}), 200

# Dashboard summary
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    if df is None:
        return jsonify({"error": "Data not loaded"}), 500

    total_sales = float(df['SALES'].sum())
    total_orders = len(df)
    avg_order_value = total_sales / total_orders if total_orders > 0 else 0

    return jsonify({
        "totalSales": round(total_sales, 2),
        "totalOrders": total_orders,
        "averageOrderValue": round(avg_order_value, 2)
    })

# Sales by country
@app.route('/api/country-sales', methods=['GET'])
def get_country_sales_data():
    if df is None:
        return jsonify({"error": "Data not loaded"}), 500

    logging.info("Fetching country sales data...")
    country_sales = df.groupby('COUNTRY')['SALES'].sum().round(2).to_dict()

    return jsonify(country_sales)

# Sales by product line
@app.route('/api/product-sales', methods=['GET'])
def get_product_sales_data():
    if df is None:
        return jsonify({"error": "Data not loaded"}), 500

    logging.info("Fetching product sales data...")
    product_sales = df.groupby('PRODUCTLINE')['SALES'].sum().round(2).to_dict()

    return jsonify(product_sales)

# Monthly sales data
@app.route('/api/monthly-sales', methods=['GET'])
def get_monthly_sales_data():
    if df is None:
        return jsonify({"error": "Data not loaded"}), 500

    logging.info("Fetching monthly sales data...")
    monthly_sales = df.groupby(['YEAR_ID', 'MONTH_ID'])['SALES'].sum().reset_index()

    monthly_sales_dict = {
        f"{int(row['YEAR_ID'])}-{int(row['MONTH_ID'])}": round(row['SALES'], 2)
        for _, row in monthly_sales.iterrows()
    }

    return jsonify(monthly_sales_dict)

# Prediction API
@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not trained"}), 500

    try:
        data = request.get_json()
        required_fields = ['QUANTITYORDERED', 'PRICEEACH', 'MSRP', 'QTR_ID', 'MONTH_ID']
        
        # Validate input fields
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Convert input to numpy array
        input_data = np.array([
            data['QUANTITYORDERED'],
            data['PRICEEACH'],
            data['MSRP'],
            data['QTR_ID'],
            data['MONTH_ID']
        ]).reshape(1, -1)

        # Make prediction
        prediction = model.predict(input_data)[0]
        
        return jsonify({'predictedSales': round(prediction, 2)})
    
    except Exception as e:
        logging.error(f"Error in prediction: {e}")
        return jsonify({"error": "Invalid input data"}), 400

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001)
