import './App.css';
import React, { useState } from 'react';

// =========================
// ATTRIBUTE SCORES
// =========================

// normalized to 0-100
const gradRateScore = (gradRate) => {
  if (gradRate <= 70) return 0;
  if (gradRate <= 90) return Math.sin((Math.PI / 40) * (gradRate - 70));
  return 100;
};

const studentFacultyRatioScore = (ratio) => {
  if (ratio <= 10) return 100;
  if (ratio <= 50) return ((-5/2) * ratio) + 125;
  return 0;
};

const netPriceScore = (netPrice) => {
  const adjustedPrice = netPrice / 1000; // price in thousands
  if (adjustedPrice <= 10) return 100;
  if (adjustedPrice <= 50) return 100 * (1 / 2) ** ((adjustedPrice / 40) - (1 / 4));
  if (adjustedPrice <= 80) return 100 * (1 / 50) ** ((adjustedPrice / 30) - (5 / 3));
  return 0;
};

const postGradEmploymentRateScore = (rate) => {
  if (rate <= 25) return 0;
  if (rate <= 97) return (0.0189125 * (rate ** 2)) - (0.91844 * rate) + 11.14066;
  if (rate <= 100) return 100;
};

const numMajorsScore = (num) => {
  if (num <= 50) return 2 * num;
  if (num <= 60) return 100;
  if (num <= 100) return -0.01 * (5000) ** ((num / 40) - (3 / 2)) + 100; // FIX THIS 
  return 50;
};



function ManualRate() {
  const [formData, setFormData] = useState({
    gradRate: '',
    studentFacultyRatio: '',
    netCost: '',
    employmentRate: '',
    numMajors: ''
  });

  const [score, setScore] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// =========================
// COMPILE SCORE
// =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const grad = gradRateScore(parseFloat(formData.gradRate));
    const faculty = studentFacultyRatioScore(parseFloat(formData.studentFacultyRatio));
    const net = netPriceScore(parseFloat(formData.netCost));
    const employment = postGradEmploymentRateScore(parseFloat(formData.employmentRate));
    const majors = numMajorsScore(parseInt(formData.numMajors));

    // weight score
    const finalScore = (
      0.2 * grad +
      0.2 * faculty +
      0.3 * net +
      0.2 * employment +
      0.1 * majors
    );

    setScore(Math.ceil(finalScore)); // round up to nearest integer
  };

// =========================
// DISPLAY
// =========================

  return (
    <main className="App">
      <h1>COLLEGE RATER</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="number" name="gradRate" placeholder="Graduation Rate (%)" value={formData.gradRate} onChange={handleChange} required />
        <input type="number" name="studentFacultyRatio" placeholder="Student-to-Faculty Ratio" value={formData.studentFacultyRatio} onChange={handleChange} required />
        <input type="number" name="netCost" placeholder="Net Cost ($)" value={formData.netCost} onChange={handleChange} required />
        <input type="number" name="employmentRate" placeholder="Employment Rate 1 Year Post-Grad (%)" value={formData.employmentRate} onChange={handleChange} required />
        <input type="number" name="numMajors" placeholder="Number of Majors" value={formData.numMajors} onChange={handleChange} required />
        <button type="submit">Calculate Score</button>
      </form>

      {score && (
        <article style={{ marginTop: '20px' }}>
          <h2>{formData.name}</h2>
          <h3><strong>Final Score:</strong> {score}/100</h3>
        </article>
      )}
    </main>
  );
}

export default ManualRate;
