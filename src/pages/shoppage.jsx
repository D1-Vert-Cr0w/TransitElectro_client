import "../styles/shoppage.css";
import Footer from "../components/footer.jsx";
import Header from "../components/header.jsx";
import Item from "../components/item.jsx";
import { useState, useEffect, useRef } from "react";
import Dropdown from "../components/dropdown.jsx";
import axios from "axios";
import AOS from "aos";
import Lamp from "../assets/lightbulb.svg";
import search from "../assets/search.svg";
import cross from "../assets/cross.png";
import Cog from "../assets/cog.svg";
import { useParams, Link } from "react-router-dom";

function Shop() {
  const params = useParams();
  const [products, setProducts] = useState([{}]);
  const [pageIndex, setPageIndex] = useState(1);
  const [subcategoryParams, setSubcategoryParams] = useState(
    params.subcategory,
  );
  const [extraSubcategoryParams, extrasetSubcategoryParams] = useState(
    params.extrasubcategory,
  );
  const [categoryParams, setCategoryParams] = useState(params.category);
  const [filtrPreset, setFiltrPreset] = useState("");
  const [filtr, setFiltr] = useState([]);
  const inputRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [pageQuantity, setPageQuantity] = useState();
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setSubcategoryParams(params.subcategory);
    extrasetSubcategoryParams(params.extrasubcategory);
    setCategoryParams(params.category);
    setPageIndex(1);
  }, [params]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animOnScroll");
          }
        });
      }, {});
      const elementsToAnimate = document.querySelectorAll(".animFlag");
      elementsToAnimate.forEach((el) => observer.observe(el));
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setPageIndex(1);
    axios
      .get(`https://tranzitelektro.ru/api/colection/list`, {
        params: {
          page: pageIndex,
          subcategory: subcategoryParams,
          extrasubcategory: extraSubcategoryParams,
          category: categoryParams,
          filtrPreset: filtrPreset,
        },
      })
      .then((response) => {
        setProducts(response.data);
      });
    axios
      .get(`https://tranzitelektro.ru/api/colection/count`, {
        params: {
          subcategory: subcategoryParams,
          extrasubcategory: extraSubcategoryParams,
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
  }, [filtrPreset, categoryParams, subcategoryParams, extraSubcategoryParams]);
  useEffect(() => {
    axios
      .get(`https://tranzitelektro.ru/api/colection/list`, {
        params: {
          page: pageIndex,
          extrasubcategory: extraSubcategoryParams,
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
      .get(
        `https://tranzitelektro.ru/api/filtr/list/${
          params.extrasubcategory ?? params.subcategory ?? params.category
        }`,
      )
      .then((response) => {
        setFiltr(response.data?.feature);
      });
  }, [categoryParams, subcategoryParams, extraSubcategoryParams]);
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

  async function findProducts() {
    console.log(inputRef.current.value);
    const [categories, subcategories, extrasubcategories, products] =
      await Promise.all([
        axios.get(
          `https://tranzitelektro.ru/api/categories/search/${inputRef.current.value}`,
          {
            validateStatus: () => true,
          },
        ),
        axios.get(
          `https://tranzitelektro.ru/api/subcategories/search/${inputRef.current.value}`,
          {
            validateStatus: () => true,
          },
        ),
        axios.get(
          `https://tranzitelektro.ru/api/extrasubcategory/search/${inputRef.current.value}`,
          {
            validateStatus: () => true,
          },
        ),
        axios.get(
          `https://tranzitelektro.ru/api/colection/search/${inputRef.current.value}`,
          {
            validateStatus: () => true,
          },
        ),
      ]);
    if (
      categories.status == 404 &&
      subcategories.status == 404 &&
      extrasubcategories.status == 404
    ) {
      setMessage("По вашему запросу ничего не найдено");
    } else {
      const allResults = [
        ...categories.data,
        ...subcategories.data,
        ...extrasubcategories.data,
        ...products.data,
      ];
      if (allResults.length != 0) {
        setSearchResults(allResults);
      } else {
        setMessage("Введите название категории");
      }
    }
  }
  return (
    <>
      {pageLoaded == false ? (
        <div className="loadingBackground">
          <div className="loadingAnimationElement"></div>
          <img className="loadingImage" src={Lamp}></img>
          <img className=" Cog" src={Cog}></img>
        </div>
      ) : null}
      <div className="shopHeaderWrap">
        <Header />
      </div>

      <h1 className="shopTitleWrap animFlag">
        {params.subcategory ?? params.category ?? params.extrasubcategory}
      </h1>

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
                                  filtrPreset
                                    .split(";")
                                    .includes(preset.name + ": " + feature)
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

        <div className="mainContainer animFlag">
          <div className="headerShopTitleWrap">
            <div className="searchWrap">
              <input
                type="text"
                name="name"
                placeholder="Название"
                className="searchShopInput"
                ref={inputRef}
              />

              <div className="searchButtonWrap">
                <button
                  className="searchButton"
                  onClick={() => {
                    (setMessage(null), setSearchResults([]), findProducts());
                  }}
                >
                  <img className="shopPageIcon" src={search} />
                </button>
                <button
                  className="searchCleanButton"
                  onClick={() => {
                    (setSearchResults([]),
                      setMessage(null),
                      (inputRef.current.value = ""));
                  }}
                >
                  <img className="shopPageIcon" src={cross} />
                </button>
              </div>
              <div
                className="shopResultWrap"
                style={{
                  display: `${searchResults.length != 0 || message != null ? "block" : "none"}`,
                }}
              >
                <div className="resultBlock">
                  {searchResults.map((product) => (
                    <Link to={product.src}>
                      <p className="resultItem">{product.name}</p>
                    </Link>
                  ))}
                  {message != null ? (
                    <div className="messageWrap">{message}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${
              filtr.length == 0 ? "containerWithoutFiltr " : "productsContainer"
            }`}
          >
            {products.map((product) => (
              <Item
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
          <h1
            style={{
              display: `${products.length == 0 ? "block" : "none"}`,
            }}
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
