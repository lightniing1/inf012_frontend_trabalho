import { useState, createContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import auth from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, onAuthStateChanged, reload, signInWithEmailAndPassword, signOut, updateCurrentUser } from 'firebase/auth';

export const AuthContext = createContext({});


function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loggedUser, setLoggedUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [uid_user, setUid_user] = useState(loggedUser && loggedUser.uid);
    const [avatarUrl, setAvatarUrl] = useState('');

    /*
    useEffect(() => {
        function loadUser() {
            const storagedUser = localStorage.getItem("usuarioLogado");
            if (storagedUser) {
                setUser(JSON.parse(storagedUser));
                //setLoading(true);
            }
            //setLoading(false);
        }
        loadUser();
    }, []);
    */
    
    useEffect(() => {
        async function checkLogin() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedUser (
                        {
                            uid: user.uid,
                            email: user.email,
                            avatarUrl: null
                        }
                    )
                } else {
                    setLoggedUser({});
                    }
                })
            }

    checkLogin();

    }, [])

    function signUp(email, password, nome) {
        setLoading(true);
        //console.log(loggedUser)
        const usuario = createUserWithEmailAndPassword(auth, email, password)
        return usuario
        //Está apenas registrando! Não está salvando usuario no banco
    }

    function signIn(email, password) {
        
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
        //Fazer Login no firebase
    }


    function logout() {
        return signOut(auth)
        //Fazer logout no firebase

    }

    function setLocalUser(){
        //localStorage.setItem('usuarioLogado', JSON.stringify(data));
        //return updateCurrentUser(auth)
        //console.log(localStorage.getItem("usuarioLogado")
        return reload(loggedUser)
    }

    async function registerUserOnBackend(uid, name) {
        //console.log(typeof uid)
        const request = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({uid, name})
        };

        const response = await fetch("http://127.0.0.1:8080/usuario/", request)
        const data = await response.json()
        //console.log(data)
      }

    async function loadAvatar(uid) {
        
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            signUp,
            logout,
            signIn,
            loading,
            setLoading,
            setUser,
            setLocalUser,
            loggedUser,
            setLoggedUser,
            registerUserOnBackend,
            avatarUrl
        }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;