import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/discountredactor.css";
import ProductRedactorChange from "./productredactor_change";
import ProductRedactorAdd from "./productredactor_add";

function ProductRedactor() {
  const [componentState, setComponentState] = useState("viewing");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageQuantity, setPageQuantity] = useState();
  const [productList, setProductList] = useState([]);
  const [chosenCategory, setChosenCategory] = useState(null);
  const [chosenSubCategory, setChosenSubCategory] = useState(null);
  const [chosenExtraSubCategory, setChosenExtraSubCategory] = useState(null);
  const [categoryParams, setCategoryParams] = useState(null);
  const [subcategoryParams, setSubCategoryParams] = useState(null);
  const [extraSubcategoryParams, setExtraSubCategoryParams] = useState(null);
  const [dataForServer, setDataForServer] = useState(null);
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState(false);

  // Функция для загрузки списка товаров
  const loadProducts = async () => {
    if (componentState !== "viewing" || !chosenCategory || !areCategoriesLoaded)
      return;

    try {
      const response = await axios.get(
        "https://tranzitelektro.ru/api/colection/list",
        {
          params: {
            page: pageIndex,
            category: chosenCategory,
            subcategory: chosenSubCategory,
            extrasubcategory: chosenExtraSubCategory,
          },
        }
      );
      setProductList(response.data);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  };

  // Функция для загрузки количества страниц
  const loadPageCount = async () => {
    if (componentState !== "viewing" || !chosenCategory || !areCategoriesLoaded)
      return;

    try {
      const response = await axios.get(
        `https://tranzitelektro.ru/api/colection/count`,
        {
          params: {
            category: chosenCategory,
            subcategory: chosenSubCategory,
            extrasubcategory: chosenExtraSubCategory,
          },
        }
      );
      const count = response.data;
      setPageQuantity(count > parseInt(count) ? parseInt(count + 1) : count);
    } catch (error) {
      console.error("Ошибка загрузки количества страниц:", error);
    }
  };

  // Функция для загрузки всех данных текущей страницы
  const loadCurrentPageData = async () => {
    await loadPageCount();
    await loadProducts();

    // Если текущая страница пустая и не первая - переходим на предыдущую
    if (productList.length === 0 && pageIndex > 1) {
      const newPageIndex = pageIndex - 1;
      setPageIndex(newPageIndex);
      // Загружаем данные для новой страницы
      await loadProducts();
    }
  };

  useEffect(() => {
    async function fetchCategory() {
      const categories = await axios
        .get("https://tranzitelektro.ru/api/categories/list", {
          withCredentials: true,
        })
        .then((response) => {
          setCategoryParams(response.data);
          setChosenCategory(response.data[0].name);
        });
    }
    fetchCategory();
  }, []);

  useEffect(() => {
    async function fetchSubcategories() {
      if (!chosenCategory) return;

      try {
        const response = await axios.get(
          `https://tranzitelektro.ru/api/subcategories/list/${chosenCategory}`,
          { withCredentials: true }
        );

        if (response.data.length !== 0) {
          setSubCategoryParams(response.data);
          setChosenSubCategory(response.data[0].name);
          setExtraSubCategoryParams(null);
          setChosenExtraSubCategory(null);
          setAreCategoriesLoaded(false);
        } else {
          setSubCategoryParams(null);
          setChosenSubCategory(null);
          setExtraSubCategoryParams(null);
          setChosenExtraSubCategory(null);
          setAreCategoriesLoaded(true);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }
    if (chosenCategory) {
      fetchSubcategories();
    }
  }, [chosenCategory]);

  useEffect(() => {
    async function fetchExtraSubcategories() {
      if (!chosenSubCategory) return;

      try {
        const response = await axios.get(
          `https://tranzitelektro.ru/api/extrasubcategory/list/${chosenSubCategory}`,
          { withCredentials: true }
        );

        if (response.data.length !== 0) {
          setExtraSubCategoryParams(response.data);
          setChosenExtraSubCategory(response.data[0].name);
          setAreCategoriesLoaded(true);
        } else {
          setExtraSubCategoryParams(null);
          setChosenExtraSubCategory(null);
          setAreCategoriesLoaded(true);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }

    if (chosenSubCategory) {
      fetchExtraSubcategories();
    }
  }, [chosenSubCategory]);

  // Загружаем данные при изменении зависимостей
  useEffect(() => {
    if (componentState === "viewing" && chosenCategory && areCategoriesLoaded) {
      loadCurrentPageData();
    }
  }, [
    componentState,
    areCategoriesLoaded,
    chosenCategory,
    chosenSubCategory,
    chosenExtraSubCategory,
    pageIndex,
  ]);

  function addProduct() {
    setDataForServer({
      image: null,
      drawings: null,
      articul: "",
      name: "",
      category: chosenCategory,
      subcategory: chosenSubCategory ?? "-",
      extrasubcategory: chosenExtraSubCategory ?? "-",
      scale: "",
      type: "",
      purpose: "",
      price: "",
      features: [{ name: "", value: "" }],
      description: "",
    });
    setComponentState("adding");
  }

  function changeProduct(id) {
    const elementForChange = productList.find((element) => element._id == id);
    setDataForServer({
      id: elementForChange._id,
      image: elementForChange.image,
      drawings: elementForChange.drawings,
      articul: elementForChange.articul,
      name: elementForChange.name,
      category: elementForChange.category,
      subcategory: elementForChange.subcategory,
      extrasubcategory: elementForChange.extrasubcategory,
      scale: elementForChange.scale,
      type: elementForChange.type,
      purpose: elementForChange.purpose,
      price: elementForChange.price,
      features: elementForChange.features,
      description: elementForChange.description,
    });
    setComponentState("changing");
  }

  async function removeProduct(id) {
    try {
      // Удаляем товар
      await axios.delete(
        `https://tranzitelektro.ru/api/colection/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      // Перезагружаем данные текущей страницы
      await loadCurrentPageData();
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
    }
  }

  const pages = [];
  for (let index = 0; index < pageQuantity; index++) {
    pages.push(
      <h1
        style={{
          display: `${componentState == "viewing" ? "block" : "none"}`,
        }}
        className={`pageNumber ${index + 1 === pageIndex ? "yellow" : ""}`}
        onClick={() => setPageIndex(index + 1)}
        key={index + 1}
      >
        {index + 1}
      </h1>
    );
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
        <button className="changeDiscount" onClick={() => addProduct()}>
          Добавить
        </button>
        <select
          style={{
            display: `${componentState == "viewing" ? "block" : "none"}`,
          }}
          className="selectSrcOption"
          value={chosenCategory}
          onChange={(e) => setChosenCategory(e.target.value)}
        >
          {categoryParams?.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
        <select
          style={{
            display: `${
              componentState == "viewing" && subcategoryParams != null
                ? "block"
                : "none"
            }`,
          }}
          className="selectSrcOption"
          value={chosenSubCategory}
          onChange={(e) => setChosenSubCategory(e.target.value)}
        >
          {subcategoryParams?.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
        <select
          style={{
            display: `${
              componentState == "viewing" && extraSubcategoryParams != null
                ? "block"
                : "none"
            }`,
          }}
          className="selectSrcOption"
          value={chosenExtraSubCategory}
          onChange={(e) => setChosenExtraSubCategory(e.target.value)}
        >
          {extraSubcategoryParams?.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      {componentState == "viewing"
        ? productList.map((product) => (
            <div className="categoryItem">
              <h1 className="categoryName">{product.name}</h1>
              <div className="discountControllButtonContainer">
                <button
                  className="changeDiscount"
                  onClick={() => changeProduct(product._id)}
                >
                  Изменить
                </button>
                <button
                  className="deleteDiscount"
                  onClick={() => removeProduct(product._id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        : ""}
      {componentState == "adding" ? (
        <ProductRedactorAdd dataForChange={dataForServer}></ProductRedactorAdd>
      ) : (
        ""
      )}
      {componentState == "changing" ? (
        <ProductRedactorChange
          dataForChange={dataForServer}
        ></ProductRedactorChange>
      ) : (
        ""
      )}
      <div
        style={{
          display: `${pages.length > 1 ? "flex" : "none"}`,
        }}
        className="redctorPageContainer"
      >
        {pages}
      </div>
    </div>
  );
}

export default ProductRedactor;
