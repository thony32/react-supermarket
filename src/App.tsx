import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login";
import Fournisseurs from "./pages/admin/Fournisseurs";
import Achat from "./pages/admin/Achat";
import Vente from "./pages/admin/Vente";
import Dashboard from "./pages/admin/Dashboard";
import Produits from "./pages/admin/Produits";
import Historique from "./pages/admin/Historique";
import HistoriqueAchat from "./pages/admin/HistoriqueAchat";
import HistoriqueVente from "./pages/admin/HistoriqueVente";

setupIonicReact();

const App: React.FC = () => {
  return (
    

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/page" element={<Menu/>}>
          <Route index element={<Dashboard/>}></Route>
          <Route path="Fournisseurs" element={<Fournisseurs/>}></Route>
          <Route path="Produits" element={<Produits/>}></Route>
          <Route path="Achat" element={<Achat/>}></Route>
          <Route path="Vente" element={<Vente/>}></Route>
          <Route path="Historique" element={<Historique/>}>
            <Route index element={<HistoriqueAchat/>}></Route>
            <Route path="vente" element={<HistoriqueVente/>}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>

    
  );
};

export default App;
