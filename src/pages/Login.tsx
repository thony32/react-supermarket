import { navigate } from "ionicons/icons";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const refUsername = useRef() as any;
  const refPassword = useRef() as any;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  //*INput Blur
  const handleUsernameBlur = () => {
    if (username === "") {
      setUsernameEmpty(true);
    }
  };
  const handlePasswordBlur = () => {
    if (password === "") {
      setPasswordEmpty(true);
    }
  };

  //*Input Focus
  const handleUsernameFocus = () => {
    setUsernameEmpty(false);
  };
  const handlePasswordFocus = () => {
    setPasswordEmpty(false);
  };

  //* Login Handler
  const handleLogin = () => {
    const username = refUsername.current.value;
    const password = refPassword.current.value;

    if (username === "admin" && password === "admin") {
      localStorage.setItem("login", "true");
      navigate("/page");
    } else if (username === "" || password === "") {
      toast.error("Connexion échouée! les deux champs sont requis!");
    } else {
      toast.error(
        "Connexion échouée! Nom d'utilisateur ou mot de passe invalide!"
      );
    }
  };
  return (
    <div className="h-screen p-4 lg:px-[40%] flex flex-col justify-center">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className=" lg:p-8 lg:border lg:border-transparent lg:rounded-2xl lg:shadow-2xl">
        <div>
          <h1 className="text-center text-white titre">CONNEXION</h1>
        </div>
        <form>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="floating_email"
              id="floating_email"
              className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 focus:ring-0 peer ${ usernameEmpty ? "border-red-500" : "border-gray-300"}`}
              placeholder=" "
              value={username}
              ref={refUsername}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameEmpty(false);
              }}
              onBlur={handleUsernameBlur}
              onFocus={handleUsernameFocus}
            />
            <label
              htmlFor="floating_email"
              className={` peer-focus:font-medium absolute text-sm  dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${ usernameEmpty ? "text-red-500" : "text-gray-500"}`}
              // peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6
            >
              Nom d'utilisateur
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              name="floating_password"
              id="floating_password"
              className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 focus:ring-0 peer ${ passwordEmpty ? "border-red-500" : "border-gray-300"}`}
              placeholder=" "
              onChange={(e) => {
                {
                  setPassword(e.target.value);
                  setPasswordEmpty(false);
                }
              }}
              ref={refPassword}
              value={password}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
            />
            <label
              htmlFor="floating_password"
              className={` peer-focus:font-medium absolute text-sm  dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${ passwordEmpty ? "text-red-500" : "text-gray-500"}`}
            >
              Mot de Passe
            </label>
          </div>
          <div className="flex justify-center">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleLogin}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
