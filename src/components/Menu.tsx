import { Outlet, useLocation, useMatch } from "react-router-dom";
import "./Menu.css";
import { Link } from "react-router-dom";
import Chart from "../assets/Chart";
import Facture from "../assets/Facture";

import {
  IonToolbar,
} from "@ionic/react";
import SignOut from "../assets/signOut";
import VenteIco from "../assets/VenteIco";
import AchatIcon from "../assets/AchatIcon";
import FournisseursIcon from "../assets/FournisseursIcon";
import ProduitIcon from "../assets/ProduitIcon";
const Menu: any = () => {
  function ActiveNavigation2({ to, children }: any) {
    const match2 = useMatch(to);
    return (
      <Link
        to={to}
        className={
          match2
            ? "text-blue-600  scale-125 lg:p-4 font-bold rounded-lg"
            : "text-slate-500 hover:text-slate-100  transition duration-300 hover:no-underline"
        }
      >
        {children}
      </Link>
    );
  }
  function ActiveNavigation({ to, children }: any) {
    const match = useMatch(to);
    return (
      <Link
        to={to}
        className={
          match
            ? " flex w-[210px] gap-4  bg-slate-500 hover:bg-slate-600 hover:transition hover:duration-300 text-slate-200 hover:text-slate-200 hover:no-underline lg:p-4 font-bold rounded-lg"
            : " flex w-[210px] gap-4  hover:bg-slate-700 hover:transition hover:duration-300 hover:text-slate-200 text-slate-400 font-bold hover:no-underline lg:p-4 rounded-lg scale-90"
        }
      >
        {children}
      </Link>
    );
  }
  const location = useLocation();

  return (
    <div className="absolute apple w-full h-full flex flex-col lg:grid lg:grid-cols-8 lg:gap-0">
      {/* Wide view menu */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="flex flex-col gap-5 items-center justify-center h-full">
          <ActiveNavigation to="/page">
            <Chart />
            Tableaux de bord
          </ActiveNavigation>
          <ActiveNavigation to="/page/Fournisseurs">
            <FournisseursIcon />
            Fournisseurs
          </ActiveNavigation>
          <ActiveNavigation to="/page/Produits">
            <ProduitIcon />
            Produits
          </ActiveNavigation>
          <ActiveNavigation to="/page/Achat">
            <AchatIcon />
            Achat de Produits
          </ActiveNavigation>
          <ActiveNavigation to="/page/Vente">
            <VenteIco />
            Vente de Produits
          </ActiveNavigation>
          <ActiveNavigation to="/page/Historique">
            <Facture />
            Historique
          </ActiveNavigation>
          <Link to="/" className="flex w-[220px] gap-4  bg-red-500 hover:bg-red-700 hover:transition hover:duration-300 text-slate-200 hover:text-slate-200 hover:no-underline lg:p-4 font-bold rounded-lg">
            <SignOut />
            Se déconnecter
          </Link>
        </div>
      </div>
      {/* Mobile view menu */}
      <div className="lg:hidden apple sticky bg-gray-700 ">
        <IonToolbar>
          <div className="px-8 flex justify-between">
            <div className="flex gap-6">
              <ActiveNavigation2 to="/page">
                <Chart />
              </ActiveNavigation2>
              <ActiveNavigation2 to="/page/Fournisseurs">
                <FournisseursIcon />
              </ActiveNavigation2>
              <ActiveNavigation2 to="/page/Produits">
                <ProduitIcon />
              </ActiveNavigation2>
              <ActiveNavigation2 to="/page/Achat">
                <AchatIcon />
              </ActiveNavigation2>
              <ActiveNavigation2 to="/page/Vente">
                <VenteIco />
              </ActiveNavigation2>
              <ActiveNavigation2 to="/page/Historique">
                <Facture />
              </ActiveNavigation2>
            </div>
            <div>
              <Link to="/" className="text-red-500">
                <SignOut />
              </Link>
            </div>
          </div>
        </IonToolbar>
      </div>

      <Outlet />
    </div>
  );
};
export default Menu;
