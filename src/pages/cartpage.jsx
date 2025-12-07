import Header from "../components/header";
import Footer from "../components/footer";
import CartItem from "../components/categoryitem";
import lamp from "../assets/dividimg.svg";
import { useEffect, useRef, useState } from "react";
import "../styles/cart.css";
import axios from "axios";

function Cartpage() {
  const input = useRef(null);
  const [isSended, setIsSended] = useState(false);
  const [adressNeedChose, setAdressNeedChose] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [tempInputValues, setTempInputValues] = useState([]);
  async function fetchData() {
    try {
      if (localStorage.getItem("user") != null) {
        const cartDataReq = await axios.get(
          `api/cart/list/${localStorage.getItem("user")}`,
          {
            withCredentials: true,
          }
        );
        if (cartDataReq.data.products != undefined) {
          console.log(cartDataReq.data._id);
          setCartData(cartDataReq.data.products);
          setCartId(cartDataReq.data._id);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  async function pushData(productData) {
    try {
      const cartDataReq = await axios.put(
        `api/cart/update`,
        {
          id: localStorage.getItem("user"),
          products: productData,
        },
        {
          withCredentials: true,
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  function changeQuantity(elementId, increment) {
    const newData = cartData.map((element) => {
      if (element.id === elementId) {
        if (element.quantity + increment < 0) {
          return { ...element, quantity: 0 };
        } else {
          return { ...element, quantity: element.quantity + increment };
        }
      } else {
        return element;
      }
    });
    pushData(newData);
    setCartData(newData);
  }
  function handleQuantityChange(elementId, newQuantity) {
    setTempInputValues((prev) => ({
      ...prev,
      [elementId]: newQuantity,
    }));
  }
  function handleBlur(elementId, value) {
    if (value != "") {
      const quantity = parseInt(value);
      if (!isNaN(quantity) && quantity > 0) {
        const newData = cartData.map((element) => {
          if (element.id === elementId) {
            return { ...element, quantity: quantity };
          } else {
            return element;
          }
        });
        console.log(newData);
        pushData(newData);
        setCartData(newData);
      }
    }
    setTempInputValues([]);
  }
  const handleKeyDown = (e) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };
  function removeFromCart(elementId) {
    const newCartData = cartData.filter((element) => element.id !== elementId);
    console.log(newCartData);
    pushData(newCartData);
    setCartData(newCartData);
  }
  async function sendOrder() {
    try {
      if (input.current.value != "") {
        const cartDataReq = await axios.post(
          `api/order/add`,
          {
            id: localStorage.getItem("user"),
            adress: input.current.value,
            products: cartData,
          },
          {
            withCredentials: true,
          }
        );
        const cartDelete = await axios.delete(
          `api/cart/delete`,
          {
            id: cartId,
          },
          {
            withCredentials: true,
          }
        );
        setIsSended(true);
        setCartData([]);
        setCartId(null);
      } else {
        setAdressNeedChose(true);
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <div className="HeaderWrap">
        <Header />
      </div>
      <div className="cartContainer">
        {isSended ? (
          <div className="alertText-container">
            <p className="alertText">Ваш заказ отправлен на рассмотрение.</p>
            <p className="alertText">
              Посмотреть его статус и изменить адрес доставки вы можете в личном
              кабинете.
            </p>
            <img className="lamp" src={lamp} />
          </div>
        ) : cartData?.length != 0 ? (
          <div className="mainCartContainer">
            <div className="cartHeader-container">
              <div className="mobileMenuHeader">Корзина</div>
              <div className="cartHeader-name hide">Название</div>
              <div className="cartItem-container hide">
                <div className="cartHeader-price">Цена шт.</div>
                <div className="cartHeader-quantity">Количество</div>
              </div>
            </div>
            {cartData?.map((product) => (
              <div className="cartItem-maincontainer">
                <div className="cartItem-infocontainer">
                  <img src={product.image[0]} className="cartItem-image"></img>
                  <h1 className="cartItem-name">{product.name}</h1>
                </div>
                <div className="cartItem-container">
                  <div className="cartItem-price">{product.price} руб.</div>
                  <div className="controllButtonGroup">
                    <button
                      className="cartItem-button"
                      onClick={() => changeQuantity(product.id, +1)}
                    >
                      +
                    </button>
                    <input
                      value={tempInputValues[product.id] ?? product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                      type="number"
                      onKeyDown={handleKeyDown}
                      onBlur={(e) => handleBlur(product.id, e.target.value)}
                      className="cartItem-quantity"
                    />
                    <button
                      className="cartItem-button minus"
                      onClick={() => changeQuantity(product.id, -1)}
                    >
                      -
                    </button>
                  </div>
                  <button
                    className="cartItem-deletebutton"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Убрать
                  </button>
                </div>
              </div>
            ))}
            <div className="deliveryWrap">
              <p className="deliveryText">Адрес доставки</p>
              <input
                type="text"
                ref={input}
                placeholder="Введите адрес"
                className="deliveryAdres"
                onChange={() => setAdressIsChosen(true)}
              />
              <p
                className="errorText"
                style={{ display: `${adressNeedChose ? "block" : "none"}` }}
              >
                *Введите адрес заказа
              </p>
            </div>
            <button className="sendButton" onClick={() => sendOrder()}>
              Заказать
            </button>
          </div>
        ) : (
          <h1 className="isEmpty-lable">В корзине пусто</h1>
        )}
      </div>
      <Footer />
    </>
  );
}
export default Cartpage;
