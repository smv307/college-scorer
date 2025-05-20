import './App.css';
import React, { useState } from 'react';

// =========================
// ATTRIBUTE SCORES
// =========================

// normalized to 0-100
const gradRateScore = (gradRate) => {
  if (gradRate < 70) return 0;
  if (gradRate <= 90) return 100 * Math.sin((Math.PI / 40) * (gradRate - 70));
  if (gradRate <= 100) return 100;
};

const studentFacultyRatioScore = (ratio) => {
  if (ratio < 10) return 100;
  if (ratio <= 30) return (-5 * ratio) + 150;
  return 0;
};

const netPriceScore = (netPrice) => {
  const adjustedPrice = netPrice / 1000; // price in thousands
  if (adjustedPrice <= 10) return 100;
  if (adjustedPrice < 80) return ((1 / 3250) * (adjustedPrice ** 3)) - ((127 / 2520) * (adjustedPrice ** 2)) + ((199 / 252) * (adjustedPrice)) + 96.8253968254;
  return 0;
};

const postGradEmploymentRateScore = (empRate) => {
  if (empRate < 25) return 0;
  if (empRate <= 97) return (4 / 211 * (empRate ** 2)) - (389 / 422 * empRate) + (4725 / 422);
  if (empRate <= 100) return 100;
};

const numMajorsScore = (num) => {
  if (num === 1) return 1;
  if (num < 50) return 2 * num;
  if (num <= 60) return 100;
  if (num <= 100) return -0.01 * (5000) ** ((num / 40) - (3 / 2)) + 100;
  return 50;
};

const avgAdmitSATScore = (score) => {
  if (score <= 900) return 0;
  if (score < 1400) return (1/5)*(score) - 180;
  return 100;
};


function ManualRate() {
  const [formData, setFormData] = useState({
    gradRate: '',
    studentFacultyRatio: '',
    netCost: '',
    employmentRate: '',
    numMajors: '',
    avgSAT: ''
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
    console.log(`grad: ${grad}`);
    const stufac = studentFacultyRatioScore(parseFloat(formData.studentFacultyRatio));
    console.log(`fac: ${stufac}`);
    const net = netPriceScore(parseFloat(formData.netCost));
    console.log(`net: ${net}`);
    const employment = postGradEmploymentRateScore(parseFloat(formData.employmentRate));
    console.log(`emp: ${employment}`);
    const majors = numMajorsScore(parseInt(formData.numMajors));
    console.log(`majors: ${majors}`);
    const SAT = avgAdmitSATScore(parseFloat(formData.avgSAT));
    console.log(`SAT: ${SAT}`);

    // weight score
    const finalScore = (
      (0.2 * grad +
      0.2 * stufac +
      0.3 * net +
      0.15 * employment +
      0.1 * majors +
      0.05 * SAT) - 0
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
        <input type="number" name="gradRate" placeholder="4-Year Graduation Rate (%)" min="0" max="100" value={formData.gradRate} onChange={handleChange} required />
        <input type="number" name="studentFacultyRatio" placeholder="Student-Faculty Ratio" min="0" value={formData.studentFacultyRatio} onChange={handleChange} required />
        <input type="number" name="netCost" placeholder="Net Cost ($)" min="0" value={formData.netCost} onChange={handleChange} required />
        <input type="number" name="employmentRate" placeholder="Employment Rate 1 Year Post-Grad (%)" min="0" max="100" value={formData.employmentRate} onChange={handleChange} required />
        <input type="number" name="numMajors" placeholder="Number of Majors" min="1" value={formData.numMajors} onChange={handleChange} required />
        <input type="number" name="avgSAT" placeholder="Average Admitted SAT Score" min="400" max="1600"  value={formData.avgSAT} onChange={handleChange} required />
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
