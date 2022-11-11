/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';

type CadUserProps = {
    showModal():void
}

export const CadUser : NextPage<CadUserProps> = ({showModal}) =>{

          return (
            <div className='container-caduser'>
                <button onClick={showModal}>Adicionar Usuário</button>
            </div>
    );
   
}