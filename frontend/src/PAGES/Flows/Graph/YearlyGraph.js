import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Diamond from "../../../Assets/Gem.svg";
import { usePerson } from '../../../COMPONENTS/Context';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const SECRET_KEY = 'your-secret-key';

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
        // console.log('Fetched Data:', result);

        // Extract the array from the 'data' property
        const data = result.data;

        // Initialize total points counter and yearly data object
        let totalPoints = 0;
        const yearlyData = {};

        // Process the data
        data.forEach(entry => {
          const date = new Date(entry.datetime);
          const year = date.getFullYear();

          if (!yearlyData[year]) {
            yearlyData[year] = 0;
          }
          yearlyData[year] += entry.points;
          totalPoints += entry.points; // Add points to total
        });

        // Get sorted year labels and values (queue structure to only keep the last 5 years)
        const labels = Object.keys(yearlyData).sort();
        const recentLabels = labels.slice(-5); // Keep only the last 5 years
        const values = recentLabels.map(label => yearlyData[label]);

        setLabels(recentLabels);
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
        <ReactApexChart options={options} series={seriesData} type="bar" height={350} />
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
