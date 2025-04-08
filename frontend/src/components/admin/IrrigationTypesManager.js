import React, { useState, useEffect } from 'react';
import { getCropTypes, getSoilTypes } from '../../services/irrigationService';
import { createCropType, updateCropType, deleteCropType, createSoilType, updateSoilType, deleteSoilType } from '../../services/adminService';
import './IrrigationTypesManager.css';

const IrrigationTypesManager = () => {
    const [activeTab, setActiveTab] = useState('crops');
    const [cropTypes, setCropTypes] = useState([]);
    const [soilTypes, setSoilTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        waterNeed: 'Medium',
        rootDepth: '',
        waterRequirement: 0,
        stressThreshold: 0.5,
        waterRetention: 'Medium',
        drainage: 'Medium',
        fieldCapacity: 0.3,
        wiltingPoint: 0.12,
        infiltrationRate: 15
    });

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            setLoading(true);
            const [crops, soils] = await Promise.all([
                getCropTypes(),
                getSoilTypes()
            ]);
            setCropTypes(crops);
            setSoilTypes(soils);
            setError('');
        } catch (err) {
            console.error('Error fetching types:', err);
            setError('Failed to load types. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (activeTab === 'crops') {
                if (editingItem) {
                    await updateCropType(editingItem._id, formData);
                } else {
                    await createCropType(formData);
                }
            } else {
                if (editingItem) {
                    await updateSoilType(editingItem._id, formData);
                } else {
                    await createSoilType(formData);
                }
            }
            await fetchTypes();
            resetForm();
            setError('');
        } catch (err) {
            console.error('Error saving:', err);
            setError(err.message || 'Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            setLoading(true);
            if (activeTab === 'crops') {
                await deleteCropType(id);
            } else {
                await deleteSoilType(id);
            }
            await fetchTypes();
            setError('');
        } catch (err) {
            console.error('Error deleting:', err);
            setError(err.message || 'Failed to delete. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            waterNeed: 'Medium',
            rootDepth: '',
            waterRequirement: 0,
            stressThreshold: 0.5,
            waterRetention: 'Medium',
            drainage: 'Medium',
            fieldCapacity: 0.3,
            wiltingPoint: 0.12,
            infiltrationRate: 15
        });
        setEditingItem(null);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="irrigation-types-manager">
            <h2>Manage Irrigation Types</h2>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'crops' ? 'active' : ''}`}
                    onClick={() => setActiveTab('crops')}
                >
                    Crop Types
                </button>
                <button
                    className={`tab ${activeTab === 'soils' ? 'active' : ''}`}
                    onClick={() => setActiveTab('soils')}
                >
                    Soil Types
                </button>
            </div>

            <form onSubmit={handleSubmit} className="type-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {activeTab === 'crops' ? (
                    <>
                        <div className="form-group">
                            <label>Water Need:</label>
                            <select
                                name="waterNeed"
                                value={formData.waterNeed}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Root Depth (cm):</label>
                            <input
                                type="number"
                                name="rootDepth"
                                value={formData.rootDepth}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Water Requirement (mm/day):</label>
                            <input
                                type="number"
                                name="waterRequirement"
                                value={formData.waterRequirement}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stress Threshold:</label>
                            <input
                                type="number"
                                name="stressThreshold"
                                value={formData.stressThreshold}
                                onChange={handleInputChange}
                                required
                                min="0"
                                max="1"
                                step="0.1"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Water Retention:</label>
                            <select
                                name="waterRetention"
                                value={formData.waterRetention}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Drainage:</label>
                            <select
                                name="drainage"
                                value={formData.drainage}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Slow">Slow</option>
                                <option value="Medium">Medium</option>
                                <option value="Fast">Fast</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Field Capacity:</label>
                            <input
                                type="number"
                                name="fieldCapacity"
                                value={formData.fieldCapacity}
                                onChange={handleInputChange}
                                required
                                min="0"
                                max="1"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Wilting Point:</label>
                            <input
                                type="number"
                                name="wiltingPoint"
                                value={formData.wiltingPoint}
                                onChange={handleInputChange}
                                required
                                min="0"
                                max="1"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Infiltration Rate (mm/hour):</label>
                            <input
                                type="number"
                                name="infiltrationRate"
                                value={formData.infiltrationRate}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </>
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {editingItem ? 'Update' : 'Add'} {activeTab === 'crops' ? 'Crop' : 'Soil'} Type
                    </button>
                    {editingItem && (
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="types-list">
                <h3>Existing {activeTab === 'crops' ? 'Crop' : 'Soil'} Types</h3>
                <div className="types-grid">
                    {(activeTab === 'crops' ? cropTypes : soilTypes).map(item => (
                        <div key={item._id} className="type-card">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                            <div className="type-details">
                                {activeTab === 'crops' ? (
                                    <>
                                        <p>Water Need: {item.waterNeed}</p>
                                        <p>Root Depth: {item.rootDepth} cm</p>
                                        <p>Water Requirement: {item.waterRequirement} mm/day</p>
                                        <p>Stress Threshold: {item.stressThreshold}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>Water Retention: {item.waterRetention}</p>
                                        <p>Drainage: {item.drainage}</p>
                                        <p>Field Capacity: {item.fieldCapacity}</p>
                                        <p>Wilting Point: {item.wiltingPoint}</p>
                                        <p>Infiltration Rate: {item.infiltrationRate} mm/hour</p>
                                    </>
                                )}
                            </div>
                            <div className="type-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IrrigationTypesManager; 