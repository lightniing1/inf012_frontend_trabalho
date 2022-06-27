import './signin.css'
import logo from '../../assets/login.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react';
import {AuthContext} from '../../contexts/auth';
import { toast } from 'react-toastify';

function SignIn() {
    const [email, setEmail]=useState('');
    const [senha, setSenha]=useState('');
    const {signIn, loading, setLoading} = useContext(AuthContext);
    const history = useNavigate();

    async function handleSubmit(e){
      e.preventDefault();

      if (email!==''&& senha!==''){

        try {
          await signIn(email, senha)
          
          toast.success("Bem-vindo de volta")
          history("/dashboard")

        } catch (error) {
          toast.error('Erro ao fazer login');
          console.log(error);
          /*
          if(error.code === 'auth/wrong-password'){
            toast.error('Please check the Password');
          }
          if(error.code === 'auth/user-not-found'){
            toast.error('Please check the Email');
          */

        }

        setLoading(false)
      
      }
    }

    return (
      <div className="conteiner-center">
        <div className="login">
          
          <div className="login-area">
            <img src={logo} alt="Logo do Sistema"/>
          </div>
         
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" value={email} placeholder="email@email.com"  onChange={(e)=>{setEmail(e.target.value)}} />

            <input type="password" value={senha} placeholder="*****" onChange={(e)=>{setSenha(e.target.value)}}/>
            <button disabled={loading} type="submit">Acessar</button>
          </form>
         
          <Link to="/register">Criar uma conta</Link>
       
        </div>
      </div>
    );
  }
  
  export default SignIn;