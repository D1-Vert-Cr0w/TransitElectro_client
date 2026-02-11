import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../pages/product.jsx";
import "../styles/userredactor.css";
function UserRedactor() {
  const [componentState, setComponentState] = useState("viewing");
  const [userList, setUserList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageQuantity, setPageQuantity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [itemForDelete, setItemForDelete] = useState(null);
  const [dataForServer, setDataForServer] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [message, setMessage] = useState(null);
  async function loadUsersByPage(page, role) {
    try {
      const response = await axios.get(
        `https://tranzitelektro.ru/api/user/list/${role}/${page}`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      return [];
    }
  }
  async function loadPageCount() {
    try {
      const response = await axios.get(
        `https://tranzitelektro.ru/api/user/count/${selectedRole}`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      return [];
    }
  }
  useEffect(() => {
    async function fetchData() {
      const users = await loadUsersByPage(pageIndex, selectedRole);
      setUserList(users);
      const count = await loadPageCount();
      setPageQuantity(count > parseInt(count) ? parseInt(count + 1) : count);
    }
    fetchData();
  }, [componentState, selectedRole, pageIndex]);

  function addWorker() {
    setDataForServer({
      name: "",
      email: "",
      role: "user",
      surname: "",
      phone: "",
      password: "",
    });
    setComponentState("adding");
    setError(null);
  }
  function changeUser(id) {
    const elementForChange = userList.find((element) => element._id == id);
    setDataForServer({
      id: elementForChange._id,
      name: elementForChange.name,
      surname: elementForChange.surname,
      phone: elementForChange.phone,
      email: elementForChange.email,
      role: elementForChange.role,
    });
    setComponentState("changing");
    setError(null);
  }

  async function removeUser(id) {
    axios.delete(`https://tranzitelektro.ru/api/user/delete/${id}`, {
      withCredentials: true,
    });
    const users = await loadUsersByPage(pageIndex);

    if (users.length === 0 && pageIndex > 1) {
      const newPageIndex = pageIndex - 1;
      setPageIndex(newPageIndex);
      const newCategories = await loadUsersByPage(newPageIndex, selectedRole);
      setUserList(newCategories);
    } else {
      setUserList(users);
    }
    await loadPageCount();
  }

  function handleInputChange(name, value) {
    setDataForServer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function sendData() {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = {
        email: dataForServer.email,
        name: dataForServer.name,
        surname: dataForServer.surname,
        phone: dataForServer.phone,
        role: dataForServer.role,
        password: dataForServer.password,
      };
      if (
        data.name != "" &&
        data.email != "" &&
        data.surname != "" &&
        data.phone != "" &&
        data.password != "" &&
        data.role != ""
      ) {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/user/registrationfromadmin",
          data,
          {
            validateStatus: () => true,
          },
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
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = {
        id: dataForServer.id,
        email: dataForServer.email,
        name: dataForServer.name,
        surname: dataForServer.surname,
        phone: dataForServer.phone,
        password: dataForServer.password,
        role: dataForServer.role,
      };
      if (
        data.name != "" &&
        data.surname != "" &&
        data.phone != "" &&
        data.email != "" &&
        data.password != "" &&
        data.role != ""
      ) {
        const response = await axios.put(
          "https://tranzitelektro.ru/api/user/changedata",
          data,
          {
            validateStatus: () => true,
          },
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
  const pages = [];
  for (let index = 0; index < pageQuantity; index++) {
    {
      pages.push(
        <h1
          className={`pageNumber ${index + 1 === pageIndex ? "yellow" : ""}`}
          onClick={() => setPageIndex(index + 1)}
          key={index + 1}
        >
          {index + 1}
        </h1>,
      );
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
          <option value={"user"}>Пользователь</option>
          <option value={"manager"}>Менеджер</option>
          <option value={"admin"}>Администратор</option>
        </select>
      </div>
      {componentState == "viewing" ? (
        <>
          {userList.length != 0 ? (
            userList.map((user) => (
              <>
                <div className="categoryItem">
                  <h1 className="categoryName">{user.name}</h1>
                  <div className="discountControllButtonContainer">
                    <button
                      className="changeDiscount"
                      onClick={() => changeUser(user._id)}
                    >
                      Изменить
                    </button>
                    {itemForDelete != user._id ? (
                      <button
                        className="deleteCategory"
                        onClick={() => setItemForDelete(user._id)}
                      >
                        Удалить
                      </button>
                    ) : null}
                    {itemForDelete == user._id ? (
                      <div className="deleteFinalBlock">
                        <p className="orderInfo-text">Удалить:</p>
                        <button
                          className="deleteOrderButton accept"
                          onClick={() => removeUser(user._id)}
                        >
                          Да
                        </button>
                        <button
                          className="deleteOrderButton reject"
                          onClick={() => setItemForDelete(null)}
                        >
                          Нет
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            ))
          ) : (
            <h1 className="warningText">Пользователей с такой ролью нет</h1>
          )}
          <div
            style={{
              display: `${pages.length > 1 ? "flex" : "none"}`,
            }}
            className="redctorPageContainer"
          >
            {pages}
          </div>
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
          <p className="discountDitails-text">Фамилия</p>
          <input
            type="text"
            name="title"
            placeholder="Название"
            className="titleInput"
            value={dataForServer.surname}
            onChange={(e) => handleInputChange("surname", e.target.value)}
          />
          <p className="discountDitails-text">Телефон</p>
          <input
            type="tel"
            name="title"
            placeholder="+7 (___) ___-__-__"
            className="titleInput"
            value={dataForServer.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <p className="discountDitails-text">Роль</p>
          <select
            className="selectSrcOption"
            value={dataForServer.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          >
            <option value={"user"}>Пользователь</option>
            <option value={"manager"}>Менеджер</option>
            <option value={"admin"}>Администратор</option>
          </select>
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
          <button
            className={isLoading ? "dataLoading" : "changeProduct"}
            onClick={sendData}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка данных..." : "Загрузить данные"}
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
            placeholder="Email"
            className="titleInput"
            value={dataForServer.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <p className="discountDitails-text">Имя</p>
          <input
            type="text"
            name="title"
            placeholder="Имя"
            className="titleInput"
            value={dataForServer.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <p className="discountDitails-text">Фамилия</p>
          <input
            type="text"
            name="title"
            placeholder="Фамилия"
            className="titleInput"
            value={dataForServer.surname}
            onChange={(e) => handleInputChange("surname", e.target.value)}
          />
          <p className="discountDitails-text">Телефон</p>
          <input
            type="tel"
            name="title"
            placeholder="+7 (___) ___-__-__"
            className="titleInput"
            value={dataForServer.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <p className="discountDitails-text">Роль</p>
          <select
            className="selectSrcOption"
            value={dataForServer.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          >
            <option value={"all"}>Все</option>
            <option value={"user"}>Пользователь</option>
            <option value={"manager"}>Менеджер</option>
            <option value={"admin"}>Администратор</option>
          </select>
          {error != null ? <p className="errorText">{error}</p> : ""}
          <button
            className={isLoading ? "dataLoading" : "changeProduct"}
            onClick={updateData}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка данных..." : "Загрузить данные"}
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default UserRedactor;
