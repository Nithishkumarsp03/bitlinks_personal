import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Diamond from "../../../Assets/Gem.svg";
import { usePerson } from '../../../COMPONENTS/Context';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function ApexChartYearlyGraph() {
  const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0); // State to hold total points
  const { selectedPersonId } = usePerson();
  const decrypt = (ciphertext) => {
    try {
      if (ciphertext) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
      }
      return '';
    } catch (error) {
      console.error("Decryption error:", error.message);
      return '';
    }
  };
  
  const token = decrypt(Cookies.get("token"));

  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedPersonId }),
        });
  
        if (!response.ok) {
          console.error('Failed to fetch data:', response.statusText);
          return;
        }
  
        const result = await response.json();
        const data = result.data;
  
        // Initialize total points counter and yearly data object
        let totalPoints = 0;
        const yearlyData = {};
  
        // Get current year
        const currentYear = new Date().getFullYear();
  
        // Prepopulate the last 5 years with 0 points
        const recentLabels = [];
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i;
          yearlyData[year] = 0; // Set 0 points initially for each year
          recentLabels.push(year.toString()); // Store the label as a string
        }
  
        // Process the fetched data
        data.forEach(entry => {
          const date = new Date(entry.datetime);
          const year = date.getFullYear();
  
          // If the year exists in the last 5 years, update its points
          if (yearlyData[year] !== undefined) {
            yearlyData[year] += entry.points;
          }
          totalPoints += entry.points; // Add points to total
        });
  
        // Get values for the last 5 years
        const values = recentLabels.map(label => yearlyData[label]);
  
        setLabels(recentLabels); // Set the last 5 years as labels
        setSeriesData([
          {
            name: "Points",
            data: values,
          }
        ]);
  
        setTotalPoints(totalPoints); // Update total points state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchYearlyData();
  }, [selectedPersonId]);  

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#2867B2'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: labels,
      title: {
        text: "Year",
        style: { color: "#2867B2", fontSize: 16 , fontFamily: "Open Sans, sans-serif",},
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "15", colors: ["#2867B2"] },
      },
      title: {
        text: "Points",
        style: { color: "#2867B2", fontSize: 16 , fontFamily: "Open Sans, sans-serif",},
      },
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex }) {
        return `<div style="display: flex; align-items: center; background-color: #f3f3f3; padding: 5px; border-radius: 5px;">
                  <img src="${Diamond}" style="width: 20px; height: 20px; margin-right: 8px;" alt="Diamond Icon" />
                  <span style="font-size: 14px; font-weight: 600;">
                    ${series[seriesIndex][dataPointIndex]} Points
                  </span>
                </div>`;
      }
    }
  };

  return (
    <div>
      <div className="diamond-points">
        <p>Total Points: </p>
        <div className="total-points-box">
          <img src={Diamond} className="diamond-img" alt="Diamond" />
          <button className="total-points">
            <p>{totalPoints}</p> {/* Display total points here */}
          </button>
        </div>
      </div> 
      {seriesData.length > 0 ? (
        <ReactApexChart options={options} series={seriesData} type="bar" height={300} />
      ) : (
        <div className='empty-error'>
          <div>
            <i className="fa-solid fa-circle-info"></i>
            <p>No data found for this connection</p>
          </div>
        </div>
      )}    
    </div>
  );
}
