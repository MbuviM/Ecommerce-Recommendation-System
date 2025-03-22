import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from '../styles/Home.module.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analysis = () => {
  // Sample data - replace with your actual data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const categoryData = {
    labels: ['Apparel', 'Footwear', 'Accessories', 'Sporting Goods'],
    datasets: [
      {
        data: [300, 250, 200, 150],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dapper Wear Analytics Dashboard'
      }
    }
  };

  return (
    <div className={styles.analysisContainer}>
      <h1>Dapper Wear Analytics Dashboard</h1>
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <h2>Monthly Sales Trend</h2>
          <Line data={salesData} options={options} />
        </div>
        <div className={styles.chartCard}>
          <h2>Sales by Category</h2>
          <Pie data={categoryData} options={options} />
        </div>
        <div className={styles.chartCard}>
          <h2>Category Performance</h2>
          <Bar data={categoryData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
