import { IonTitle, IonToolbar } from "@ionic/react";
import AchatIcon from "../../assets/AchatIcon";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { useRef, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';

const Achat = () => {
  const [image, setImage] = useState("") as any;
  const [designFour, setDesignFour] = useState("") as any;
  const [puFour, setPuFour] = useState("") as any;
  const [idProd, setIdProd] = useState("") as any;
  const [sumDepense, setSumDepense] = useState(0) as any;
  const qteRef = useRef() as any ;
  const date_buy = useRef() as any;
  const id_four = useRef() as any;
  const [temp_product, setTempProduct] = useState([]) as any;
  const [idAchat, setIdAchat] = useState("") as any;

  const setProduct = () => {
    const newData = {
      idProd: idProd,
      ImgProFOur: image,
      designFOur: designFour,
      PuFour: puFour,
      Qte: qteRef.current.value,
      Subtotal: (puFour * qteRef.current.value).toFixed(0),
    };
    const updatedSum = sumDepense + puFour * qteRef.current.value;
    setSumDepense(updatedSum);

    const updatedData = [...temp_product, newData];
    setTempProduct(updatedData);

    setImage("");
    setDesignFour("");
    setPuFour("");
    qteRef.current.value = "";
  };

  const deleteProduct = (i: any) => {
    const tempProductCopy = [...temp_product];
    const removedItemSubtotal = parseInt(tempProductCopy[i].Subtotal);
    tempProductCopy.splice(i, 1);
    setTempProduct(tempProductCopy);
    const updatedSum = sumDepense - removedItemSubtotal;
    setSumDepense(updatedSum);
  };

  const buyAll = async () => {
    const data = {
      idFour: parseInt(id_four.current.value),
      depense: parseInt(sumDepense),
      dateAchat: date_buy.current.value,
    };
  
    try {
      // * post achat
      await axios.post("http://localhost:2000/createAchat", data);
      const res = await axios.get("http://localhost:2000/recIdAchatMax");
      const maxIdAchat = res.data.maxIdAchat;
  
      for (let index = 0; index < temp_product.length; index++) {
        const existingProduct = await axios.get(
          `http://localhost:2000/recIdProduit/${temp_product[index].idProd}`
        );
  
        if (existingProduct.data && existingProduct.data.idProd) {
          // Le produit existe déjà, mettons à jour le stock
          const newStock =
            parseInt(existingProduct.data.Stock) +
            parseInt(temp_product[index].Qte);
          await axios.put(
            `http://localhost:2000/updateStock/${existingProduct.data.idProd}`,
            { Stock: newStock }
          );
        } else {
          // Le produit n'existe pas, ajoutons un nouveau produit
          await axios.post("http://localhost:2000/createProduit", {
            idProd: temp_product[index].idProd,
            ImgPro: temp_product[index].ImgProFOur,
            design: temp_product[index].designFOur,
            Stock: temp_product[index].Qte,
          });
        }
  
        // Ajoutons le détail de l'achat pour ce produit
        const elements = {
          idAchat: maxIdAchat,
          idFour: parseInt(id_four.current.value),
          idProd: temp_product[index].idProd,
          ImgPro: temp_product[index].ImgProFOur,
          design: temp_product[index].designFOur,
          PuFour: temp_product[index].PuFour,
          Qte: temp_product[index].Qte,
          Subtotal: temp_product[index].Subtotal,
          dateAchat: date_buy.current.value,
        };
        await axios.post("http://localhost:2000/createDetAchat", elements);
      }
  
      console.log("Achat effectué avec succès !");
      setTempProduct([]);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
    toast.success("Produit acheté avec succès!")
  };

  function handleScan(data: any) {
    console.log(data);
  }
  function handleError(err: any) {
    console.error(err);
  }
  function handleResult(result: any) {
    if (result) {
      axios
        .get(`http://localhost:2000/recIdProduitFour/${result}`)
        .then((res) => {
          setIdProd(res.data.idProdFour);
          setImage(res.data.ImgProFour);
          setDesignFour(res.data.designFour);
          setPuFour(res.data.PuFour);
        });
    }
  }

  const previewStyle = {
    height: 240,
    width: 320,
  };
  return (
    <div className="apple lg:col-span-7  overflow-y-scroll">
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
          <div className="titre font-bold flex gap-4 justify-center">
            <AchatIcon />
            Achat de Produits
          </div>
        </IonTitle>
      </IonToolbar>
      <div className="lg:grid lg:grid-cols-2">
        <div className="flex flex-col items-center">
          <QrReader
            className="w-1/2 h-1/2"
            delay={3000}
            onError={handleError}
            onScan={handleScan}
            onResult={handleResult}
          />
        </div>
        <div>
          <div className="p-8 lg:px-32 lg:py-16">
            {/* <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                disabled
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                ID Produit
              </label>
            </div> */}
            {/* <div className="relative z-0 w-full mb-6 group">
              <input
                type="file"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                disabled
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                ID Fournisseur
              </label>
            </div> */}
            <img
              src={`http://localhost:2000/${image}`}
              alt="Image"
              className="w-20 h-20 rounded"
            />
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={designFour}
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
                value={puFour}
                required
                readOnly
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Montant
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                ref={qteRef}
                type="number"
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Quantité à acheter
              </label>
            </div>
            <div className="flex justify-center">
              <button
                onClick={setProduct}
                type="submit"
                className="btn btn-primary"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" p-4 lg:p-16">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-slate-100">
            <thead className="text-xs text-slate-200 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Image
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
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {temp_product.map((d: any, i: any) => (
                <tr className="bg-gray-700 pl-4" key={i}>
                  <img
                    src={`http://localhost:2000/${d.ImgProFOur}`}
                    className="w-20 h-20 rounded-full"
                  />
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap dark:text-white"
                  >
                    {d.designFOur}
                  </th>
                  <td className="px-6 py-4">{d.PuFour}</td>
                  <td className="px-6 py-4">{d.Qte}</td>
                  <td className="px-6 py-4">{d.Subtotal}</td>
                  <td className="px-6 py-4  space-x-4">
                    <button
                      onClick={() => deleteProduct(i)}
                      className="btn btn-xs lg:btn-md btn-error text-white"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right text-xl lg:text-2xl">Somme : <span className="text-2xl lg:text-4xl font-bold">{sumDepense} </span>Ar</div>
        <div
          className={
            temp_product.length === 0
              ? "hidden"
              : "flex flex-col items-end w-1/2 lg:w-full my-2"
          }
        >
          <div className="space-y-4">
            <div className="bg-gray-500 rounded-lg">
              <input ref={date_buy} type="date" className="bg-gray-500 rounded-lg w-full" />
            </div>
            <div>
              <input
                ref={id_four}
                className="bg-transparent border-b-gray-500 border-b-2 text-white rounded-lg"
                placeholder="id four"
                type="number"
                value={1}
              />
            </div>
            <button
            type="button"
              onClick={buyAll}
              className="uppercase font-bold text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-md w-auto px-8 py-4 text-center"
            >
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achat;
