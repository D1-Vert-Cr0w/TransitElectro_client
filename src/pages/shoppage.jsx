import "../styles/shoppage.css";
import Footer from "../components/footer.jsx";
import Header from "../components/header.jsx";
import Item from "../components/item.jsx";
import { useState, useEffect } from "react";
import Dropdown from "../components/dropdown.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

function Shop() {
  const params = useParams();
  const [products, setProducts] = useState([{}]);
  const [pageIndex, setPageIndex] = useState(1);
  const [subcategoryParams, setSubcategoryParams] = useState();
  const [categoryParams, setCategoryParams] = useState(params.category);
  const [filtrPreset, setFiltrPreset] = useState("");
  const [filtr, setFiltr] = useState([]);
  const [pageQuantity, setPageQuantity] = useState();
  useEffect(() => {
    setPageIndex(1);
    axios
      .get(`/api/colection/list`, {
        params: {
          page: pageIndex,
          subcategory: subcategoryParams,
          category: categoryParams,
          filtrPreset: filtrPreset,
        },
      })
      .then((response) => {
        setProducts(response.data);
      });
    axios
      .get(`/api/colection/count`, {
        params: {
          subcategory: subcategoryParams,
          category: categoryParams,
          filtrPreset: filtrPreset,
        },
      })
      .then((response) => {
        if (response.data > parseInt(response.data)) {
          setPageQuantity(parseInt(response.data + 1));
        } else {
          setPageQuantity(response.data);
        }
      });
  }, [filtrPreset]);
  useEffect(() => {
    axios
      .get(`/api/colection/list`, {
        params: {
          page: pageIndex,
          subcategory: subcategoryParams,
          category: categoryParams,
          filtrPreset: filtrPreset,
        },
      })
      .then((response) => {
        setProducts(response.data);
      });
  }, [pageIndex]);
  useEffect(() => {
    axios
      .get(`/api/filtr/list/${params.subcategory ?? params.category}`)
      .then((response) => {
        setFiltr(response.data);
      });
  }, []);
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
        </h1>
      );
    }
  }
  function changeFiltrPresset(name, value) {
    let testString = filtrPreset != "" ? filtrPreset.split(";") : [];
    let record = name + ": " + value;
    if (testString.indexOf(record) != -1) {
      testString.splice(testString.indexOf(record), 1);
    } else {
      testString.push(record);
    }
    setFiltrPreset(testString.join(";"));
  }
  return (
    <>
      <div className="shopHeaderWrap">
        <Header />
      </div>
      <h1 className="shopTitleWrap">{params.subcategory ?? params.category}</h1>
      <div className="shopWrap">
        <div className="DropdownContainer">
          <Dropdown
            title={"Фильтр"}
            content={
              <div className="filtrContainer">
                {filtr.length != 0
                  ? filtr.map((preset) => (
                      <>
                        <h1 className="featureTitle">{preset.name}</h1>
                        {preset.value.map((feature) => (
                          <div className="featureContainer">
                            <div
                              className="checkButton"
                              onClick={() => {
                                changeFiltrPresset(preset.name, feature);
                              }}
                            >
                              <div
                                className={`checkIn ${
                                  filtrPreset.indexOf(
                                    preset.name + ": " + feature
                                  ) != -1
                                    ? "yellow"
                                    : ""
                                }`}
                              ></div>
                            </div>
                            <p className="featureValue">{feature}</p>
                          </div>
                        ))}
                      </>
                    ))
                  : ""}
              </div>
            }
          />
        </div>
        <div className="mainContainer">
          <div
            className={`${
              filtr.length == 0 ? "containerWithoutFiltr " : "productsContainer"
            }`}
          >
            {products.map((product) => (
              <Item
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
          <h1
            style={{ display: `${products.length == 0 ? "block" : "none"}` }}
            className="notFoundLable"
          >
            Товары не найдены
          </h1>
          <div
            style={{ display: `${pageQuantity != 1 ? "block" : "none"}` }}
            className="pageNumContainer"
          >
            {pages}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Shop;
