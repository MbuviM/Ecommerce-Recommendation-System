import React, { useEffect, useState } from 'react';
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
import styles from '../styles/analysis.module.css';
import Logoutscreen from '../components/Logoutscreen';
import { useRouter } from 'next/router';

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

// Function to generate random data
const generateRandomData = () => {
  // Generate random product count between 80 and 150
  const productCount = Math.floor(Math.random() * 70) + 80;
  
  // Generate random total sales between $10,000 and $50,000
  const totalSales = (Math.random() * 40000 + 10000).toFixed(2);
  
  // Generate random average order value between $50 and $200
  const averageOrderValue = (Math.random() * 150 + 50).toFixed(2);
  
  // Generate category data
  const categories = [
    'Shirts', 'Pants', 'Shoes', 'Accessories', 'Outerwear', 'Formal'
  ];
  
  const categoryValues = categories.map(() => Math.floor(Math.random() * 30) + 5);
  const categorySalesValues = categories.map(() => Math.floor(Math.random() * 5000) + 1000);
  
  const categoryChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Products Count',
        data: categoryValues,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)'
        ]
      }
    ]
  };
  
  const categoryPerformanceData = {
    labels: categories,
    datasets: [
      {
        label: 'Sales by Category ($)',
        data: categorySalesValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };
  
  // Generate monthly sales data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlySalesData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: months.map(() => Math.floor(Math.random() * 10000) + 3000),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  
  // Generate top products
  const topProducts = [
    {
      id: '1',
      name: 'Premium Denim Jacket',
      quantity: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      imageUrl: 'https://via.placeholder.com/100x100'
    },
    {
      id: '2',
      name: 'Classic White Shirt',
      quantity: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      imageUrl: 'https://via.placeholder.com/100x100'
    },
    {
      id: '3',
      name: 'Slim Fit Chinos',
      quantity: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      imageUrl: 'https://via.placeholder.com/100x100'
    },
    {
      id: '4',
      name: 'Leather Belt',
      quantity: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      imageUrl: 'https://via.placeholder.com/100x100'
    },
    {
      id: '5',
      name: 'Oxford Dress Shoes',
      quantity: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      imageUrl: 'https://via.placeholder.com/100x100'
    }
  ];
  
  return {
    productCount,
    totalSales,
    averageOrderValue,
    categoryData: categoryChartData,
    categoryPerformanceData,
    salesData: monthlySalesData,
    topProducts
  };
};

const Analysis = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const router = useRouter();
  
  // Generate random data
  useEffect(() => {
    if (!user) return;
    
    // Simulate loading delay
    const loadData = setTimeout(() => {
      try {
        const randomData = generateRandomData();
        setData(randomData);
        setLoading(false);
      } catch (err) {
        console.error('Error generating data:', err);
        setError(err.message);
        setLoading(false);
      }
    }, 1000); // 1 second loading delay for realism
    
    return () => clearTimeout(loadData);
  }, [user]);

  // Options for charts
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

  // If user is not authenticated, show login screen
  if (!user) {
    return <Logoutscreen />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className={styles.analysisContainer}>
        <h1>Dapper Wear Analytics Dashboard</h1>
        <div className={styles.loading}>Loading analytics data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.analysisContainer}>
        <h1>Dapper Wear Analytics Dashboard</h1>
        <div className={styles.error}>Error loading data: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.analysisContainer}>
      <h1>Dapper Wear Analytics Dashboard</h1>
      
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <h3>Total Products</h3>
          <p className={styles.statNumber}>{data.productCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Sales</h3>
          <p className={styles.statNumber}>${data.totalSales}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Average Order Value</h3>
          <p className={styles.statNumber}>${data.averageOrderValue}</p>
        </div>
      </div>
      
      {data.topProducts.length > 0 && (
        <div className={styles.topProductsSection}>
          <h2>Top Selling Products</h2>
          <div className={styles.topProductsGrid}>
            {data.topProducts.map((product, index) => (
              <div key={product.id} className={styles.topProductCard}>
                <div className={styles.topProductRank}>{index + 1}</div>
                <div className={styles.topProductInfo}>
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className={styles.topProductImage} 
                    />
                  )}
                  <div className={styles.topProductDetails}>
                    <h3>{product.name}</h3>
                    <p>Quantity Sold: <strong>{product.quantity}</strong></p>
                    <p>Revenue: <strong>${product.revenue.toFixed(2)}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <h2>Monthly Sales Trend</h2>
          {data.salesData ? (
            <Line data={data.salesData} options={options} />
          ) : (
            <div>No sales data available</div>
          )}
        </div>
        <div className={styles.chartCard}>
          <h2>Products by Category</h2>
          {data.categoryData ? (
            <Pie data={data.categoryData} options={options} />
          ) : (
            <div>No category data available</div>
          )}
        </div>
        <div className={styles.chartCard}>
          <h2>Category Performance</h2>
          {data.categoryPerformanceData ? (
            <Bar data={data.categoryPerformanceData} options={options} />
          ) : (
            <div>No category performance data available</div>
          )}
        </div>
      </div>
      
      {/* Refresh Data Button */}
      <div className={styles.refreshSection}>
        <button 
          className={styles.refreshButton} 
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setData(generateRandomData());
              setLoading(false);
            }, 500);
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Analysis;