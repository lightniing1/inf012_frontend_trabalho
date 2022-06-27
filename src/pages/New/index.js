import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './new.css';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import {useLocation} from 'react-router-dom';

export default function New() {

    const [clientes, setClientes] = useState([]);
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [clienteSelecionado, setClienteSelecionado] = useState(0);
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState("1");
    const [complemento, setComplemento] = useState('');
    const { loggedUser } = useContext(AuthContext);
    const [uid] = useState(loggedUser && loggedUser.uid);
    const location = useLocation();

    //Retorna null se não foi clicado do dashbaord
    if (location.state !== null) {
        console.log(location.state.chamado_id)
        console.log(location.state.update)
    }


    useEffect(()=>{

        async function loadClientes(uid) {
          setLoadingClientes(true)
          const response = await fetch("http://127.0.0.1:8080/cliente/" + uid);
          const json = await response.json();
          setClientes(json)
          setLoadingClientes(false)
        }

        loadClientes(uid)
        
    },[]);

    async function handleChamado(e) {
        e.preventDefault();
        
        const request = {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "assunto": assunto, 
                "complemento": complemento, 
                "status": status
            })
        }

        const response = await fetch("http://127.0.0.1:8080/chamado/" + uid + '/' + clienteSelecionado, request)
        console.log(clienteSelecionado)
        const data = await response.json();

        if (response.ok) {
            toast.success("Chamado registrado")
        }
       
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form onSubmit={(e) => { handleChamado(e) }} className="form-profile">
                        <label>Cliente</label>
                        {loadingClientes ?
                            <input type="text" placeholder="Carregando..." />
                            : <select value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)}>
                                {clientes.map((item, index) => {
                                    return (<option key={index} value={item.id}>{item.nome}</option>);
                                })}
                            </select>
                        }


                        <label>Assunto</label>
                        <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                            <option value="Suporte">Suporte</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Visita">Visita</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="1"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "1"} />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="2"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "2"} />
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="3"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "3"} />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text"
                            placeholder="Descreva seu problema aqui"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)} />

                        <button type="submit">Registrar</button>
                    </form>

                </div>

            </div>
        </div>
    );
}