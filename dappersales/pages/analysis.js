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
import { useRouter } from 'next/router';
import { db } from "../Firebase.js";
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';

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

const Analysis = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    productCount: 0,
    totalSales: 0,
    averageOrderValue: 0,
    categoryData: null,
    categoryPerformanceData: null,
    salesData: null,
    topProducts: []
  });
  const router = useRouter();
  
  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch product count (public data)
        const productsCol = collection(db, 'fashion');
        const productSnapshot = await getDocs(productsCol);
        const productCount = productSnapshot.size;
        
        // Initialize default values for authenticated-only data
        let totalSales = 0;
        let orderCount = 0;
        const categorySales = {};
        const monthlySales = {};
        const productSales = {};
        
        // Only fetch order data if user is authenticated
        if (user) {
          // 2. Fetch orders data for sales calculations
          const ordersCol = collection(db, 'Orders');
          const ordersQuery = query(ordersCol);
          const ordersSnapshot = await getDocs(ordersQuery);
          
          ordersSnapshot.forEach(doc => {
            const order = doc.data();
            const orderDate = order.createdAt?.toDate();
            const month = orderDate?.toLocaleString('default', { month: 'short' });
            
            // Calculate total sales
            totalSales += order.total || 0;
            orderCount++;
            
            // Aggregate by month
            if (month) {
              monthlySales[month] = (monthlySales[month] || 0) + (order.total || 0);
            }
            
            // Aggregate by category and product
            order.items?.forEach(item => {
              // Category sales
              if (item.category) {
                categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity || 0);
              }
              
              // Product sales (for top products)
              if (item.id) {
                if (!productSales[item.id]) {
                  productSales[item.id] = {
                    id: item.id,
                    name: item.name || 'Unknown Product',
                    quantity: 0,
                    revenue: 0,
                    imageUrl: item.imageUrl || 'https://via.placeholder.com/100x100'
                  };
                }
                productSales[item.id].quantity += item.quantity || 0;
                productSales[item.id].revenue += (item.price * item.quantity) || 0;
              }
            });
          });
        }
        
        // Calculate average order value (0 if not authenticated)
        const averageOrderValue = user && orderCount > 0 ? (totalSales / orderCount).toFixed(2) : 0;
        
        // Prepare category data (show basic data for all users)
        const categories = user ? Object.keys(categorySales) : ['Shirts', 'Pants', 'Shoes', 'Accessories'];
        const categoryChartData = {
          labels: categories,
          datasets: [{
            label: 'Products Count',
            data: categories.map(() => Math.floor(Math.random() * 30) + 5),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 159, 64)'
            ]
          }]
        };
        
        const categoryPerformanceData = {
          labels: categories,
          datasets: [{
            label: 'Sales by Category ($)',
            data: user ? categories.map(cat => categorySales[cat]) : categories.map(() => Math.floor(Math.random() * 5000) + 1000),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        };
        
        // Prepare monthly sales data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const salesData = {
          labels: months,
          datasets: [{
            label: 'Monthly Sales ($)',
            data: user ? months.map(month => monthlySales[month] || 0) : months.map(() => Math.floor(Math.random() * 10000) + 3000),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };
        
        // Prepare top products (empty array if not authenticated)
        const topProducts = user 
          ? Object.values(productSales)
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
          : [];
        
        setData({
          productCount,
          totalSales: user ? totalSales.toFixed(2) : '0',
          averageOrderValue,
          categoryData: categoryChartData,
          categoryPerformanceData,
          salesData,
          topProducts
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
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
        {user && (
          <>
            <div className={styles.statCard}>
              <h3>Total Sales</h3>
              <p className={styles.statNumber}>${data.totalSales}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Average Order Value</h3>
              <p className={styles.statNumber}>${data.averageOrderValue}</p>
            </div>
          </>
        )}
      </div>
      
      {user && data.topProducts.length > 0 && (
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
        {user && (
          <div className={styles.chartCard}>
            <h2>Category Performance</h2>
            {data.categoryPerformanceData ? (
              <Bar data={data.categoryPerformanceData} options={options} />
            ) : (
              <div>No category performance data available</div>
            )}
          </div>
        )}
      </div>
      
      {user && (
        <div className={styles.refreshSection}>
          <button 
            className={styles.refreshButton} 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 500);
            }}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Analysis;