// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import '../styles/login.css';

// // const Login = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const TEST_CREDENTIALS = {
// //     email: 'admin@example.com',
// //     password: 'admin123'
// //   };

  

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError('');
    
// //     try {
// //       if (!email || !password) {
// //         setError('Please fill in all fields');
// //         return;
// //       }

// //       if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
// //         // Mock user data
// //         const mockUser = {
// //           id: '1',
// //           name: 'Admin User',
// //           email: email,
// //           role: 'admin'
// //         };
        
// //         sessionStorage.setItem('user', JSON.stringify(mockUser));
// //         sessionStorage.setItem('isAuthenticated', 'true');
// //         navigate('/chat');
// //       } else {
// //         setError('Invalid credentials. Use admin@example.com / admin123');
// //       }

// //   //     const response = await fetch('http://localhost:5000/api/users/login', {
// //   //       method: 'POST',
// //   //       headers: {
// //   //         'Content-Type': 'application/json',
// //   //       },
// //   //       body: JSON.stringify({ email, password }),
// //   //     });

// //   //     const data = await response.json();

// //   //     if (response.ok) {
// //   //       sessionStorage.setItem('user', JSON.stringify(data.user));
// //   //       sessionStorage.setItem('isAuthenticated', 'true');
// //   //       navigate('/dashboard');
// //   //     } else {
// //   //       setError(data.error || 'Invalid credentials. Please try again.');
// //   //     }
// //   //   } catch (err) {
// //   //     setError('Network error. Please check your connection and try again.');
// //   //   } finally {
// //   //     setIsLoading(false);
// //   //   }
// //   // };
// // } catch (err) {
// //   setError('Network error. Please check your connection and try again.');
// // } finally {
// //   setIsLoading(false);
// // }

// //   return (
// //     <div className="login-container">
// //       <div className="login-content">
// //         <div className="login-header">
// //           <h2>Shield AI</h2>
// //           <h1>Welcome Back</h1>
// //           <p className="login-subtitle">Sign in to your account to continue</p>
// //         </div>

// //         {error && (
// //           <div className="error-banner">
// //             <AlertCircle size={18} />
// //             <span>{error}</span>
// //           </div>
// //         )}

// //         <form onSubmit={handleLogin} className="login-form">
// //           <div className="form-group">
// //             <label htmlFor="email">
// //               <Mail size={18} className="icon" />
// //               Email Address
// //             </label>
// //             <input
// //               id="email"
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="Enter your email"
// //               disabled={isLoading}
// //               required
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label htmlFor="password">
// //               <Lock size={18} className="icon" />
// //               Password
// //             </label>
// //             <input
// //               id="password"
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               placeholder="Enter your password"
// //               disabled={isLoading}
// //               required
// //             />
// //           </div>

// //           <div className="form-actions">
// //             <div className="remember-me">
// //               <input type="checkbox" id="remember" />
// //               <label htmlFor="remember">Remember me</label>
// //             </div>
// //             <a href="/forgot-password" className="forgot-password">
// //               Forgot password?
// //             </a>
// //           </div>

// //           <button
// //             type="submit"
// //             className="login-button"
// //             disabled={isLoading}
// //           >
// //             {isLoading ? (
// //               <>
// //                 <Loader className="spinner" size={18} />
// //                 Signing in...
// //               </>
// //             ) : (
// //               'Sign in'
// //             )}
// //           </button>
// //         </form>

// //         <div className="login-footer">
// //           <p>Don't have an account? <a href="/register">Create one</a></p>
// //           <p className="terms">
// //             By signing in, you agree to our{' '}
// //             <a href="/terms">Terms of Service</a> and{' '}
// //             <a href="/privacy">Privacy Policy</a>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // };

// // export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/login.css';
// import axios from 'axios';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

 
// const handleLogin = async (e) => {}

//   return (
//     <div className="login-container">
//       <div className="login-content">
//         <div className="login-header">
//           <h2>ShieldSurround</h2>
//           <h1>Welcome Back</h1>
//           <p className="login-subtitle">Sign in to your account to continue</p>
//         </div>

//         {error && (
//           <div className="error-banner">
//             <AlertCircle size={18} />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="login-form">
//           <div className="form-group">
//             <label htmlFor="email">
//               <Mail size={18} className="icon" />
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               disabled={isLoading}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">
//               <Lock size={18} className="icon" />
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               disabled={isLoading}
//               required
//             />
//           </div>

//           <div className="form-actions">
//             <div className="remember-me">
//               <input type="checkbox" id="remember" />
//               <label htmlFor="remember">Remember me</label>
//             </div>
//             <a href="/forgot-password" className="forgot-password">
//               Forgot password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="login-button"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <Loader className="spinner" size={18} />
//                 Signing in...
//               </>
//             ) : (
//               'Sign in'
//             )}
//           </button>
//         </form>

//         <div className="login-footer">
//           <p>Don't have an account? <a href="/register">Create one</a></p>
//           <p className="terms">
//             By signing in, you agree to our{' '}
//             <a href="/terms">Terms of Service</a> and{' '}
//             <a href="/privacy">Privacy Policy</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response Data:', data); // Debugging line
      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      // Store user in session with a 30-minute expiration
      const sessionData = {
        user: data.user, // Use actual user data from backend
        expiresAt: new Date().getTime() + 30 * 60 * 1000, // 30 minutes
      };
      console.log('Session Data:', sessionData); // Debugging line
      sessionStorage.setItem('session', JSON.stringify(sessionData));
      sessionStorage.setItem('isAuthenticated', 'true');

      navigate('/chat'); // Redirect to chat after successful login
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h2>ShieldSurround</h2>
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} className="icon" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} className="icon" />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="spinner" size={18} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

