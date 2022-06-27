import './header.css'
import avatar from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth';
import { useState, useContext } from 'react';

function Header() {

    const { loggedUser } = useContext(AuthContext);

    const labelLoggedUser = {
        color: 'white',
    }

    return (
        <div className="sidebar">
            <div>
                <img alt="Foto Avatar" src={avatar} />
                <label style={labelLoggedUser}>{loggedUser.email}</label>
            </div>
            <Link to="/dashboard">
                <FiHome color="#FFF" size={24} />
            Chamados
        </Link>
            <Link to="/costumers">
                <FiUser color="#FFF" size={24} />
            Clientes
        </Link>
            <Link to="/profile">
                <FiSettings color="#FFF" size={24} />
            Configurações
        </Link>

        </div>
    );


}
export default Header;