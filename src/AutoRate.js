import "./App.css";
import React, { useState, useEffect } from "react";


const apiKey = process.env.REACT_APP_API_KEY;

// =========================
// SEARCH COMPONENT
// =========================

const Search = ({ onSearch }) => {
  const [schoolName, setSchoolName] = useState("");

  const handleChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { // search when enter is pressed
      onSearch(schoolName);
    }
  };

  return (
    <input
      type="text"
      placeholder="Enter school name"
      value={schoolName}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

// =========================
// ATTRIBUTE SCORES
// =========================

// normalized to 0-100
const gradRateScore = (gradRate) => {
  if (gradRate < 50) return 0;
  if (gradRate <= 90) return 0.01 * (10000 ** ((gradRate / 40) - (5 / 4)));
  return 100;
};

const studentFacultyRatioScore = (ratio) => {
  if (ratio > 0 && ratio <= 10) return 100;
  if (ratio <= 20) return 100 * (1 / 2) ** ((ratio / 8) - (5 / 4));
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
  if (num < 50) return 2 * num;
  if (num <= 60) return 100;
  if (num <= 100) return -100 * (5000) ** ((num / 40) - (3 / 2)); // FIX THIS 
  return 50;
};

// =========================
// FETCH DATA
// =========================

function AutoRate() {
  const [schoolData, setSchoolData] = useState(null);
  const [score, setScore] = useState(null);

  const handleSearch = async (schoolName) => {
    try {
      // Fetch school ID
      const searchUrl = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&school.name=${encodeURIComponent(
        schoolName
      )}&fields=id&per_page=1`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      console.log(searchData);

      if (!searchData.results || searchData.results.length === 0) {
        console.warn("No results found from school search");
        setSchoolData(null);
        setScore(null);
        return;
      }

      const school = searchData.results[0];
      const schoolId = school.id;
      console.log(schoolId);

      // Fetch school details
      const detailUrl = `https://api.data.gov/ed/collegescorecard/v1/schools?id=${schoolId}?api_key=${apiKey}&fields=school.name,completion_rate_4yr_150nt,demographics.student_faculty_ratio,attendance.academic_year,1_yr_after_completion.not_working_not_enrolled.overall_count,program_reporter.programs_offered`;
      const detailRes = await fetch(detailUrl);
      const detailData = await detailRes.json();
      console.log(detailData)

      if (detailData) {
        setSchoolData(detailData);
      } else {
        console.warn("No detail data found");
        setSchoolData(null);
        setScore(null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSchoolData(null);
      setScore(null);
    }
  };


  // =========================
  // COMPILE SCORE
  // =========================

  useEffect(() => {
    if (!schoolData) return;

    const grad = gradRateScore(schoolData["completion_rate_4yr_150nt"]);
    const faculty = studentFacultyRatioScore(schoolData["demographics.student_faculty_ratio"]);
    const net = netPriceScore(schoolData["attendance.academic_year"]);
    const employment = postGradEmploymentRateScore(schoolData["1_yr_after_completion.not_working_not_enrolled.overall_count"]);
    const majors = numMajorsScore(schoolData["program_reporter.programs_offered"]);

    // weight scores
    const finalScore = (
      0.2 * grad +
      0.1 * faculty +
      0.4 * net +
      0.2 * employment +
      0.1 * majors
    );

    setScore(finalScore);
  }, [schoolData]);

  // =========================
  // DISPLAY
  // =========================

  return (
    <main className="App">
      <h1>COLLEGE RATER</h1>
      <Search onSearch={handleSearch} />
      {schoolData && (
        <article style={{ marginTop: "20px" }}>
          <h2>{schoolData["school.name"] || "N/A"}</h2>
          <section>
            <p><strong>School Name:</strong> {schoolData["school.name"] || "N/A"}</p>
            <p><strong>Graduation Rate:</strong> {schoolData["completion_rate_4yr_150nt"] || "N/A"}</p>
            <p><strong>Student-to-Faculty Ratio:</strong> {schoolData["demographics.student_faculty_ratio"] || "N/A"}</p>
            <p><strong>Net Cost:</strong> ${schoolData["attendance.academic_year"] || "N/A"}</p>
            <p><strong>Post-Grad Employment Rate:</strong> {schoolData["1_yr_after_completion.not_working_not_enrolled.overall_count"] || "N/A"}</p>
            <p><strong>Number of Majors:</strong> {schoolData["program_reporter.programs_offered"] || "N/A"}</p>
          </section>
          <h3><strong>Final Score:</strong> {score || "Please use Manual Mode"}</h3>
        </article>
      )}
    </main>
  );
}

export default AutoRate;