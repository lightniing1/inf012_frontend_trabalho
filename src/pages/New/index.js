import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './new.css';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import {useLocation, useNavigate} from 'react-router-dom';

export default function New() {

    const [clientes, setClientes] = useState([]);
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [clienteSelecionado, setClienteSelecionado] = useState(1);
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState("0");
    const [complemento, setComplemento] = useState('');
    const { loggedUser } = useContext(AuthContext);
    const [uid] = useState(loggedUser && loggedUser.uid);
    const location = useLocation();
    const [tituloPagina, setTituloPagina] = useState("Novo Chamado")
    const [nomeBotao, setNomeBotao] = useState("Registrar")
    const [estado, setEstado] = useState(false)
    const navigate = useNavigate();

    //Retorna null se não foi clicado do dashbaord

    useEffect(()=>{

        async function loadClientes(uid) {
          setLoadingClientes(true)
          const response = await fetch("http://127.0.0.1:8080/cliente/" + uid);
          const json = await response.json();
          setClientes(json)
          setLoadingClientes(false)
        }

        if (location.state !== null) {
            setAssunto(location.state.assunto)
            //Ajeitar isso depois...
            switch (location.state.status) {
                case "EmAberto": setStatus("0"); break;
                case "EmProgresso": setStatus("1"); break;
                case "Atendido": setStatus("2"); break;
            } 
            setComplemento(location.state.complemento)
            setClienteSelecionado(location.state.cliente_id)

            if (location.state.update === true) {
                setTituloPagina("Editar chamado")
                setNomeBotao("Editar")
                setEstado(false)
            } else {
                setTituloPagina("Dados do chamado")
                setNomeBotao("Voltar para o Dashboard")
                setEstado(true)
            }
        }

        loadClientes(uid)
        
    },[]);

    async function handleCriaChamado(e) {
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

        if (response.ok) {
            toast.success("Chamado registrado")
            navigate("/dashboard")
        } else {
            toast.error("Erro ao registrar chamado")
        }
       
    }

    async function handleEditaChamado(e) {
        e.preventDefault();

        const response = await fetch("http://127.0.0.1:8080/chamado/" + uid + '/' + location.state.cliente_id + '/' + location.state.chamado_id);
        const data = await response.json();

        const update = {
            ...data, 
            assunto: assunto, 
            complemento: complemento, 
            status: status
        }
        
        const update_request = {
            mode: 'cors',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
        }

        const response_update = await fetch("http://127.0.0.1:8080/chamado/" + uid + '/' + location.state.cliente_id + '/' + location.state.chamado_id, update_request)

        if (response.ok) {
            toast.success("Chamado atualizado")
            navigate("/dashboard")
        } else {
            toast.error("Erro ao fazer atualização do chamado")
        }
       
    }

    async function handleVisualizaChamado() {
        navigate("/dashboard")

    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome={tituloPagina}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form onSubmit={location.state === null ? 
                    (e) => { handleCriaChamado(e) } : location.state.update === true ? 
                    (e) => { handleEditaChamado(e) } :
                    (e) => { handleVisualizaChamado() }} className="form-profile">
                        <label>Cliente</label>
                        {loadingClientes ?
                            <input type="text" placeholder="Carregando..." />
                            : <select disabled={location.state === null ? false : location.state.update === true ? true : true } 
                                        value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)}>
                                {clientes.map((item, index) => {
                                    return (<option key={index} value={item.id}>{item.nome}</option>);
                                })}
                            </select>
                        }

                        <label>Assunto</label>
                        <select disabled={estado} value={assunto} onChange={(e) => setAssunto(e.target.value) }>
                            <option value="Suporte">Suporte</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Visita">Visita</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="0"
                                disabled={estado}
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "0"} />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="1"
                                disabled={estado}
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "1"} />
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="2"
                                disabled={estado}
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "2"} />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text"
                            placeholder="Descreva seu problema aqui"
                            value={complemento}
                            disabled={estado}
                            onChange={(e) => setComplemento(e.target.value)} />

                        <button type="submit">{nomeBotao}</button>
                    </form>

                </div>

            </div>
        </div>
    );
}