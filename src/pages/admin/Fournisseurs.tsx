import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { search } from "ionicons/icons";
import FournisseursIcon from "../../assets/FournisseursIcon";
import { toast, ToastContainer } from "react-toastify";

type Fournisseurs = {
  idFour: number | null;
  nomSociete: string;
  nomGerant: string;
  email: string;
  Tel: number | undefined;
  logo: string;
};

const Fournisseurs = () => {
  const [fours, setFours] = useState<Fournisseurs[]>([]);
  const [four, setFour] = useState({
    // ampesaina am formData sy ny input ao am formulaire
    nomSociete: "",
    nomGerant: "",
    email: "",
    Tel: "",
  });
  const [logoEdit, setLogoEdit] = useState<string | null>(null); // sary kely rehefa modif
  const [logoFile, setLogoFile] = useState<File | null>(null); // fichier sary
  const [idFour, setIdFour] = useState<number | null>(null); //ho an condition post sy put, refa misy de put, refa tsis de post

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:2000/AfficherTousFour").then((res) => {
      setFours(res.data);
    });
  };

  /* submit form */
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    /* ampidirina tsirairay anaty formData ny anaty four */
    for (const [name, value] of Object.entries(four)) {
      formData.append(name, value);
    }

    /* rehefa misy sary alefa */
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    /* condition ajout na modifier */
    if (!idFour) {
      axios
        .post("http://localhost:2000/createFour", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          fetchData();
          setLogoFile(null);
        });
    } else {
      axios
        .put(`http://localhost:2000/updateFour/${idFour}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          fetchData();
          setLogoFile(null);
          setLogoEdit(null);
        });
    }

    setFour({
      nomSociete: "",
      nomGerant: "",
      email: "",
      Tel: "",
    });

    toast.success("Fournisseur modifié avec succès!");
  };

  /* rehefa miova ny input tsirairay dia miova ny four*/
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFour((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  /* rehefa mampiditra sary */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLogoFile(files[0]);
    }
  };

  /* rehefa manindry bouton Modifier */
  const handleEdit = (data: any) => {
    const { idFour, logo, ...other } = data;
    setLogoEdit("http://localhost:2000/" + logo); // src anle sary kely
    setIdFour(idFour); // lasa put ny method ao am handleSubmit
    setFour(other); // ampidirina ao le donnée tao am tableau izay mitovy amle state initial ligne 15
  };

  /* rehefa supprimer */
  const handleDelete = (id: number | null) => {
    axios.delete(`http://localhost:2000/deleteFour/${id}`).then((response) => {
      console.log(response);
      fetchData();
    });
  };

  /* recherche */
  const handleSearch = (search: string | null) => {
    if (search) {
      axios
        .get(`http://localhost:2000/recRehetraFour/${search}`)
        .then((res) => {
          setFours(res.data);
        });
    } else {
      fetchData();
    }
  };

  return (
    <div className="apple lg:col-span-7 overflow-y-scroll">
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <IonToolbar className="text-center">
        <IonTitle className="tracking-widest uppercase">
          <div className="flex titre font-bold gap-4 justify-center">
            <FournisseursIcon />
            Fournisseurs
          </div>
        </IonTitle>
      </IonToolbar>
      <div className=" lg:grid lg:grid-cols-2">
        <div className="p-8">
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                name="nomSociete"
                value={four.nomSociete}
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Nom de la société fournisseur
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                name="nomGerant"
                value={four.nomGerant}
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Nom du Gérant
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                name="email"
                value={four.email}
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Email de la société
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                name="Tel"
                value={four.Tel}
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Numero téléphone
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              {logoEdit && (
                <img src={logoEdit} className="w-20 h-20 rounded" alt="logo" />
              )}
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="logo"
                type="file"
                onChange={handleFileChange}
                name="logo"
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
        <div className="p-8 lg:translate-y-32 lg:translate-x-40 lg:w-2/3">
          <div>
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
      </div>
      <div className=" p-4 lg:p-16">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-slate-100 ">
            <thead className="text-xs text-slate-300 uppercase bg-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Logo
                </th>
                <th scope="col" className="px-6 py-3">
                  Nom de la société
                </th>
                <th scope="col" className="px-6 py-3">
                  Nom du Gérant
                </th>
                <th scope="col" className="px-6 py-3">
                  Email de la société
                </th>
                <th scope="col" className="px-6 py-3">
                  Numero de téléphone
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {fours.map((d, i) => (
                <tr className="bg-gray-700 space-y-2 " key={i}>
                  <td className="pl-4">
                    <img
                      src={`http://localhost:2000/${d.logo}`}
                      className="w-20 h-20 rounded-full"
                    />
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4  text-slate-200 whitespace-nowrap font-bold"
                  >
                    {d.nomSociete}
                  </th>
                  <td className="px-6 py-4">{d.nomGerant}</td>
                  <td className="px-6 py-4">{d.email}</td>
                  <td className="px-6 py-4">{d.Tel}</td>
                  <td className="flex px-6 py-4 space-x-4">
                    <button
                      onClick={() => handleEdit(d)}
                      className="btn-xs lg:btn-md btn btn-neutral"
                    >
                      Modifier
                    </button>
                    <label
                      className="btn-xs lg:btn-md btn btn-error text-white"
                      htmlFor="my_modal_7"
                      onClick={() => window.my_modal_5.showModal()}
                    >
                      Supprimer
                    </label>
                    {/* <input
                      type="checkbox"
                      id="my_modal_7"
                      className="modal-toggle"
                    />
                    <div className="modal">
                      <div className="modal-box">
                        <h3 className="text-lg font-bold">
                          Voulez vous vraiment supprimer ?
                        </h3>
                        <div className="flex justify-center gap-4 items-center">
                          <div className="modal-action"><button className="btn btn-neutral" onClick={() => handleDelete(d.idFour)}><label htmlFor="my_modal_7">Oui</label></button></div>
                          <div className="modal-action"><button className="btn"><label htmlFor="my_modal_7">non</label></button></div>
                        </div>
                      </div>
                      <label className="modal-backdrop" htmlFor="my_modal_7">
                        Close
                      </label>
                    </div> */}

                    <dialog
                      id="my_modal_5"
                      className="modal modal-bottom sm:modal-middle mx-12"
                    >
                      <form method="dialog" className="modal-box">
                        <h3 className="text-lg text-white font-bold">
                          Voulez vous vraiment supprimer ?
                        </h3>
                        <div className="flex justify-center gap-4 items-center">
                          <div className="modal-action">
                            <button
                              className="btn btn-neutral"
                              onClick={() => handleDelete(d.idFour)}
                            >
                              <label htmlFor="my_modal_7">Oui</label>
                            </button>
                          </div>
                          <div className="modal-action">
                            <button className="btn">
                              <label htmlFor="my_modal_7" className="bg-red-200">non</label>
                            </button>
                          </div>
                        </div>
                      </form>
                    </dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fournisseurs;
