import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

type Historique = {
  idDeAchat: any;
  idAchat: any;
  idFour: any;
  idProd: any;
  ImgPro: any;
  design: any;
  PuFour: any;
  Qte: any;
  Subtotal: any;
  dateAchat: any;
};

export default function HistoriqueAchat() {
  const [history, setHistory] = useState<Historique[]>([]);
  const [hachat, setHAchat] = useState({
    // ampesaina am formData sy ny input ao am formulaire
    idAchat: "",
    idFour: "",
    idProd: "",
    ImgPro: "",
    design: "",
    PuFour: "",
    Qte: "",
    Subtotal: "",
    dateAchat: "",
  }) as any;
  const [recD, setRecD] = useState({
    // ampesaina am formData sy ny input ao am formulaire
    date1: "",
    date2: "",
  }) as any;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setRecD((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const recDate = () => {
    const { date1, date2 } = recD;

    if (date1 !== "" && date2 !== "") {
      // Effectuez la comparaison des dates ici si nécessaire
      // Par exemple, si vous voulez vérifier si date2 est postérieure à date1
      if (new Date(date2) < new Date(date1)) {
        console.log("Plage de dates non valide");
        return;
      }

      // Effectuez l'appel à l'API avec la plage de dates sélectionnée
      axios
        .get(`http://localhost:2000/recAchatDate/${date1}/${date2}`)
        .then((res) => {
          console.log(res.data);
          setHistory(res.data);
        })
        .catch((error) => {
          console.log("Erreur lors de la récupération des données :", error);
        });
    } else {
      fetchData(); // Appelez votre fonction fetchData ici si date1 ou date2 est vide
    }
  };
  const fetchData = () => {
    axios.get("http://localhost:2000/AfficherTousAchat").then((res) => {
      setHistory(res.data);
    });
  };
  const handleSearch = (search: string | null) => {
    if (search) {
      axios
        .get(`http://localhost:2000/recRehetraDetAchat/${search}`)
        .then((res) => {
          setHistory(res.data);
        });
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="apple space-y-4">
      <div className="px-4 lg:px-16 ">
        <div className=" flex justify-center">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Rechercher Fournisseur..."
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 px-4 lg:px-16">
        <input
          type="date"
          name="date1"
          value={recD.date1}
          onChange={handleChange}
          className="bg-gray-500 rounded-lg w-full"
        ></input>
        <input
          type="date"
          name="date2"
          value={recD.date2}
          onChange={handleChange}
          className="bg-gray-500 rounded-lg w-full"
        ></input>
        <button className="btn btn-info" onClick={recDate}>
          Recherche
        </button>
      </div>
      <div className=" p-4 lg:p-16">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-slate-100">
            <thead className="text-xs text-slate-200 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Image produit
                </th>
                <th scope="col" className="px-6 py-3">
                  Id Achat
                </th>
                <th scope="col" className="px-6 py-3">
                  Id Fournisseur
                </th>
                <th scope="col" className="px-6 py-3">
                  Id Produit
                </th>

                <th scope="col" className="px-6 py-3">
                  Design
                </th>
                <th scope="col" className="px-6 py-3">
                  Prix Unitaire
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantité
                </th>
                <th scope="col" className="px-6 py-3">
                  Sous-total
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((d: any, i: any) => (
                <tr className="bg-gray-700" key={i}>
                  <img
                    src={`http://localhost:2000/${d.ImgPro}`}
                    className="w-20 h-20 rounded-full"
                  />
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap dark:text-white"
                  >
                    {d.idAchat}
                  </th>
                  <td className="px-6 py-4">{d.idFour}</td>
                  <td className="px-6 py-4">{d.idProd}</td>
                  <td className="px-6 py-4">{d.design}</td>
                  <td className="px-6 py-4">{d.PuFour}</td>
                  <td className="px-6 py-4">{d.Qte}</td>
                  <td className="px-6 py-4">{d.Subtotal}</td>
                  <td className="px-6 py-4">{d.dateAchat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
