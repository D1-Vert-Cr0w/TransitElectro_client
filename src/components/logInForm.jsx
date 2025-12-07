import { useEffect, useState } from "react";
import "../styles/loginForm.css";
import axios from "axios";
import eyeOpen from "../assets/eye-open.svg";
import cross from "../assets/cross.png";
import eyeClosed from "../assets/eye-closed.svg";
import dashboard from "../assets/dashboard.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function LogInForm() {
  const navigate = useNavigate();
  const { isLoginFormOpen, closeLoginForm, openLoginForm, location } =
    useAuth();
  const [errors, setErrors] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formState, setFormState] = useState("login");
  const [eyeIsOpen, setEyeIsOpen] = useState(false);

  async function LoginUser() {
    try {
      const response = await axios.post(
        "api/user/login",
        { email: email, password: password },
        { withCredentials: true, validateStatus: () => true }
      );
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("user", response.data.user);
        if (localStorage.getItem("user")) {
          closeLoginForm();
          if (location != null) {
            navigate(location, { replace: true });
          }
        }
      } else {
        setErrors(response.data.message);
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }
  function openForm() {
    if (localStorage.getItem("user") != null) {
      navigate("/dashboard", { replace: true });
    } else {
      openLoginForm();
    }
  }
  function changeForm(state) {
    setErrors("");
    setFormState(state);
  }
  async function RegUser() {
    if (
      password === confirmPassword &&
      !confirmPassword == "" &&
      !password == ""
    ) {
      try {
        const response = await axios.post(
          "api/user/registration",
          { email: email, password: password, name: name },
          { withCredentials: true, validateStatus: () => true }
        );
        if (response.status === 200 || response.status === 201) {
          localStorage.setItem("user", response.data.user);
          if (localStorage.getItem("user")) {
            closeLoginForm();
            if (location != null) {
              navigate(location, { replace: true });
            }
          }
        } else {
          setErrors(response.data.message);
        }
      } catch (error) {
        setErrors(error.response.data.message);
      }
    } else {
      setErrors("Пароль не подтверждён");
    }
  }
  return (
    <>
      <button className="openButton" onClick={() => openForm()}>
        <img className="dashboardIcon" src={dashboard} />
      </button>
      <div className="mobileLogIn" onClick={() => openForm()}>
        Вход в аккаунт
      </div>
      <div
        className="modal-bg"
        style={{ display: `${isLoginFormOpen ? "block" : "none"}` }}
      ></div>

      <div
        className="formContainer"
        style={{ display: `${isLoginFormOpen ? "flex" : "none"}` }}
      >
        {formState == "login" ? (
          <>
            <div className="closeButtonContainer">
              <button className="crossButton" onClick={() => closeLoginForm()}>
                <img src={cross} className="crossButton" />
              </button>
            </div>
            <h1 className="formTitle">Вход в аккаунт</h1>
            <p className="formSubTitle">
              Для получения полного доступа к функционалу сайта необходима
              авторизация
            </p>
            <div>
              <input
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                type="text"
                placeholder="Email"
                className="formInput"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                type={eyeIsOpen == true ? "text" : "password"}
                placeholder="Password"
                className="formInput password-input"
              />
              <button
                className="fa fa-eye"
                aria-hidden="true"
                onClick={() =>
                  eyeIsOpen == false ? setEyeIsOpen(true) : setEyeIsOpen(false)
                }
              >
                <img
                  className="eyeIcon"
                  src={eyeIsOpen == true ? eyeOpen : eyeClosed}
                />
              </button>
            </div>
            <p className="errorContainer">{errors}</p>
            <div className="formButtonContainer ">
              <button className="formButton logIn" onClick={LoginUser}>
                Войти
              </button>
              <button
                className="formButton reg"
                onClick={() => changeForm("reg")}
              >
                Регистрация
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="closeButtonContainer">
              <button
                className="crossButton"
                onClick={() => closeLoginForm()}
              ></button>
            </div>
            <h1 className="formTitle">Регистрация аккаунта</h1>
            <input
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              type="text"
              placeholder="Email"
              className="formInput"
            />
            <div>
              <input
                onChange={(event) => setName(event.target.value)}
                value={name}
                type="text"
                placeholder="Имя пользователя"
                className="formInput"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                type={eyeIsOpen == true ? "text" : "password"}
                placeholder="Пароль"
                className="formInput password-input"
              />
              <button
                className="fa fa-eye"
                aria-hidden="true"
                onClick={() =>
                  eyeIsOpen == false ? setEyeIsOpen(true) : setEyeIsOpen(false)
                }
              >
                <img
                  className="eyeIcon"
                  src={eyeIsOpen == true ? eyeOpen : eyeClosed}
                />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="Подтверждение пароля"
                className="formInput "
              />
            </div>
            <p className="errorContainer">{errors}</p>
            <div className="formButtonContainer ">
              <button className="formButton logIn" onClick={RegUser}>
                Зарегистрироваться
              </button>
              <button
                className="formButton reg"
                onClick={() => changeForm("login")}
              >
                Вход в аккаунт
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default LogInForm;
