import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/product.css";
import { useParams } from "react-router-dom";
function Product() {
  const [productData, setProductData] = useState([]);
  const params = useParams();
  useEffect(() => {
    axios.get(`/api/colection/single/${params.name}`).then((response) => {
      setProductData(response.data);
      document.documentElement.scrollTo(0, 0);
    });
  }, []);
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
                  display: `${productData.scale != "-" ? "block" : "none"}`,
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
                  display: `${productData.scale != "-" ? "block" : "none"}`,
                }}
                className="parametr"
              >
                <span className="paramName">Применение: </span>{" "}
                {productData.purpose}
              </li>
            </ul>
            <p className="singleProdPrice">{productData.price}</p>
          </div>
        </div>
        <h1
          style={{
            display: `${productData.length != 0 ? "block" : "none"}`,
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
