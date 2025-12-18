import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/userdashboard.css";
function OrderCheck() {
  const [userOrderInfo, setUserOrderInfo] = useState();
  const [available, setAvailable] = useState(null);
  const [tempInputValues, setTempInputValues] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      axios
        .get(`https://tranzitelektro.ru/api/order/listall`, {
          withCredentials: true,
        })
        .then((response) => {
          setUserOrderInfo(response.data);
        });
    }
    fetchData();
  }, []);
  async function deleteOrder(id) {
    const newOrderList = userOrderInfo.filter((element) => element._id !== id);
    setUserOrderInfo(newOrderList);
    const orderForDelete = await axios.delete(
      `https://tranzitelektro.ru/api/order/delete/${id}`,
      {
        withCredentials: true,
      }
    );
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
    }
    setTempInputValues({});
  }
  return (
    <div className="userContainer">
      <h1 className="orderInfo-header">Заказы</h1>
      {userOrderInfo?.map((order) => (
        <>
          <h1 className="orderInfo-date">Почта: {order.email}</h1>
          <h1 className="orderInfo-date">Имя: {order.name}</h1>
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
            <button
              className="deleteButton"
              onClick={() => setAvailable(order._id)}
            >
              Изменить
            </button>
            <button className="acceptButton" onClick={() => setAvailable(null)}>
              Применить
            </button>
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
      ))}
    </div>
  );
}
export default OrderCheck;
