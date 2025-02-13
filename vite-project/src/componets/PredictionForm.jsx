import { useState } from "react";
import { predictSales } from "../services/api";

const PredictionForm = () => {
    const [formData, setFormData] = useState({
      QUANTITYORDERED: "",
      PRICEEACH: "",
      MSRP: "",
      QTR_ID: "",
      MONTH_ID: "",
    });
  
    const [prediction, setPrediction] = useState(null);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // Use the predictSales function from api.js
        const predictedSales = await predictSales(formData);  // Call the predictSales function
        setPrediction(predictedSales);  // Set the predicted sales in state
      } catch (error) {
        console.error("Prediction error:", error);
        setPrediction(null);  // Handle error, maybe show a message to the user
      }
    };
  
    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Sales Prediction</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium">{key}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Predict Sales
          </button>
        </form>
        {prediction !== null && prediction !== undefined ? (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            <strong>Predicted Sales:</strong> ${prediction.toFixed(2)}
          </div>
        ) : (
          prediction === null && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              <strong>Error:</strong> Unable to predict sales. Please try again.
            </div>
          )
        )}
      </div>
    );
  };
  
export default PredictionForm;
