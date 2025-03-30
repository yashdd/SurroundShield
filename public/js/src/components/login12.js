// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AlertCircle, Loader2 as Spinner } from 'lucide-react';
// import '../styles/styles.css'; 

// // Session timeout duration (30 minutes)
// const SESSION_TIMEOUT = 30 * 60 * 1000;

// const Login = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [serverError, setServerError] = useState('');

//     // Check for existing session on component mount
//     // useEffect(() => {
//     //     const sessionData = sessionStorage.getItem('authSession');
//     //     if (sessionData) {
//     //         const { expiresAt } = JSON.parse(sessionData);
//     //         if (Date.now() < expiresAt) {
//     //             navigate('/dashboard');
//     //         } else {
//     //             sessionStorage.removeItem('authSession');
//     //         }
//     //     }
//     // }, [navigate]);
//     useEffect(() => {
//         const sessionData = sessionStorage.getItem('authSession');
//         const currentPath = window.location.pathname;
    
//         if (sessionData && currentPath !== '/dashboard') {
//             const { expiresAt } = JSON.parse(sessionData);
//             if (Date.now() < expiresAt) {
//                 navigate('/dashboard');
//             } else {
//                 sessionStorage.removeItem('authSession');
//             }
//         }
//     }, []); // Empty depend// Empty array ensures it runs only once, on moun

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = 'Invalid email format';
//         }

//         if (!formData.password.trim()) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.trim().length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//         if (serverError) setServerError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setServerError('');

//         if (!validateForm()) return;

//         setIsLoading(true);

//         try {
//             const response = await fetch('http://localhost:5000/api/users/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//                 credentials: "include"
//             });

//             const contentType = response.headers.get('content-type');
//             if (!contentType || !contentType.includes('application/json')) {
//                 const text = await response.text();
//                 throw new Error(`Expected JSON, got: ${text.substring(0, 100)}...`);
//             }

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Login failed');
//             }

//             // Store session with expiration
//             const sessionData = {
//                 token: data.token,
//                 user: data.user,
//                 expiresAt: Date.now() + SESSION_TIMEOUT
//             };
//             sessionStorage.setItem('authSession', JSON.stringify(sessionData));

//             // Set up session timeout
//             setTimeout(() => {
//                 sessionStorage.removeItem('authSession');
//                 navigate('/login?sessionExpired=true');
//             }, SESSION_TIMEOUT);

//             navigate('/dashboard');

//         } catch (error) {
//             console.error('Login error:', error);
//             setServerError(error.message || 'Login failed. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-box">
//                 <h2>Welcome Back</h2>
//                 <p className="subtitle">Please sign in to continue</p>
                
//                 {serverError && (
//                     <div className="server-error">
//                         <AlertCircle size={16} />
//                         <span>{serverError}</span>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} noValidate>
//                     <div className="form-group">
//                         <label htmlFor="email">Email Address</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className={errors.email ? 'input-error' : ''}
//                             placeholder="your@email.com"
//                             autoComplete="username"
//                             disabled={isLoading}
//                         />
//                         {errors.email && (
//                             <span className="error-message">
//                                 <AlertCircle size={14} />
//                                 {errors.email}
//                             </span>
//                         )}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className={errors.password ? 'input-error' : ''}
//                             placeholder="••••••••"
//                             autoComplete="current-password"
//                             disabled={isLoading}
//                         />
//                         {errors.password && (
//                             <span className="error-message">
//                                 <AlertCircle size={14} />
//                                 {errors.password}
//                             </span>
//                         )}
//                     </div>

//                     <button
//                         type="submit"
//                         className={`login-button ${isLoading ? 'loading' : ''}`}
//                         disabled={isLoading}
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Spinner size={18} className="spinner" />
//                                 Signing in...
//                             </>
//                         ) : 'Sign In'}
//                     </button>
//                 </form>

//                 <div className="login-footer">
//                     <div className="footer-links">
//                         <a href="/forgot-password">Forgot password?</a>
//                         <span>•</span>
//                         <a href="/register">Create account</a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
