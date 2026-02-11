import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useState } from "react";
import cross from "../assets/cross.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/userdashboard.css";
function UserDashboard() {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [userOrderInfo, setUserOrderInfo] = useState([]);
  const [dataForServer, setDataForServer] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      axios
        .get(
          `https://tranzitelektro.ru/api/user/getinfo/${localStorage.getItem("user")}`,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setDataForServer({
            email: response.data.email,
            name: response.data.name,
            surname: response.data.surname,
            phone: response.data.phone,
            role: response.data.role,
          });
        });
      axios
        .get(
          `https://tranzitelektro.ru/api/order/list/${localStorage.getItem("user")}`,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setUserOrderInfo(response.data);
        });
    }
    fetchData();
  }, []);

  async function logout() {
    await axios.delete("https://tranzitelektro.ru/api/user/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }
  async function deleteOrder(id) {
    const newOrderList = userOrderInfo.filter((element) => element._id !== id);
    setUserOrderInfo(newOrderList);
    const orderForDelete = await axios.delete(
      `https://tranzitelektro.ru/api/order/delete/${id}`,
      {
        withCredentials: true,
      },
    );
  }
  function handleDataChange(name, value) {
    setDataForServer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function updateData() {
    if (isLoading) return; // Предотвращаем повторные отправки

    setIsLoading(true);
    setError(null);

    try {
      const data = {
        id: localStorage.getItem("user"),
        email: dataForServer.email,
        name: dataForServer.name,
        surname: dataForServer.surname,
        phone: dataForServer.phone,
        role: dataForServer.role,
      };
      if (data.name != "" && data.email != "") {
        const response = await axios.put(
          "https://tranzitelektro.ru/api/user/changedata",
          data,
          {
            validateStatus: () => true,
          },
        );
        if (response.status === 200 || response.status === 201) {
          setError(null);
          setMessage("Данные успешно изменены");
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
    <div className="userContainer">
      {message != null ? (
        <div className="messageContainer">
          <div className="closeMessageButtonContainer">
            <button
              className="closeMessageButton"
              onClick={() => setMessage(null)}
            >
              <img src={cross} className="crossButton" />
            </button>
          </div>
          <h1 className="messageText">{message}</h1>
        </div>
      ) : (
        ""
      )}
      <div className="logoutContainer">
        <h1 className="mainHeader">Личный кабинет</h1>
        <button
          className="logoutButton"
          onClick={() => {
            logout();
          }}
        >
          Выйти
        </button>
      </div>
      <div className="personalDataItem-container">
        <h1 className="personalDataItem-header">Мои данные</h1>
        <div className="personalDataSection-container">
          <h1 className="personalDataItem-text">Имя:</h1>
          <input
            className="dataInput"
            onChange={(e) => handleDataChange("name", e.target.value)}
            value={dataForServer?.name}
          />
        </div>
        <div className="personalDataSection-container">
          <h1 className="personalDataItem-text">Фамилия:</h1>
          <input
            className="dataInput"
            onChange={(e) => handleDataChange("surname", e.target.value)}
            value={dataForServer?.surname}
          />
        </div>
        <div className="personalDataSection-container">
          <h1 className="personalDataItem-text">Телефон:</h1>
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            className="dataInput"
            onChange={(e) => handleDataChange("phone", e.target.value)}
            value={dataForServer?.phone}
          />
        </div>
        <div className="personalDataSection-container">
          <h1 className="personalDataItem-text">Email:</h1>
          <input
            className="dataInput"
            onChange={(e) => handleDataChange("email", e.target.value)}
            value={dataForServer?.email}
          />
        </div>
        <div className="personalDataButton-container">
          {error != null ? <p className="errorText">{error}</p> : ""}

          <button className="changeDiscount" onClick={updateData}>
            Сохранить изменения
          </button>
        </div>
      </div>

      <h1 className="orderInfo-header">Мои заказы</h1>
      {userOrderInfo.length != 0 ? (
        userOrderInfo?.map((order) => (
          <div className="orderMainWrap">
            <div className="odrerControlPannel">
              <h1 className="orderInfo-date">Оформление: {order.date}</h1>
              <button
                className="deleteOrderButton"
                onClick={() => deleteOrder(order._id)}
              >
                Удалить
              </button>
            </div>
            <div className="adressContainer">
              <div className="adressTitle">Адрес: {order.adress}</div>
            </div>
            <div className="productsTitle">Товары</div>
            <div className="orderContainer">
              {order.products?.map((product) => (
                <div className="orderInfo-container">
                  <div className="orderInfo-item">{product.name}</div>
                  <div className="orderInfo-infogroup">
                    <div className="orderInfo-item price">
                      Цена: {product.price} руб.
                    </div>
                    <div className="orderInfo-item">
                      Количество: {product.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="noOrders">У вас нет заказов</p>
      )}
    </div>
  );
}
export default UserDashboard;
