import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Diamond from "../../../Assets/Gem.svg";
import { usePerson } from '../../../COMPONENTS/Context';

export default function ApexChartMonthlyGraph() {
  const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0); // State to hold total points
  const { selectedPersonId } = usePerson();

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedPersonId }),
        });

        const data = await response.json();
        console.log('Fetched Data:', data);

        // Initialize total points counter and monthly data object
        let totalPoints = 0;
        const monthlyData = {};

        data.forEach(entry => {
          const date = new Date(entry.datetime);
          const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

          if (!monthlyData[yearMonth]) {
            monthlyData[yearMonth] = 0;
          }
          monthlyData[yearMonth] += entry.points;
          totalPoints += entry.points; // Add points to total
        });

        // Get sorted year-month labels and values (queue structure to only keep last 6 months)
        const labels = Object.keys(monthlyData).sort();
        const recentLabels = labels.slice(-6); // Keep only the last 6 months
        const values = recentLabels.map(label => monthlyData[label]);

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

    fetchMonthlyData();
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
        text: "Month",
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
