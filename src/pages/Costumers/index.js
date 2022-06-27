import { useState, useEffect, useContext } from 'react';
import { FiUser, FiDelete,FiEdit2 } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './costumers.css'
import { AuthContext } from '../../contexts/auth';
export default function Costumers() {

    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [clientes, setClientes] = useState([]);
    const { loggedUser } = useContext(AuthContext);
    const [uid] = useState(loggedUser && loggedUser.uid);

    useEffect(()=>{

        async function loadClientes(uid) {
          const response = await fetch("http://127.0.0.1:8080/cliente/" + uid);
          const json = await response.json();
          setClientes(json)
            
        }

        loadClientes(uid)
        
    },[]);

    async function handleSubmit(e){

        e.preventDefault();
        const hoje = new Date()
        const dataCadastro = hoje.getDate()+'/'+(hoje.getMonth()+1)+'/'+hoje.getFullYear()
        
        const request = {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"nome": nome, "cnpj": cnpj, "endereco": endereco, "dataCadastro": dataCadastro})
        }

        const response = await fetch("http://127.0.0.1:8080/cliente/" + uid, request)
        const data = await response.json();

        if (response.ok) {
            setClientes([...clientes, data])
        }
        
    }

    async function excluir(id){

        const request = {
            mode: 'cors',
            method: 'DELETE',
        }

        const response = await fetch("http://127.0.0.1:8080/cliente/" + uid + "/" + id, request)
        if (response.ok) {
            setClientes(clientes.filter((cliente) => cliente.id !== id))
        }
    
     }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Clientes">
                    <FiUser size={25} />
                </Title>


                <div className="container">
                    <form onSubmit={(e)=>{handleSubmit(e)}} className="form-profile costumers">
                        <label>Nome</label>
                        <input placeholder="Digite o Nome Fantasia" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>CNPJ</label>
                        <input placeholder="Digite o CNPJ" type="text" value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />

                        <label>Endereço</label>
                        <input placeholder="Digite o seu Endereço" type="text" value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />

                        <button className="button-costumers" type="submit">Salvar</button>
                    </form>
                </div>
                <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">CNPJ</th>
                  <th scope="col">Endereço</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                  {clientes.map((cliente, index)=>{
                      return(
                        <tr key={index}>
                        <td data-label="Cliente">{cliente.nome}</td>
                        <td data-label="CNPJ">{cliente.cnpj}</td>
                        <td data-label="Endereço">{cliente.endereco}</td>
                        <td data-label="Cadastrado">{cliente.dataCadastro}</td>
                        <td data-label="#">
                          <button onClick={()=>{excluir(cliente.id)}} className="action" style={{backgroundColor: '#3583f6' }}>
                            <FiDelete color="#FFF" size={17} />
                          </button>
                          <button className="action" style={{backgroundColor: '#F6a935' }}>
                            <FiEdit2 color="#FFF" size={17} />
                          </button>
                        </td>
                      </tr>
                      );
                  })}
                
              </tbody>
            </table>
            </div>
        </div>
    );
}