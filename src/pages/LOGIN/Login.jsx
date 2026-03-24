import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../services/authService';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Criar Conta' : 'Login'}</h2>
        
        {isSignup && (
          <input
            type="text"
            placeholder="Nome"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : isSignup ? 'Criar' : 'Entrar'}
        </button>
        
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Já tem conta? Login' : 'Criar nova conta'}
        </button>
      </form>
    </div>
  );
}