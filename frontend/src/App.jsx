import { useState, useMemo } from "react";
import "./App.css";

const NEIGHBORHOODS = [
  { value: "CollgCr", label: "College Creek" },
  { value: "Veenker", label: "Veenker" },
  { value: "Crawfor", label: "Crawford" },
  { value: "Edwards", label: "Edwards" },
  { value: "Somerset", label: "Somerset" },
  { value: "OldTown", label: "Old Town" },
  { value: "NAmes", label: "North Ames" },
  { value: "BrkSide", label: "Brookside" },
  { value: "Sawyer", label: "Sawyer" },
  { value: "NridgHt", label: "Northridge Heights" },
  { value: "NWAmes", label: "Northwest Ames" },
  { value: "SawyerW", label: "Sawyer West" },
  { value: "Mitchel", label: "Mitchell" },
  { value: "Gilbert", label: "Gilbert" },
  { value: "StoneBr", label: "Stone Brook" },
  { value: "NoRidge", label: "Northridge" },
  { value: "Timber", label: "Timberland" },
  { value: "IDOTRR", label: "Iowa DOT & Rail Road" },
  { value: "ClearCr", label: "Clear Creek" },
  { value: "Somerst", label: "Somerset" },
  { value: "Blmngtn", label: "Bloomington Heights" },
  { value: "MeadowV", label: "Meadow Village" },
  { value: "BrDale", label: "Briardale" },
  { value: "NPkVill", label: "Northpark Villa" },
  { value: "Blueste", label: "Bluestem" },
];

const HOUSE_STYLES = [
  { value: "1Story", label: "One Story" },
  { value: "2Story", label: "Two Story" },
  { value: "1.5Fin", label: "1.5 Story Finished" },
  { value: "1.5Unf", label: "1.5 Story Unfinished" },
  { value: "2.5Fin", label: "2.5 Story Finished" },
  { value: "2.5Unf", label: "2.5 Story Unfinished" },
  { value: "SFoyer", label: "Split Foyer" },
  { value: "SLvl", label: "Split Level" },
];

