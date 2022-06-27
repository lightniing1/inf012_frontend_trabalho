
import './dashboard.css';
import { useState, useEffect, useContext, useLocation } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);
  const { loggedUser } = useContext(AuthContext);
  const [uid] = useState(loggedUser && loggedUser.uid);
  const navigate = useNavigate();

  useEffect(()=>{

    async function loadChamados(uid) {
      const response = await fetch("http://127.0.0.1:8080/chamado/" + uid);
      const json = await response.json();
      setChamados(json)
        
    }

    loadChamados(uid)
    
},[]);

    const redirect = (chamadoid) => {
        navigate('/new', {
            state: {
                chamado_id: chamadoid,
                update: true
            }
        });
    }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        )  : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((chamado, index) => {
                  return (
                <tr key={index}>
                  <td data-label="Cliente">{chamado.nome_cliente}</td>
                  <td data-label="Assunto">{chamado.assunto}</td>
                  <td data-label="Status">
                    <span className="badge" style={{backgroundColor: '#5cb85c' }}>{chamado.status}</span>
                  </td>
                  <td data-label="Cadastrado">20/06/2021</td>
                  <td data-label="#">
                    <button className="action" style={{backgroundColor: '#3583f6' }}>
                      <FiSearch color="#FFF" size={17} />
                    </button>
                    <button className="action" onClick={() => redirect(chamado.id)} style={{backgroundColor: '#F6a935' }}>
                      <FiEdit2 color="#FFF"  size={17} />
                    </button>
                  </td>
                </tr>
                )
              })}
              </tbody>
            </table>
          </>
        )}

      </div>

    </div>
  )
}