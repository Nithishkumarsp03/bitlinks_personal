import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Diamond from "../../../Assets/Gem.svg";
import { usePerson } from '../../../COMPONENTS/Context';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function ApexChartFiveYearlyGraph() {
  const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
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
      if (!selectedPersonId) {
        console.error("Selected person ID is not defined.");
        return;
      }
  
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
  
        // Check if 'data' is an array
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          return;
        }
  
        let totalPoints = 0;
        const currentYear = new Date().getFullYear();
        let maxYear = currentYear;
  
        // Process the data
        data.forEach(entry => {
          if (!entry.datetime || entry.points === undefined) {
            console.error('Invalid entry format:', entry);
            return;
          }
  
          const entryYear = new Date(entry.datetime).getFullYear();
          if (entryYear > maxYear) {
            maxYear = entryYear;
          }
        });
  
        const fiveYearRanges = {};
        for (let startYear = maxYear - 4; startYear <= maxYear; startYear++) {
          const range = `${startYear - 4}-${startYear}`;
          fiveYearRanges[range] = 0;
        }
  
        data.forEach(entry => {
          const entryYear = new Date(entry.datetime).getFullYear();
          Object.keys(fiveYearRanges).forEach(range => {
            const [startYear, endYear] = range.split('-').map(Number);
            if (entryYear >= startYear && entryYear <= endYear) {
              fiveYearRanges[range] += entry.points;
            }
          });
          totalPoints += entry.points;
        });
  
        const labels = Object.keys(fiveYearRanges).slice(-5);
        const values = Object.values(fiveYearRanges).slice(-5);
  
        if (labels.length === 0 || values.length === 0) {
          console.error('No data to display.');
          return;
        }
  
        setLabels(labels);
        setSeriesData([{ name: 'Points', data: values }]);
        setTotalPoints(totalPoints);
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
      categories: labels,  // Display the 5-year ranges as labels on the x-axis
      title: {
        text: "5 Years",
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
            <p>{totalPoints}</p>
          </button>
        </div>
      </div>
      {seriesData.length > 0 ? (
        <ReactApexChart options={options} series={seriesData} type="bar" height={300} />
      ) : (
        // Check CSS in Home.css
        <div className='empty-error'>
          <div>
            <i class="fa-solid fa-circle-info" ></i>
            <p>No data found for this connection</p>
          </div>
        </div>
      )}      
    </div>
  );
}
