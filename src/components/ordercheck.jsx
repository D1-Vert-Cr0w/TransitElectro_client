import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/userdashboard.css";
function OrderCheck() {
  const [itemForDelete, setItemForDelete] = useState(null);
  const [userOrderInfo, setUserOrderInfo] = useState();
  const [available, setAvailable] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageQuantity, setPageQuantity] = useState();
  const [tempInputValues, setTempInputValues] = useState({});
  useEffect(() => {
    async function fetchData() {
      axios
        .get(`https://tranzitelektro.ru/api/order/listall/${pageIndex}`, {
          withCredentials: true,
        })
        .then((response) => {
          setUserOrderInfo(response.data);
        });
      axios
        .get(`https://tranzitelektro.ru/api/order/count`, {
          withCredentials: true,
        })
        .then((response) => {
          setPageQuantity(response.data);
        });
    }
    fetchData();
  }, [pageIndex]);
  async function deleteOrder(id) {
    const newOrderList = userOrderInfo.filter((element) => element._id !== id);
    setUserOrderInfo(newOrderList);
    const orderForDelete = await axios.delete(
      `https://tranzitelektro.ru/api/order/delete/${id}`,
      {
        withCredentials: true,
      },
    );
    const countResponse = await axios.get(
      `https://tranzitelektro.ru/api/order/count`,
      {
        withCredentials: true,
      },
    );
    const totalCount = countResponse.data;
    const itemsPerPage = 1;
    const newPageQuantity = Math.ceil(totalCount / itemsPerPage) || 1;
    let newPageIndex = pageIndex;
    if (pageIndex > newPageQuantity) {
      newPageIndex = newPageQuantity;
    }
    setPageQuantity(newPageQuantity);
    if (newPageIndex !== pageIndex) {
      setPageIndex(newPageIndex);
    }
    const pageToLoad = newPageIndex !== pageIndex ? newPageIndex : pageIndex;
    const listResponse = await axios.get(
      `https://tranzitelektro.ru/api/order/listall/${pageToLoad}`,
      { withCredentials: true },
    );
    setUserOrderInfo(listResponse.data);
  }
  async function sendReminderingMail(email, name, adress, id) {
    if (isLoading) return;
    setClientId(id);
    setIsLoading(true);
    const response = await axios.post(
      `https://tranzitelektro.ru/api/user/remind`,
      { email: email, name: name, adress: adress },
      {
        withCredentials: true,
        validateStatus: () => true,
      },
    );
    if (response.status == 201 || response.status == 200) {
      setIsLoading(false);
      setClientId(null);
      alert("Напоминание отправлено");
    } else {
      alert("Ошибка отправки");
    }
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
  const pages = [];
  for (let index = 0; index < pageQuantity; index++) {
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

  return (
    <div className="userContainer">
      <h1 className="orderInfo-header">Заказы</h1>
      {userOrderInfo?.map((order) => (
        <div className="orderMainWrap">
          <h1 className="orderInfo-date">Почта: {order.email}</h1>
          <h1 className="orderInfo-date">Имя: {order.name}</h1>
          <div className="odrerControlPannel">
            <h1 className="orderInfo-date">Оформление: {order.date}</h1>
          </div>
          <div className="adressContainer">
            <div className="adressTitle">Адрес: {order.adress}</div>
          </div>

          <div className="orderContainer">
            <div className="productsTitle">Товары:</div>
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
          <div className="categoryButtonContainer">
            <button
              className={
                isLoading && clientId == order._id
                  ? "sendMailButton-process"
                  : "sendMailButton"
              }
              onClick={() =>
                sendReminderingMail(
                  order.email,
                  order.name,
                  order.adress,
                  order._id,
                )
              }
            >
              {isLoading && clientId == order._id
                ? "Отправка письма клиенту"
                : "Оповестить о готовности"}
            </button>
            {itemForDelete != order._id ? (
              <button
                className="sendMailButton-process"
                onClick={() => setItemForDelete(order._id)}
              >
                Удалить заказ
              </button>
            ) : null}
            {itemForDelete == order._id ? (
              <div className="adressContainer">
                <p className="orderInfo-text">Закрыть заказ:</p>
                <button
                  className="deleteOrderButton reject"
                  onClick={() => setItemForDelete(null)}
                >
                  Нет
                </button>
                <button
                  className="deleteOrderButton accept"
                  onClick={() => deleteOrder(order._id)}
                >
                  Да
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ))}
      <div
        style={{
          display: `${pages.length > 1 ? "flex" : "none"}`,
        }}
        className="orderPageContainer"
      >
        {pages}
      </div>
    </div>
  );
}
export default OrderCheck;
