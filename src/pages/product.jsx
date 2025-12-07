import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/product.css";
import { useParams } from "react-router-dom";
function Product() {
  const [productData, setProductData] = useState([]);
  const [quantity, setProductQuantity] = useState(1);
  const [prevQuantity, setPrevQuantity] = useState();
  const [tempInputValues, setTempInputValues] = useState(-1);
  const params = useParams();
  useEffect(() => {
    axios.get(`api/colection/single/${params.name}`).then((response) => {
      setProductData(response.data);
      document.documentElement.scrollTo(0, 0);
    });
  }, []);
  function changeQuantity(increment) {
    if (quantity + increment > 0) {
      setProductQuantity(quantity + increment);
    }
  }
  function handleQuantityChange(newQuantity) {
    setTempInputValues(newQuantity);
  }
  function handleBlur(newQuantity) {
    if (newQuantity != "") {
      const value = parseInt(newQuantity);
      setProductQuantity(value);
    }
    setTempInputValues(-1);
  }
  const handleKeyDown = (e) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  async function addToCart(id, image, name, quantity, price) {
    if (prevQuantity != quantity) {
      axios.post(
        `api/cart/add`,
        {
          products: {
            id: id,
            image: image,
            name: name,
            quantity: quantity,
            price: price,
          },
        },
        { withCredentials: true }
      );
    }
    setPrevQuantity(quantity);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="shopHeaderWrap">
        <Header />
      </div>
      <div className="productBody">
        <h1 className="prodPageTitle">{productData.name}</h1>
        <div className="prodInfoWrap">
          <div className="prodImageWrap">
            <img className="prodImage" src={productData.image} />
          </div>
          <div className="prodBaseInfo">
            <ul>
              <li
                style={{
                  display: `${productData.type != "-" ? "block" : "none"}`,
                }}
                className="parametr"
              >
                <span className="paramName">Тип: </span>
                {productData.type}
              </li>
              <li
                style={{
                  display: `${productData.scale != "-" ? "block" : "none"}`,
                }}
                className="parametr"
              >
                <span className="paramName">Размер: </span>
                {productData.scale}
              </li>
              <li
                style={{
                  display: `${productData.purpose != "-" ? "block" : "none"}`,
                }}
                className="parametr"
              >
                <span className="paramName">Применение: </span>{" "}
                {productData.purpose}
              </li>
            </ul>
            <p className="singleProdPrice">{productData.price} руб</p>
            <div className="quantityButton-container">
              <button
                className="cartItem-button"
                onClick={() => changeQuantity(+1)}
              >
                +
              </button>
              <input
                value={tempInputValues != -1 ? tempInputValues : quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value)}
                type="number"
                onKeyDown={handleKeyDown}
                className="cartItem-quantity"
              />
              <button
                className="cartItem-button minus"
                onClick={() => changeQuantity(-1)}
              >
                -
              </button>
              <button
                className="toCart-button"
                onClick={() =>
                  addToCart(
                    productData._id,
                    productData.image,
                    productData.name,
                    quantity,
                    productData.price
                  )
                }
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
        <h1
          style={{
            display: `${
              productData.features != undefined &&
              productData.features.length != 0
                ? "block"
                : "none"
            }`,
          }}
          className="paramsLable"
        >
          Параметры
        </h1>
        <div>
          {productData.features != undefined
            ? productData.features.map((feature) => (
                <p className="descrPart">{feature}</p>
              ))
            : ""}
        </div>
        <div className="prodInfoTitle">Описание</div>
        <hr className="infoHr"></hr>
        <div className="prodInfoText">{productData.description}</div>
      </div>
      <div className="prodFooterWrap">
        <Footer />
      </div>
    </div>
  );
}
export default Product;
