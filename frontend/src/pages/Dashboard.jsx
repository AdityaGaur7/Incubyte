import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/sweets', config);
            setSweets(data);

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(data.map(s => s.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching sweets', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            let queryParams = new URLSearchParams();
            if (search) queryParams.append('query', search);
            if (category && category !== 'All') queryParams.append('category', category);
            if (minPrice) queryParams.append('minPrice', minPrice);
            if (maxPrice) queryParams.append('maxPrice', maxPrice);

            const { data } = await axios.get(`http://localhost:5000/api/sweets/search?${queryParams.toString()}`, config);
            setSweets(data);
        } catch (error) {
            console.error('Error searching sweets', error);
        }
    };

    const handlePurchase = async (id) => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`http://localhost:5000/api/sweets/${id}/purchase`, {}, config);
            fetchSweets(); // Refresh list
            alert('Purchase successful!');
        } catch (error) {
            alert(error.response?.data?.message || 'Purchase failed');
        }
    };

    return (
        <div className="dashboard">
            <h1>Welcome, {user.name}</h1>

            <div className="search-bar">
                <form onSubmit={handleSearch} className="filters-form">
                    <input
                        type="text"
                        placeholder="Search sweets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="price-input"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="price-input"
                    />
                    <button type="submit" className="btn-secondary">Filter</button>
                    <button type="button" onClick={() => {
                        setSearch('');
                        setCategory('All');
                        setMinPrice('');
                        setMaxPrice('');
                        fetchSweets();
                    }} className="btn-secondary">Reset</button>
                </form>
            </div>

            <div className="sweets-grid">
                {sweets.map((sweet) => (
                    <div key={sweet._id} className="sweet-card">
                        <h3>{sweet.name}</h3>
                        <p>Category: {sweet.category}</p>
                        <p>Price: ${sweet.price}</p>
                        <p>Stock: {sweet.quantity}</p>
                        <button
                            onClick={() => handlePurchase(sweet._id)}
                            disabled={sweet.quantity === 0}
                            className="btn-primary"
                        >
                            {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
