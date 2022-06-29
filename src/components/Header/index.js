import './header.css'
import avatar from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth';
import { useState, useContext } from 'react';

function Header() {

    const { loggedUser } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(null);
    
    async function exibeImagem(uid) {

        const response_update = await fetch("http://127.0.0.1:8080/usuario/profile-picture/" + uid)
        const data_update = await response_update.json();
    
        if(response_update.ok){ 
          //loadAvatar(data_update.profile_pic)
          setAvatarUrl("")
          setAvatarUrl("http://127.0.0.1:8080/static/" + data_update.profile_pic)
          return true
        } else {
          setAvatarUrl(null)
          return false
        }
    
      }

    const labelLoggedUser = {
        color: 'white',
    }

    return (
        <div className="sidebar">
            <div>
                <img alt="Foto Avatar" src={exibeImagem(loggedUser.uid) ? avatarUrl : avatarUrl} />
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