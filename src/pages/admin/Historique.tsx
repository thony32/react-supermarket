import { IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import Facture from '../../assets/Facture'
import { Link, Outlet, useMatch } from 'react-router-dom';

const Historique = () => {
  function ActiveHistory({ to, children }: any) {
    const match2 = useMatch(to);
    return (
      <Link
        to={to}
        className={
          match2
            ? "text-slate-100 p-4 bg-slate-400 lg:w-48 w-1/2 hover:no-underline rounded-lg font-bold hover:text-slate-100 hover:bg-slate-600 hover:transition hover:duration-300"
            : "text-slate-100 p-4 lg:w-48 w-1/2 hover:no-underline rounded-lg hover:text-slate-100 hover:bg-slate-600 hover:transition hover:duration-300"
        }
      >
        {children}
      </Link>
    );
  }
  return (
    <div className='apple lg:col-span-7 space-y-4 overflow-y-scroll'>
      <IonToolbar className="text-center"  >
        <IonTitle className="tracking-widest uppercase">
          <div className='flex titre font-bold gap-4 justify-center'>
            <Facture/>
            Historique
          </div>
        </IonTitle>
      </IonToolbar>
      <div className='space-y-4'>
        <div className='sticky flex px-4 justify-center w-full gap-8'>
          <ActiveHistory to="/page/Historique">
            Historique des achats
          </ActiveHistory>
          <ActiveHistory to="/page/Historique/vente">
            Historique des ventes
          </ActiveHistory>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Historique