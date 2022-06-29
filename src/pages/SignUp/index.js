import logo from '../../assets/login.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react';
import {AuthContext} from '../../contexts/auth';
import { toast } from 'react-toastify';


function SignUp() {
    const [nome, setNome]=useState('');
    const [email, setEmail]=useState('');
    const [senha, setSenha]=useState('');
    const {signUp, loading, setLoading, loggedUser, registerUserOnBackend} = useContext(AuthContext);
    const history = useNavigate();

    useEffect(() => {

    	//console.log(loggedUser.uid)
      if (loggedUser && loggedUser.uid) {
        console.log(loggedUser && loggedUser.uid)
        registerUserOnBackend(loggedUser.uid, nome, loggedUser.email)
        history('/dashboard')
		}

    }, [loggedUser])
	
    async function handleSubmit(e){
      e.preventDefault();

      if (email!==''&& senha!==''&& nome!=='')

        try {
			await signUp(email, senha, nome)

		} catch (error) {
			toast.error('Erro ao realizar o cadastro');
			/*
			if(error.code === 'auth/wrong-password'){
			toast.error('Please check the Password');
			}
			if(error.code === 'auth/user-not-found'){
			toast.error('Please check the Email');
			*/
			console.log(error);
        }

        setLoading(false)

      //Criar usario no Firebase baseado no email e senha e Salvador em um banco mysql

    }

    return (
      <div className="conteiner-center">
        <div className="login">
          
          <div className="login-area">
            <img src={logo} alt="Logo do Sistema"/>
          </div>
         
          <form onSubmit={handleSubmit}>
            <h1>Nova Conta</h1>
            <input type="text" value={nome} placeholder="Seu nome"  onChange={(e)=>{setNome(e.target.value)}} />
            <input type="text" value={email} placeholder="email@email.com"  onChange={(e)=>{setEmail(e.target.value)}} />
            <input type="password" value={senha} placeholder="*****" onChange={(e)=>{setSenha(e.target.value)}}/>
            <button disabled={loading} type="submit">Cadastrar</button>
          </form>
         
          <Link to="/">Já possui uma conta? Entre aqui!</Link>
       
        </div>
      </div>
    );
  }
  

  
  export default SignUp;