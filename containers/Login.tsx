/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';
import { Modal } from 'react-bootstrap';
import { Filter } from '../components/Filter';
import { Footer } from '../components/Footer';
import { CadUser } from '../components/CadUser';

//type LoginProps = {
//    setAccessToken(s:string) : void,
//    showModal():void
//}
type LoginProps = {
    setAccessToken(s:string) : void
}

//export const Login : NextPage<LoginProps> = ({setAccessToken,showModal}) =>{
export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEMail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [errorUser, setErrorUser] = useState('');
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setErrorUser('');
        setName('');
        setEMail('');
        setPassword('');
        setRePassword('');
    }

    const insertUser = async() => {
        try{
            if(!name || !email || !password){
                return setErrorUser('Favor preencher os campos.');
            }

            if(password != rePassword){
                return setErrorUser('Senhas informadas devem ser iguais.');
            }

            setLoading(true);

            const body = {
                name,
                email,
                password
            };

            await executeRequest('user', 'POST', body);
            //await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao cadastrar Usuário:', e);
            if(e?.response?.data?.error){
                setErrorUser(e?.response?.data?.error);
            }else{
                setErrorUser('Ocorreu erro ao cadastrar usuário, tente novamente.');
            }
        }

        setLoading(false);
    }

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
               localStorage.setItem('accessToken', result.data.token);
               localStorage.setItem('name', result.data.name);
               localStorage.setItem('email', result.data.email);
               setAccessToken(result.data.token);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <>
        <div className='container-login'>
            <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
            <div className="form">
                {error && <p>{error}</p>}
                <div>
                    <img src='/mail.svg' alt='Login'/> 
                    <input type="text" placeholder="Login" 
                        value={email} onChange={e => setEMail(e.target.value)}/>
                </div>
                <div>
                    <img src='/lock.svg' alt='Senha'/> 
                    <input type="password" placeholder="Senha" 
                        value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                <CadUser showModal={() => setShowModal(true)}/>
            </div>
        </div>
        <Modal
                    show={showModal}
                    onHide={closeModal}
                    className="container-modal">
            <Modal.Body>
                 <p>Adicionar Usuário</p>
                 {errorUser && <p className='error'>{errorUser}</p>}
                 <input type="text" placeholder='Nome do Usuário'
                 value={name} onChange={e => setName(e.target.value)}/>
                 <input type="text" placeholder='E-mail'
                 value={email} onChange={e => setEMail(e.target.value)}/>
                 <input type="password" placeholder='Senha'
                 value={password} onChange={e => setPassword(e.target.value)}/>
                 <input type="password" placeholder='Confirmação Senha'
                 value={rePassword} onChange={e => setRePassword(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
                <div className='button col-12'>
                   <button
                   disabled={loading}
                   onClick={insertUser}
                   >   {loading? "..Carregando" : "Salvar"}</button>
                   <span onClick={closeModal}>Cancelar</span>
                </div>              
            </Modal.Footer>
        </Modal>
        </>
    );
}