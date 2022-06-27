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
    const [edicao, setEdicao] = useState(false);
    const [clienteId, setClienteId] = useState('');
    const { loggedUser } = useContext(AuthContext);
    const [uid] = useState(loggedUser && loggedUser.uid);
    const [textoBotao, setTextoBotao] = useState('Salvar')

    useEffect(()=>{

        async function loadClientes(uid) {
          const response = await fetch("http://127.0.0.1:8080/cliente/" + uid);
          const json = await response.json();
          setClientes(json)
            
        }

        loadClientes(uid)
        
    },[]);

    async function handleUpdate(e, id){
        
        setEdicao(false)
        setTextoBotao("Salvar")

        e.preventDefault();

        const response = await fetch("http://127.0.0.1:8080/cliente/" + uid + "/" + id);
        const data = await response.json();
    
        const update = {
            ...data, 
            nome: nome,
            cnpj: cnpj,
            endereco: endereco
        }
    
        const request = {
            mode: 'cors',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
        }
    
        const response_update = await fetch("http://127.0.0.1:8080/cliente/" + uid + "/" + id, request)
        const data_update = await response_update.json();
    
        if(response_update.ok){
            setClientes([...clientes, data_update])
        }
    
      }

    async function handleSubmit(e){

        e.preventDefault();
      
        const request = {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"nome": nome, "cnpj": cnpj, "endereco": endereco})
        }

        const response = await fetch("http://127.0.0.1:8080/cliente/" + uid, request)
        const data = await response.json();

        if (response.ok) {
            setClientes([...clientes, data])
            toast.success("Cliente cadastrado com sucesso!")
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
            toast.success("Cliente excluído")
        }
    
     }

    function edita(id, nome, endereco, cnpj) {
        setNome(nome);
        setEndereco(endereco);
        setCnpj(cnpj);
        setClienteId(id);
        setEdicao(true);
        setTextoBotao('Editar')
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Clientes">
                    <FiUser size={25} />
                </Title>


                <div className="container">
                    <form onSubmit={edicao === true ? (e)=>{handleUpdate(e, clienteId)} : (e)=>{handleSubmit(e)}} className="form-profile costumers">
                        <label>Nome</label>
                        <input placeholder="Digite o Nome Fantasia" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>CNPJ</label>
                        <input placeholder="Digite o CNPJ" type="text" value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />

                        <label>Endereço</label>
                        <input placeholder="Digite o seu Endereço" type="text" value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />

                        <button className="button-costumers" type="submit">{textoBotao}</button>
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
                          <button onClick={() => edita(cliente.id, cliente.nome, cliente.endereco, cliente.cnpj)}className="action" style={{backgroundColor: '#F6a935' }}>
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