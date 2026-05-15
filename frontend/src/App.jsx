import { useState } from "react";

function App() {
  const [areaInput, setAreaInput] = useState("");
  const [bedroomsInput, setBedroomsInput] = useState("");
  const [predictedPrice, setPredictedPrice] = useState(null);

  const handlePredict = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        area: parseFloat(areaInput),       
        bedrooms: parseInt(bedroomsInput) 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Validation Error Details:", errorData);
      return;
    }

    const data = await response.json();
    setPredictedPrice(data.predicted_price); 
  } catch (error) {
    console.error("Network or Server Error:", error);
  }
};

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>House Price Predictor</h2>
      <input 
        type="number" 
        placeholder="Area (sq ft)" 
        value={areaInput} 
        onChange={(e) => setAreaInput(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Bedrooms" 
        value={bedroomsInput} 
        onChange={(e) => setBedroomsInput(e.target.value)} 
      />
      
      <button onClick={handlePredict}>Predict Price</button>

      {predictedPrice !== null && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e2f0cb", borderRadius: "5px" }}>
          <h3>Predicted Value: ${predictedPrice.toLocaleString()}</h3>
        </div>
      )}
    </div>
  );
}

export default App;