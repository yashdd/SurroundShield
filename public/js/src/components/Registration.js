import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Check, User, Calendar, Ruler, Weight, Navigation, Mail, Lock } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css'; // This will use our updated CSS

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    bmi: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [passwordError, setPasswordError] = useState('');


  useEffect(() => {
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [formData.password, formData.confirmPassword]);
  
  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setFormData(prev => ({ ...prev, bmi: bmiValue.toFixed(1) }));
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user makes changes
  };

  // const getLocation = () => {
  //   setLoadingLocation(true);
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
  //         setLoadingLocation(false);
  //       },
  //       () => {
  //         setError('Unable to fetch location. Please enable location services.');
  //         setLoadingLocation(false);
  //       }
  //     );
  //   } else {
  //     setError('Geolocation is not supported by this browser');
  //     setLoadingLocation(false);
  //   }
  // };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.address) {
        const { city, town, village, county, state, country } = data.address;
        const locationName = city || town || village || county;
        const locationDetails = `${locationName ? `${locationName}, ` : ''}${state || ''}${country ? `, ${country}` : ''}`;
        
        setFormData(prev => ({
          ...prev,
          location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          locationDetails
        }));
        setLocationInput(locationDetails);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setFormData(prev => ({
        ...prev,
        location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        locationDetails: 'Location detected (address not available)'
      }));
      setLocationInput('Location detected (address not available)');
    }
  };

  // Location detection handler
  const getLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await reverseGeocode(latitude, longitude);
          setLoadingLocation(false);
        },
        () => {
          setError('Unable to fetch location. Please enable location services or enter manually.');
          setLoadingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Please enter manually.');
      setLoadingLocation(false);
    }
  };

  // Location search handler
  const handleLocationSearch = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`
      );
      const data = await response.json();
      
      setSuggestions(data.map(item => ({
        displayName: item.display_name,
        lat: item.lat,
        lon: item.lon
      })));
    } catch (err) {
      console.error('Location search error:', err);
      setSuggestions([]);
    }
  };

  // Handle location selection from suggestions
  const handleSelectLocation = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      location: `${suggestion.lat}, ${suggestion.lon}`,
      locationDetails: suggestion.displayName
    }));
    setLocationInput(suggestion.displayName);
    setShowSuggestions(false);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const { name, age, height, weight, location } = formData;
    
  //   if (!name || !age || !height || !weight || !location) {
  //     setError('Please fill in all required fields');
  //     return;
  //   }
    
  //   if (age < 18 || age > 120) {
  //     setError('Please enter a valid age (18-120)');
  //     return;
  //   }
    
  //   setError('');
  //   setSubmitted(true);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, age, height, weight, location, bmi } = formData; // Destructure all fields from formData

  
    if (!name || !age || !height || !weight || !location) {
      setError('Please fill in all required fields');
      return;
    }
  
    if (age < 18 || age > 120) {
      setError('Please enter a valid age (18-120)');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password,age, height, weight, bmi, location })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Server error. Please try again later.');
    }
  };
  

  const getBmiCategory = () => {
    const bmi = parseFloat(formData.bmi);
    if (isNaN(bmi)) return { category: '', color: 'secondary' };
    
    if (bmi < 18.5) return { category: 'Underweight', color: 'info' };
    if (bmi < 25) return { category: 'Healthy', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'danger' };
  };

  const { category, color } = getBmiCategory();

  if (submitted) {
    return (
      <div className="app-container success-view">
        <div className="card success-card">
          <div className="card-body text-center p-5">
            <div className="success-icon mb-4">
              <Check size={42} />
            </div>
            <h2 className="card-title mb-3">Registration Successful!</h2>
            <p className="card-text mb-4">
              Thank you for registering, <strong>{formData.name}</strong>. Your health profile has been created.
            </p>
            <div className="user-details mb-4">
              <div className="detail-item">
                <span>Age:</span> {formData.age} years
              </div>
              <div className="detail-item">
                <span>Height:</span> {formData.height} cm
              </div>
              <div className="detail-item">
                <span>Weight:</span> {formData.weight} kg
              </div>
              <div className="detail-item">
                <span>BMI:</span> {formData.bmi} ({category})
              </div>
              <div className="detail-item">
                <span>Location:</span> {formData.location}
              </div>
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn btn-primary btn-lg w-100 py-3"
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card registration-card">
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="card-title">SurroundShield Registration</h2>
            <p className="text-muted">Real-time, personalized risk alerts based on location and health data</p>
          </div>
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <AlertCircle size={20} className="me-2 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="form-label">
                <div className="d-flex align-items-center">
                  <User size={18} className="me-2" />
                  Full Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            {/* Age Field */}
            <div className="mb-4">
              <label className="form-label">
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="me-2" />
                  Age
                </div>
              </label>
              <input
                type="number"
                name="age"
                min="18"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Years"
                required
              />
            </div>
            
            {/* Height & Weight Fields */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">
                  <div className="d-flex align-items-center">
                    <Ruler size={18} className="me-2" />
                    Height (cm)
                  </div>
                </label>
                <input
                  type="number"
                  name="height"
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="e.g. 175"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <div className="d-flex align-items-center">
                    <Weight size={18} className="me-2" />
                    Weight (kg)
                  </div>
                </label>
                <input
                  type="number"
                  name="weight"
                  min="30"
                  max="300"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="e.g. 70"
                  required
                />
              </div>
            </div>
            
            {/* BMI Display */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">Body Mass Index (BMI)</label>
                {category && (
                  <span className={`badge bg-${color} rounded-pill px-3 py-2`}>{category}</span>
                )}
              </div>
              <div className="progress bmi-bar mb-2">
                <div 
                  className={`progress-bar bg-${color}`}
                  style={{ width: formData.bmi ? Math.min(formData.bmi * 2.5, 100) + '%' : '0%' }}
                >
                  <span className="bmi-value">{formData.bmi || '--'}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between bmi-labels px-1">
                <small>Underweight</small>
                <small>Healthy</small>
                <small>Overweight</small>
                <small>Obese</small>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                <div className="d-flex align-items-center">
                  <Navigation size={18} className="me-2" />
                  Your Location
                </div>
              </label>
              
              <div className="position-relative">
                <div className="input-group">
                  <input
                    type="text"
                    value={locationInput || formData.locationDetails || formData.location}
                    onChange={(e) => {
                      setLocationInput(e.target.value);
                      handleLocationSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="form-control form-control-lg"
                    placeholder="Enter your location or click detect"
                  />
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={loadingLocation}
                    className="btn btn-primary btn-lg"
                    title="Detect current location"
                  >
                    {loadingLocation ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <MapPin size={20} className="me-1" />
                        <span className="d-none d-sm-inline">Detect</span>
                      </>
                    )}
                  </button>
                </div>
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSelectLocation(suggestion)}
                      >
                        {suggestion.displayName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <small className="text-muted d-block mt-2">
                We use your location to provide localized health alerts
              </small>
            </div>
            {/* Email Field */}
<div className="mb-4">
  <label className="form-label">
    <div className="d-flex align-items-center">
      <Mail size={18} className="me-2" />
      Email Address
    </div>
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="form-control form-control-lg"
    placeholder="Enter your email"
    required
  />
</div>

{/* Password Field */}
<div className="mb-4">
  <label className="form-label">
    <div className="d-flex align-items-center">
      <Lock size={18} className="me-2" />
      Password
    </div>
  </label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    className="form-control form-control-lg"
    placeholder="Create a password"
    required
    minLength="8"
  />
</div>

{/* Confirm Password Field */}
<div className="mb-4">
  <label className="form-label">
    <div className="d-flex align-items-center">
      <Lock size={18} className="me-2" />
      Confirm Password
    </div>
  </label>
  <input
    type="password"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    className={`form-control form-control-lg ${passwordError ? 'is-invalid' : ''}`}
    placeholder="Confirm your password"
    required
    minLength="8"
  />
  {passwordError && (
    <div className="invalid-feedback">{passwordError}</div>
  )}
</div>
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 mt-4"
            >
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;