import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../pages/product.jsx";
import "../styles/userredactor.css";
function UserRedactor() {
  const [componentState, setComponentState] = useState("viewing");
  const [workerList, setWorkerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataForServer, setDataForServer] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [message, setMessage] = useState(null);
  useEffect(() => {
    async function fetchData() {
      axios
        .get(`https://tranzitelektro.ru/api/user/list/${selectedRole}`, {
          withCredentials: true,
        })
        .then((response) => {
          setWorkerList(response.data);
        });
    }
    if (componentState == "viewing") {
      fetchData();
    }
  }, [componentState, selectedRole]);

  function addWorker() {
    setDataForServer({
      name: "",
      email: "",
      role: "",
      password: "",
    });
    setComponentState("adding");
    setError(null);
  }
  function changeUser(id) {
    const elementForChange = workerList.find((element) => element._id == id);
    setDataForServer({
      id: elementForChange._id,
      name: elementForChange.name,
      email: elementForChange.email,
      role: elementForChange.role,
    });
    setComponentState("changing");
    setError(null);
  }
  function removeUser(id) {
    axios
      .delete(`https://tranzitelektro.ru/api/user/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const newData = workerList.filter((element) => element._id !== id);
        setWorkerList(newData);
      });
  }

  function handleInputChange(name, value) {
    setDataForServer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function sendData() {
    if (isLoading) return; // Предотвращаем повторные отправки

    setIsLoading(true);
    setError(null);

    try {
      const data = {
        email: dataForServer.email,
        name: dataForServer.name,
        role: dataForServer.role,
        password: dataForServer.password,
      };
      if (
        data.name != "" &&
        data.email != "" &&
        data.password != "" &&
        data.role != ""
      ) {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/user/registrationfromadmin",
          data,
          {
            validateStatus: () => true,
          }
        );
        if (response.status === 200 || response.status === 201) {
          setError(null);
          setMessage("Запрос успешно отправлен");
        } else {
          setError(response.data.message);
        }
      } else {
        setError("*заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    } finally {
      setIsLoading(false);
    }
  }
  async function updateData() {
    if (isLoading) return; // Предотвращаем повторные отправки

    setIsLoading(true);
    setError(null);

    try {
      const data = {
        id: dataForServer.id,
        email: dataForServer.email,
        name: dataForServer.name,
        password: dataForServer.password,
        role: dataForServer.role,
      };
      if (
        data.name != "" &&
        data.email != "" &&
        data.password != "" &&
        data.role != ""
      ) {
        const response = await axios.put(
          "https://tranzitelektro.ru/api/user/changedata",
          data,
          {
            validateStatus: () => true,
          }
        );
        if (response.status === 200 || response.status === 201) {
          setError(null);
          setMessage("Запрос успешно отправлен");
        } else {
          setError(response.data.message);
        }
      } else {
        setError("*заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="discountMainWrap">
      <div className="discountControllButtonContainer headerDorder">
        <button
          className="changeDiscount"
          onClick={() => setComponentState("viewing")}
        >
          Список
        </button>
        <button className="changeDiscount" onClick={() => addWorker()}>
          Добавить
        </button>
        <p className="selectRole">Роль:</p>
        <select
          className="selectSrcOption"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value={"all"}>Все</option>
          <option value={"user"}>Пользователь</option>
          <option value={"manager"}>Менеджер</option>
          <option value={"admin"}>Администратор</option>
        </select>
      </div>
      {componentState == "viewing" ? (
        <>
          {workerList.length != 0 ? (
            workerList.map((user) => (
              <div className="categoryItem">
                <h1 className="categoryName">{user.name}</h1>
                <div className="discountControllButtonContainer">
                  <button
                    className="changeDiscount"
                    onClick={() => changeUser(user._id)}
                  >
                    Изменить
                  </button>
                  <button
                    className="deleteDiscount"
                    onClick={() => removeUser(user._id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 className="warningText">Пользователей с такой ролью нет</h1>
          )}
        </>
      ) : (
        ""
      )}
      {componentState == "adding" ? (
        <>
          <p className="discountDitails-text">Email</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <p className="discountDitails-text">Имя</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <p className="discountDitails-text">Роль</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          />
          <p className="discountDitails-text">Технический пароль</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
          {error != null ? <p className="errorText">{error}</p> : ""}
          {message != null ? <p className="confirmText">{message}</p> : ""}
          <button className="changeDiscount" onClick={sendData}>
            Загрузить данные
          </button>
        </>
      ) : (
        ""
      )}
      {componentState == "changing" ? (
        <>
          <p className="discountDitails-text">Email</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <p className="discountDitails-text">Имя</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <p className="discountDitails-text">Роль</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          />
          {error != null ? <p className="errorText">{error}</p> : ""}
          {message != null ? <p className="confirmText">{message}</p> : ""}
          <button className="changeDiscount" onClick={updateData}>
            Загрузить данные
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default UserRedactor;
