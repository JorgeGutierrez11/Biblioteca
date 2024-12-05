import React, { useEffect, useState } from 'react';
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getAllUsuarios } from '../api/book.api';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import '../styles/Login.css';

const Login = () => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const { login } = useAuth(); 

    useEffect(() => {
        async function loadUsers() {
            const res = await getAllUsuarios();
            setUsers(res.data);
            // console.log(res.data);
        }
        loadUsers();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const userFound = users.find(
            (user) => user.codigo === code && user.contraseña === password
        );
        
        if (userFound) {
            login(userFound); 
            navigate('/show'); 
        } else {
            alert('Código o contraseña incorrectos');
        }
    };

    return (
        <div className="wrapper-container">
            <div className='wrapper'>
                <form onSubmit={handleLogin}>
                    <h1>BookUIS</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Código'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                        <FaUserAlt className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder='Contraseña'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
