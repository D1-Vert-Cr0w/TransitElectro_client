import { useEffect, useState, useRef } from "react";
import "../styles/loginForm.css";
import axios from "axios";
import eyeOpen from "../assets/eye-open.svg";
import cross from "../assets/cross.png";
import eyeClosed from "../assets/eye-closed.svg";
import dashboard from "../assets/dashboard.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import lamp from "../assets/dividimg.svg";

function LogInForm() {
  const navigate = useNavigate();
  const { isLoginFormOpen, closeLoginForm, openLoginForm, location } =
    useAuth();
  const [errors, setErrors] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailForCode, setEmailForCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formState, setFormState] = useState("login");
  const [eyeIsOpen, setEyeIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  // Запуск таймера
  const startCountdown = () => {
    setCountdown(60); // 60 секунд
  };

  // Очистка таймера
  const clearCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Эффект для таймера
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearCountdown();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearCountdown;
  }, [countdown]);

  useEffect(() => {
    if (formState === "check") {
      startCountdown();
    } else {
      clearCountdown();
      setCountdown(0);
    }
  }, [formState]);

  async function getResetCode() {
    if (emailForCode) {
      try {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/user/sendcode",
          { email: emailForCode },
          { validateStatus: () => true }
        );
        if (response.status === 200 || response.status === 201) {
          setFormState("check");
          setErrors("");
        } else {
          setErrors(response.data.message);
        }
      } catch (error) {
        setErrors("Нет аккаунта с таким email");
      }
    } else {
      setErrors("Введите email");
    }
  }
  async function verifyCode() {
    try {
      const response = await axios.post(
        "https://tranzitelektro.ru/api/user/code/check",
        { email: emailForCode, code: code },
        { validateStatus: () => true }
      );
      if (response.status === 200 || response.status === 201) {
        setFormState("reset");
        setErrors("");
      } else {
        setErrors("Введн неправильный код");
      }
    } catch (error) {
      setErrors("Ошибка отправки кода");
    }
  }
  async function resetPassword() {
    if (emailForCode && password == confirmPassword) {
      try {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/user/password/reset",
          { email: emailForCode, password: password },
          { validateStatus: () => true }
        );
        if (response.status === 200 || response.status === 201) {
          setFormState("success");
          setMessage(
            "Ваш пароль успешно изменён. Закройте форму, и попробуйте войти в аккаунт снова"
          );
          setErrors("");
        } else {
          setErrors(response.data.message);
        }
      } catch (error) {
        setErrors("Ошибка отправки");
      }
    } else {
      setErrors("Пароль не подтвержден");
    }
  }
  async function LoginUser() {
    try {
      const response = await axios.post(
        "https://tranzitelektro.ru/api/user/login",
        { email: email, password: password },
        { withCredentials: true, validateStatus: () => true }
      );
      if (response.status === 200 || response.status === 201) {
        setFormState("success");
        setMessage("Вход в систему выполнен успешно");
        localStorage.setItem("user", response.data.user);
        if (location != null) {
          navigate(location, { replace: true });
        }
      } else {
        setErrors(response.data.message);
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  async function RegUser() {
    if (
      password === confirmPassword &&
      confirmPassword !== "" &&
      password !== ""
    ) {
      try {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/user/registration",
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
    if (state !== "check") {
      clearCountdown();
      setCountdown(0);
    }
  }
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
              <p className="resetLink" onClick={() => changeForm("change")}>
                Забыли пароль?
              </p>
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
        ) : formState == "reg" ? (
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
        ) : formState == "change" ? (
          <>
            <div className="closeButtonContainer">
              <button className="crossButton" onClick={() => closeLoginForm()}>
                <img src={cross} className="crossButton" />
              </button>
            </div>
            <h1 className="formTitle">Изменение пароля</h1>
            <p className="formSubTitle">
              Введите email для получения кода сброса пароля
            </p>
            <input
              onChange={(event) => setEmailForCode(event.target.value)}
              value={emailForCode}
              type="text"
              placeholder="Email"
              className="formInput"
            />
            <p className="errorContainer">{errors}</p>
            <div className="formButtonContainer ">
              <button
                className="formButton logIn"
                onClick={() => getResetCode()}
              >
                Получить код
              </button>
              <button
                className="formButton reg"
                onClick={() => changeForm("login")}
              >
                Назад
              </button>
            </div>
          </>
        ) : formState == "check" ? (
          <>
            <h1 className="formTitle">Введите код</h1>
            <p className="formSubTitle">Код отправлен на {emailForCode}</p>
            <input
              onChange={(event) => setCode(event.target.value)}
              value={code}
              type="text"
              placeholder="Код из письма"
              className="formInput"
            />
            <p className="errorContainer">{errors}</p>
            <button className="formButton logIn" onClick={() => verifyCode()}>
              Подтвердить
            </button>
            <div className="formButtonContainer ">
              <button
                className="formButton reg"
                onClick={() => getResetCode()}
                disabled={countdown > 0}
              >
                {countdown > 0
                  ? `Получить новый код (${formatTime(countdown)})`
                  : "Получить новый код"}
              </button>
            </div>
          </>
        ) : formState == "reset" ? (
          <>
            <h1 className="formTitle">Введите новый пароль</h1>
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
            <button
              className="formButton logIn"
              onClick={() => resetPassword()}
            >
              Подтвердить
            </button>
          </>
        ) : formState == "success" ? (
          <>
            <div className="closeButtonContainer">
              <button
                className="crossButton"
                onClick={() => {
                  closeLoginForm();
                  setFormState("login");
                }}
              >
                <img src={cross} className="crossButton" />
              </button>
            </div>
            <h1 className="formText">{message}</h1>
            <img className="lampImg" src={lamp} />
          </>
        ) : null}
      </div>
    </>
  );
}

export default LogInForm;