const API_URL = "https://house-price-prediction-project-crcz.onrender.com/predict";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  // ── Form State ──
  const [grLivArea, setGrLivArea] = useState(1500);
  const [bedroomAbvGr, setBedroomAbvGr] = useState(3);
  const [fullBath, setFullBath] = useState(2);
  const [yearBuilt, setYearBuilt] = useState(2005);
  const [neighborhood, setNeighborhood] = useState("CollgCr");
  const [houseStyle, setHouseStyle] = useState("1Story");

  // ── Async State ──
  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState(null);

  // ── Slider fill percentage ──
  const sliderPercent = useMemo(
    () => ((grLivArea - 400) / (5000 - 400)) * 100,
    [grLivArea]
  );

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPredictedPrice(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          GrLivArea: parseFloat(grLivArea),
          BedroomAbvGr: parseInt(bedroomAbvGr),
          FullBath: parseInt(fullBath),
          YearBuilt: parseInt(yearBuilt),
          Neighborhood: neighborhood,
          HouseStyle: houseStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail?.[0]?.msg ||
            errorData?.detail ||
            `Server responded with status ${response.status}`
        );
      }

      const data = await response.json();
      setPredictedPrice(data.predicted_price);
    } catch (err) {
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        setError(
          "Could not connect to the prediction API. The server may be waking up — please try again in a moment."
        );
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clampBedrooms = (val) => Math.max(0, Math.min(10, val));
  const clampBaths = (val) => Math.max(0, Math.min(5, val));

  return (
    <div className="app-container">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-badge">
          <span className="badge-dot" />
          ML-Powered Engine
        </div>
        <h1>HouseVal AI</h1>
        <p>
          Instant property valuations powered by a Kaggle-trained regression
          model. Configure property details below.
        </p>
      </header>

      {/* ── Main Form Card ── */}
      <section className="form-card" id="prediction-form">
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay" id="loading-overlay">
            <div className="overlay-spinner" />
            <span>Analyzing property data…</span>
          </div>
        )}

        <h2 className="form-card-title">
          <span className="icon">🏠</span>
          Property Configuration
        </h2>
        <p className="form-card-subtitle">
          Adjust the parameters to get an AI-estimated market value.
        </p>

        <div className="form-grid">
          {/* ── Ground Living Area (Range Slider) ── */}
          <div className="form-group full-width">
            <div className="slider-header">
              <label className="form-label" htmlFor="grLivArea-slider">
                <span className="label-icon">📐</span>
                Ground Living Area
              </label>
              <span className="slider-value-badge" id="grLivArea-value">
                {grLivArea.toLocaleString()} sq ft
              </span>
            </div>
            <div className="slider-container">
              <input
                id="grLivArea-slider"
                type="range"
                className="range-slider"
                min="400"
                max="5000"
                step="50"
                value={grLivArea}
                onChange={(e) => setGrLivArea(Number(e.target.value))}
                style={{
                  background: `linear-gradient(90deg, #6366f1 0%, #8b5cf6 ${sliderPercent}%, rgba(15, 23, 42, 0.8) ${sliderPercent}%)`,
                }}
              />
              <div className="slider-ticks">
                <span>400</span>
                <span>1,500</span>
                <span>3,000</span>
                <span>5,000</span>
              </div>
            </div>
          </div>

          <div className="form-divider" />

          {/* ── Bedrooms (Number Stepper) ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="bedrooms-input">
              <span className="label-icon">🛏️</span>
              Bedrooms Above Ground
            </label>
            <div className="number-input-group">
              <button
                type="button"
                className="step-btn"
                id="bedrooms-decrement"
                onClick={() => setBedroomAbvGr((v) => clampBedrooms(v - 1))}
                aria-label="Decrease bedrooms"
              >
                −
              </button>
              <input
                id="bedrooms-input"
                type="number"
                min="0"
                max="10"
                value={bedroomAbvGr}
                onChange={(e) =>
                  setBedroomAbvGr(clampBedrooms(Number(e.target.value)))
                }
              />
              <button
                type="button"
                className="step-btn"
                id="bedrooms-increment"
                onClick={() => setBedroomAbvGr((v) => clampBedrooms(v + 1))}
                aria-label="Increase bedrooms"
              >
                +
              </button>
            </div>
          </div>

          {/* ── Full Bathrooms (Number Stepper) ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="bathrooms-input">
              <span className="label-icon">🚿</span>
              Full Bathrooms
            </label>
            <div className="number-input-group">
              <button
                type="button"
                className="step-btn"
                id="bathrooms-decrement"
                onClick={() => setFullBath((v) => clampBaths(v - 1))}
                aria-label="Decrease bathrooms"
              >
                −
              </button>
              <input
                id="bathrooms-input"
                type="number"
                min="0"
                max="5"
                value={fullBath}
                onChange={(e) =>
                  setFullBath(clampBaths(Number(e.target.value)))
                }
              />
              <button
                type="button"
                className="step-btn"
                id="bathrooms-increment"
                onClick={() => setFullBath((v) => clampBaths(v + 1))}
                aria-label="Increase bathrooms"
              >
                +
              </button>
            </div>
          </div>

          <div className="form-divider" />

          {/* ── Year Built ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="yearBuilt-input">
              <span className="label-icon">📅</span>
              Year Built
            </label>
            <input
              id="yearBuilt-input"
              type="number"
              className="year-input"
              min="1872"
              max="2026"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(Number(e.target.value))}
            />
          </div>

          {/* ── Neighborhood (Dropdown) ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="neighborhood-select">
              <span className="label-icon">📍</span>
              Neighborhood
            </label>
            <div className="select-wrapper">
              <select
                id="neighborhood-select"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label} ({n.value})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── House Style (Dropdown) ── */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="houseStyle-select">
              <span className="label-icon">🏗️</span>
              House Style
            </label>
            <div className="select-wrapper">
              <select
                id="houseStyle-select"
                value={houseStyle}
                onChange={(e) => setHouseStyle(e.target.value)}
              >
                {HOUSE_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Predict Button ── */}
        <button
          id="predict-btn"
          className="predict-btn"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Predicting…
            </>
          ) : (
            <>
              <span className="btn-icon">✨</span>
              Get Price Estimate
            </>
          )}
        </button>
      </section>

      {/* ── Result ── */}
      {predictedPrice !== null && (
        <div className="result-card" id="result-card">
          <div className="result-label">
            <span className="check-icon">✓</span>
            Estimated Market Value
          </div>
          <div className="result-price" id="result-price">
            {formatCurrency(predictedPrice)}
          </div>
          <p className="result-subtitle">
            Based on {grLivArea.toLocaleString()} sq ft · {bedroomAbvGr} bed ·{" "}
            {fullBath} bath · Built {yearBuilt}
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="error-card" id="error-card" role="alert">
          <button
            className="error-dismiss"
            id="error-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
          <div className="error-header">
            <div className="error-icon-badge">⚠️</div>
            <h3>Connection Failed</h3>
          </div>
          <p>{error}</p>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p>
          Powered by Scikit-Learn & FastAPI ·{" "}
          <a
            className="footer-link"
            href="https://www.kaggle.com/c/house-prices-advanced-regression-techniques"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kaggle Dataset
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;