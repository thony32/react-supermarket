import { IonTitle, IonToolbar } from "@ionic/react";
import AchatIcon from "../../assets/AchatIcon";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';

const Vente = () => {
  const [image, setImage] = useState() as any;
  const [designFour, setDesignFour] = useState() as any;
  const [puFour, setPuFour] = useState() as any;
  const [idProd, setIdProd] = useState() as any;
  const [stock, setStock] = useState() as any;
  const [sumDepense, setSumDepense] = useState(0) as any;
  const qteRef = useRef() as any;
  const date_buy = useRef() as any;
  const id_four = useRef() as any;
  const [a, setA] = useState(0) as any;
  const [idAchat, setIdAchat] = useState();
  var b: any;
  // * multiple add
  const [temp_product, setTempProduct] = useState<any[]>([]);
  const setProduct = () => {
    axios.get(`http://localhost:2000/recIdProduit/${idProd}`).then((res: any) => {
      if(res.data.Stock < qteRef.current.value){
        toast.error(`Quantité en stock doit être inférieur à ${res.data.Stock}`);
      }
      else{
        const newData = {
          idProd: idProd,
          ImgProFOur: image,
          designFOur: designFour,
          PuFour: puFour,
          stock: stock,
          Qte: qteRef.current.value,
          Subtotal: (puFour * qteRef.current.value).toFixed(0),
        };
        const updatedSum = sumDepense + puFour * qteRef.current.value;
        setSumDepense(updatedSum);
        const updatedData = [...temp_product, newData]; // Create a new array with the new data
        setTempProduct(updatedData);
    
        // * reset data
        setImage("");
        setDesignFour("");
        setPuFour("");
        qteRef.current.value = "";
        // console.log(temp_product);
      }
    })
    // console.log(image,designFour,puFour);
  };

  // * delete array product element
  const deleteProduct = (i: any) => {
    const tempProductCopy = [...temp_product];
    const removedItemSubtotal = parseInt(tempProductCopy[i].Subtotal);
    tempProductCopy.splice(i, 1);
    setTempProduct(tempProductCopy);
    const updatedSum = sumDepense - removedItemSubtotal;
    setSumDepense(updatedSum);
  };
  useEffect(() => {
    const totalSum = temp_product.reduce(
      (accumulator: any, item: any) => accumulator + parseInt(item.Subtotal),
      0
    );
    setSumDepense(totalSum);
  }, [temp_product]);
  // * buy all
  const buyAll = async () => {
    // setSumDepense(
    //   temp_product.reduce(
    //     (accumulator: any, item) => accumulator + parseInt(item.Subtotal),
    //     0
    //   )
    // );
    const data = {
      montant: parseInt(sumDepense),
      dateVente: date_buy.current.value,
    };

    // * post achat
    await axios.post("http://localhost:2000/createVente", data);

    console.log("Vente créée avec succès");
    const res = await axios.get("http://localhost:2000/recIdVenteMax");
    
    const maxIdVente = res.data.maxIdVente;
    setIdAchat(maxIdVente);

    console.log("ID de la vente maximum obtenu :", maxIdVente);
    // setIdAchat(res.data.maxIdVente);
    console.log("ID de la vente maximum obtenu :", idAchat);
    // * multiple buy
    for (let index = 0; index < temp_product.length; index++) {
      const elements = {
        idVente: maxIdVente,
        idProd: temp_product[index]["idProd"],
        ImgPro: temp_product[index]["ImgProFOur"],
        design: temp_product[index]["designFOur"],
        Pu: temp_product[index]["PuFour"],
        Qte: temp_product[index]["Qte"],
        Subtotal: temp_product[index]["Subtotal"],
        dateVente: date_buy.current.value,
      };
      axios
        .post("http://localhost:2000/createDetVente", elements)
        .then((response) => {
          console.log("ok beeeee");
        });
      const idP = {
        idProd: temp_product[index]["idProd"],
      };

      // * ty le miajpute amle table detAchats

      axios
        .get(`http://localhost:2000/recIdProduit/${idP.idProd}`)
        .then((res: any) => {
          setA(res.data.Stock);

          const element = {
            Stock: res.data.Stock - temp_product[index]["Qte"],
          };
          axios
            .put(`http://localhost:2000/updateStock/${idP.idProd}`, element)
            .then((response) => {
              console.log("ok kind");
            });
        });
    }
    toast.success("Produit vendu avec succès!")
    setTempProduct([]);
    // console.log(idAchat);
    // console.log(temp_product,idAchat);
  };

  function handleScan(data: String) {
    console.log(data);
  }
  function handleError(err: Error) {
    console.error(err);
  }
  function handleResult(result: String) {
    if (result) {
      console.log(result);
      axios
        .get(`http://localhost:2000/recIdProduit/${result}`)

        .then((res) => {
          console.log(res.data);
          setStock(res.data.Stock);
          setIdProd(res.data.idProd);
          setImage(res.data.ImgPro);
          setDesignFour(res.data.design);
          setPuFour(res.data.Pu);
        });
    }
  }
  const previewStyle = {
    height: 240,
    width: 320,
  };
  return (
    <div className="apple lg:col-span-7  overflow-y-scroll space-y-4">
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
            Vente de Produits
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
                readOnly
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
                
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Prix Unitaire
              </label>
            </div>
            
            <div className="relative z-0 w-full mb-6 group">
              <input
                ref={qteRef}
                type="number"
                max={stock}
                min={1}
                className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Quantité
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
                <tr className="bg-gray-700" key={i}>
                  <img
                    src={`http://localhost:2000/${d.ImgProFOur}`}
                    className="w-20 h-20 rounded"
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
                  <td className="px-6 py-4 space-x-4">
                    <button
                      onClick={() => deleteProduct(i)}
                      className="btn btn-error text-white"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={
            temp_product.length === 0 ? "hidden" : "flex flex-col items-end w-1/2 lg:w-full my-2 space-y-4"
          }
        >
          <div className="text-right text-xl lg:text-2xl">Somme : <span className="text-2xl lg:text-4xl font-bold">{sumDepense} </span>Ar</div>
          <div className="space-y-4">
            <div>
              <input ref={date_buy} type="date" className="bg-gray-500 rounded-lg w-full" />
            </div>

            <button
            type="button"
              onClick={buyAll}
              className="uppercase font-bold text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-md w-auto px-8 py-4 text-center"
            >
              Vendre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vente;
