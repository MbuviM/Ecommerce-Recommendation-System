import React, { useEffect, useState } from 'react'
import styles from '../styles/market.module.css'

const Market = () => {
    const [apiData, setApiData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])
    
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('https://newsapi.org/v2/everything?q=business&apiKey=51eb69ffd9f64ee39e141e9a2505e49a')
            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }
            const data = await response.json()
            setApiData(data.articles || [])
        } catch (err) {
            setError(err.message)
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={styles.main}>
                <h2>Loading market news...</h2>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.main}>
                <h2>Error loading market news</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className={styles.main}>
            <h2>Latest Market News, Dapper Wear Keeps you Up to Date</h2>
            <div className={styles.newsfeed}>
                {apiData && apiData.length > 0 ? (
                    apiData.map((article, index) => (
                        <div key={index} className={styles.card}>
                            <h3>{article.title}</h3>
                            <p>Author: {article.author || 'Unknown'}</p>
                            <p>{article.description}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Read more
                            </a>
                        </div>
                    ))
                ) : (
                    <div className={styles.card}>
                        <p>No news articles available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Market
