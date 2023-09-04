import { IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import ProduitIcon from "../../assets/ProduitIcon";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
// import Produits from './Produits';

type Produit = {
  idProd: number | null;
  ImgPro: string;
  design: string;
  Pu: number | undefined;
  Stock: number | undefined;
};

const Produits = () => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [product, setProduct] = useState({
    idProd: "",
    ImgPro: "",
    design: "",
    Pu: "",
    Stock: "",
  });
  const [logoEdit, setLogoEdit] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [idProd, setIdProd] = useState<number | null>(null); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:2000/AfficherTousProduit").then((res: any) => {
      setProducts(res.data);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    for (const [name, value]  of Object.entries(product) as any)  {
      formData.append(name, value.toString());
    }

    if (logoFile) {
      formData.append("ImgPro", logoFile);
    }

    if (!idProd) {
      axios
        .post("http://localhost:2000/createProduit", formData, {
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
        .put(`http://localhost:2000/updateProduit/${idProd}`, formData, {
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

    setProduct({
      idProd: "",
      ImgPro: "",
      design: "",
      Pu: "",
      Stock: "",
    });
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProduct((prevValues :any) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLogoFile(files[0]);
    }
  };

  const handleEdit = (data: Produit) => {
    const { idProd, ImgPro, ...other } = data as any;
    setLogoEdit("http://localhost:2000/" + ImgPro);
    setIdProd(idProd); // lasa put ny method ao am handleSubmit
    setProduct(other); 
  };

  const handleDelete = (id: number | null) => {
    axios.delete(`http://localhost:2000/deleteProduit/${id}`).then((response) => {
      console.log(response);
      fetchData();
    });
  };

  const handleSearch = (search: string | null) => {
    if (search) {
      axios
        .get(`http://localhost:2000/recRehetraProduit/${search}`)
        .then((res) => {
          setProducts(res.data);
        });
    } else {
      fetchData();
    }
  };


  return (
    <div className="apple lg:col-span-7  overflow-y-scroll">
      <IonToolbar className="text-center">
        <IonTitle className="tracking-widest uppercase">
          <div className="titre font-bold flex justify-center gap-4">
            <ProduitIcon />
            Produits
          </div>
        </IonTitle>
      </IonToolbar>
      <div className=" lg:grid lg:grid-cols-2">
        <div className="p-8">

          {/* form begin */}
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={product.design}
                name="design"
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Nom du Produit
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={product.Pu}
                name="Pu"
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Prix Unitaire
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={product.Stock}
                name="Stock"
                onChange={handleChange}
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Quantité en Stock
              </label>
            </div>

            <div className="relative z-0 w-full mb-6 group">
              {logoEdit && (
                <img src={logoEdit} className="w-20 h-20 rounded" alt="logo" />
              )}
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                onChange={handleFileChange}
                type="file"
                name="ImgPro"
              />
            </div>
            <div className="flex justify-center">
            <button
                type="submit"
                className="btn btn-primary"
              >
                Enregistrer
              </button>
            </div>
          </form>

          {/* form end */}
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

      {/* table */}
      <div className=" p-4 lg:p-16">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-slate-100 ">
            <thead className="text-xs text-slate-200 uppercase bg-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Nom du Produit
                </th>
                <th scope="col" className="px-6 py-3">
                  Prix Unitaire
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantité en Stock
                </th>

                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((d, i) => (
                <tr className="bg-gray-700 " key={i}>
                  <td className="pl-4">
                    <img
                      src={`http://localhost:2000/${d.ImgPro}`}
                      className="w-20 h-20 rounded-full"
                    />
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap dark:text-white"
                  >
                    {d.design}
                  </th>
                  <td className="px-6 py-4">{d.Pu}</td>
                  <td className="px-6 py-4">{d.Stock}</td>

                  <td className="px-6 py-4  space-x-4 flex">
                    <button
                      className="btn-xs btn lg:btn-md btn-neutral"
                      onClick={() => handleEdit(d)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn-xs btn lg:btn-md btn-error text-white"
                      onClick={() => window.my_modal_5.showModal()}
                    >
                      Supprimer
                    </button>
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
                              onClick={() => handleDelete(d.idProd)}
                            >
                              <label htmlFor="my_modal_7" onClick={() => handleDelete(d.idProd)}>Oui</label>
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
}

export default Produits;
