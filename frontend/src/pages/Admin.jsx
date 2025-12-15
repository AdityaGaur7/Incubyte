import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Api } from '../Api';

const Admin = () => {
    const [sweets, setSweets] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: ''
    });
    const [editingId, setEditingId] = useState(null);
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
            const { data } = await axios.get(`${Api}/api/sweets`, config);
            setSweets(data);
        } catch (error) {
            console.error('Error fetching sweets', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (editingId) {
                await axios.put(`${Api}/api/sweets/${editingId}`, formData, config);
            } else {
                await axios.post(`${Api}/api/sweets`, formData, config);
            }

            setFormData({ name: '', category: '', price: '', quantity: '', description: '', imageUrl: '' });
            setEditingId(null);
            fetchSweets();
        } catch (error) {
            console.error('Error saving sweet', error);
            alert('Error saving sweet');
        }
    };

    const handleEdit = (sweet) => {
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity,
            description: sweet.description || '',
            imageUrl: sweet.imageUrl || ''
        });
        setEditingId(sweet._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                const token = user.token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                await axios.delete(`${Api}/api/sweets/${id}`, config);
                fetchSweets();
            } catch (error) {
                console.error('Error deleting sweet', error);
            }
        }
    };

    const handleRestock = async (id) => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`${Api}/api/sweets/${id}/restock`, {}, config);
            fetchSweets();
        } catch (error) {
            console.error('Error restocking sweet', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>



            <div className="admin-panel">


                <div className="sweets-list">
                    <h2>Manage Sweets</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sweets.map((sweet) => (
                                <tr key={sweet._id}>
                                    <td>
                                        {sweet.imageUrl && (
                                            <img src={sweet.imageUrl} alt={sweet.name} className="sweet-thumbnail" />
                                        )}
                                    </td>
                                    <td>{sweet.name}</td>
                                    <td>{sweet.category}</td>
                                    <td>${sweet.price}</td>
                                    <td>{sweet.quantity}</td>
                                    <td>
                                        <button onClick={() => handleRestock(sweet._id)} className="btn-small">Restock (+1)</button>
                                        <button onClick={() => handleEdit(sweet)} className="btn-small">Edit</button>
                                        <button onClick={() => handleDelete(sweet._id)} className="btn-small btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="sweet-form">
                    <h2>{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" placeholder="e.g. Chocolate Cake" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input placeholder="e.g. Cake" value={formData.category} onChange={handleChange} name="category" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input name="quantity" type="number" placeholder="0" value={formData.quantity} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input name="description" placeholder="Sweet description" value={formData.description} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} />
                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <img src={formData.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Sweet' : 'Add Sweet'}</button>
                            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', category: '', price: '', quantity: '', description: '', imageUrl: '' }); }} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>}
                        </div>
                    </form>
                </div>


            </div>
        </div>
    );
};

export default Admin;
