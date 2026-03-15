import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/api/auth/login/', {
        email,      // ✅ Fixed: send 'email' not 'username'
        password
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      alert("Login Successful!");
      navigate('/');
      window.location.reload();

    } catch (error) {
      console.error(error);
      const errorMessage = error.response && error.response.data.detail
        ? error.response.data.detail
        : "Invalid Credentials. (Did you Register first?)";
      alert(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-center">Login</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;