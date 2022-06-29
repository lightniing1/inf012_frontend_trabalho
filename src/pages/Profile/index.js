
import { useState, useContext, useEffect } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { FiSettings, FiUpload } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

export default function Profile(){
  const { loggedUser, logout} = useContext(AuthContext);
  const [nome, setNome] = useState('');
  const [email] = useState(loggedUser && loggedUser.email);
  const [uid] = useState(loggedUser && loggedUser.uid);
  const [avatarUrl, setAvatarUrl] = useState(loggedUser && loggedUser.avatarUrl);
  const [imageAvatar, setImageAvatar]=useState(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState();
  const history = useNavigate();

  useEffect(() => {
      
    async function fetchData(uid) {
      console.log(uid)
      const response = await fetch("http://127.0.0.1:8080/usuario/" + uid);
      const json = await response.json();
      setNome(json.name)
    }
    fetchData(uid)
  }, [])

  async function handleFile(e) {


    
  }

  async function handleSave(e){
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8080/usuario/" + uid);
    const data = await response.json();

    const update = {
        ...data, 
        name: nome
    }

    const request = {
        mode: 'cors',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
    }

    const response_update = await fetch("http://127.0.0.1:8080/usuario/" + uid, request)
    //const data_update = await response_update.json();

    if(response_update.ok){
        console.log("Atualizado")
        //console.log(data_update)
    }

  }

  async function handleUpload(e){
  
    setArquivoSelecionado({ selectedFile: e.target.files[0] })
    console.log(arquivoSelecionado)

    const formData = new FormData();
		formData.append('file', arquivoSelecionado.selectedFile);

    const request = {
      mode: 'cors',
			method: 'POST',
			body: formData
      }

    const response = await fetch("http://127.0.0.1:8080/usuario/profile-picture/" + uid, request)
    //const data = await response.json();

    if(response.ok){
      console.log("Upload realizado")
  }

  }

  async function handleLogOut() {

    try {
      await logout()
      history('/')
    } catch (error) {
      console.log('erro')
      console.log(error)
    }

  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Meu perfil">
          <FiSettings size={25} />
        </Title>


        <div className="container">
          <form onSubmit={(e)=>handleSave(e)} className="form-profile">
            <label className="label-avatar">
              <span>
                <FiUpload color="#000" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={handleUpload}/><br/>
              { avatarUrl === null ? 
                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
                :
                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              }
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />     

            <button type="submit">Salvar</button>       

          </form>
        </div>

        <div className="container">
            <button className="logout-btn" onClick={handleLogOut} >
               Sair
            </button>
        </div>

      </div>
    </div>
  )
}