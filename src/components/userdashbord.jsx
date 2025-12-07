import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/userdashboard.css";
function UserDashboard() {
  const [userInfo, setUserInfo] = useState();
  const [userOrderInfo, setUserOrderInfo] = useState([]);
  const [available, setAvailable] = useState(null);
  const [tempInputValues, setTempInputValues] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      axios
        .get(`api/user/getinfo/${localStorage.getItem("user")}`, {
          withCredentials: true,
        })
        .then((response) => {
          setUserInfo(response.data);
        });
      axios
        .get(`api/order/list/${localStorage.getItem("user")}`, {
          withCredentials: true,
        })
        .then((response) => {
          setUserOrderInfo(response.data);
        });
    }
    fetchData();
  }, []);
  async function logout() {
    await axios.delete("api/user/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }
  async function deleteOrder(id) {
    const newOrderList = userOrderInfo.filter((element) => element._id !== id);
    setUserOrderInfo(newOrderList);
    const orderForDelete = await axios.delete(`api/order/delete/${id}`, {
      withCredentials: true,
    });
  }
  function handleInputChange(elementId, newAdress) {
    setTempInputValues((prev) => ({
      ...prev,
      [elementId]: newAdress,
    }));
  }
  function handleBlur(elementId, value) {
    if (value != "") {
      const newData = userOrderInfo.map((element) => {
        if (element._id === elementId) {
          return { ...element, adress: value };
        } else {
          return element;
        }
      });
      setUserOrderInfo(newData);
      setAvailable(null);
    }
    setTempInputValues({});
  }
  return (
    <div className="userContainer">
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
        <h1 className="personalDataItem-text">Имя: {userInfo?.name}</h1>
        <h1 className="personalDataItem-text">Email: {userInfo?.email}</h1>
      </div>
      <h1 className="orderInfo-header">Мои заказы</h1>
      {userOrderInfo.length != 0 ? (
        userOrderInfo?.map((order) => (
          <>
            <div className="odrerControlPannel">
              <h1 className="orderInfo-date">Оформление: {order.date}</h1>
              <button
                className="deleteButton"
                onClick={() => deleteOrder(order._id)}
              >
                Удалить
              </button>
            </div>
            <div className="adressContainer">
              <div className="adressTitle">Адрес</div>
              <input
                disabled={available == order._id ? false : true}
                className="adressInput"
                onChange={(e) => handleInputChange(order._id, e.target.value)}
                onBlur={(e) => handleBlur(order._id, e.target.value)}
                value={tempInputValues[order._id] ?? order.adress}
              />
              <div className="adressControllButtonContainer">
                <button
                  className="deleteButton"
                  onClick={() => setAvailable(order._id)}
                >
                  Изменить
                </button>
                <button
                  className="acceptButton"
                  onClick={() => setAvailable(null)}
                >
                  Применить
                </button>
              </div>
            </div>
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
          </>
        ))
      ) : (
        <p className="noOrders">У вас нет заказов</p>
      )}
    </div>
  );
}
export default UserDashboard;
