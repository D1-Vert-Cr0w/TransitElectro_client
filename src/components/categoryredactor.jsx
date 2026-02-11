import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../pages/product.jsx";
import "../styles/categoryredactor.css";

function CategoryRedactor() {
  const [componentState, setComponentState] = useState("viewing");
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [dataForServer, setDataForServer] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [filtrFeatures, setFiltrFeatures] = useState(null);
  const [filtrId, setFiltrID] = useState(null);
  const [prevSrc, setPrevSrc] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageQuantity, setPageQuantity] = useState(null);
  const [error, setError] = useState(null);
  const [itemForDelete, setItemForDelete] = useState(null);
  const loadPageCount = async () => {
    try {
      const response = await axios.get(
        "https://tranzitelektro.ru/api/categories/count",
        {
          withCredentials: true,
        },
      );
      const count = response.data;
      if (count > parseInt(count)) {
        setPageQuantity(parseInt(count + 1));
      } else {
        setPageQuantity(count);
      }
      return count;
    } catch (error) {
      console.error("Ошибка загрузки количества страниц:", error);
      return 0;
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(
        `https://tranzitelektro.ru/api/categories/listadmin/${pageIndex}`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      return [];
    }
  };

  const loadCurrentPageData = async () => {
    await loadPageCount();
    const categories = await loadCategories();

    if (categories.length === 0 && pageIndex > 1) {
      const newPageIndex = pageIndex - 1;
      setPageIndex(newPageIndex);

      const newCategories = await loadCategories(newPageIndex);
      setCategoryList(newCategories);
      await loadPageCount();
    } else {
      setCategoryList(categories);
    }
  };
  const loadCategoriesByPage = async (page) => {
    try {
      const response = await axios.get(
        `https://tranzitelektro.ru/api/categories/listadmin/${page}`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      return [];
    }
  };

  useEffect(() => {
    if (componentState === "viewing") {
      loadCurrentPageData();
    }
  }, [componentState, pageIndex]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDataForServer((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function addFeature() {
    setFiltrFeatures((prev) => [...prev, { name: "", value: [""] }]);
  }

  function addFeatureValue(index) {
    setFiltrFeatures((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        value: [...updated[index].value, ""],
      };
      return updated;
    });
  }

  const removeFeature = (indexToRemove) => {
    if (filtrFeatures.length != 1) {
      setFiltrFeatures((prev) =>
        prev.filter((_, index) => index !== indexToRemove),
      );
    }
  };

  const handleCategoryChange = (fieldName, value, index) => {
    setFiltrFeatures((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [fieldName]: value,
      };
      return updated;
    });
  };

  function addCategory() {
    setDataForServer({
      name: "",
      src: "/categories/",
      image: null,
    });
    setImagePreview(null);
    setFiltrFeatures(null);
    setComponentState("adding");
    setError(null);
  }

  function changeCategory(id, name) {
    const elementForChange = categoryList.find((element) => element._id == id);
    const url = "/" + elementForChange.src.split("/")[1] + "/";
    const newData = {
      id: elementForChange._id,
      name: elementForChange.name,
      src: url,
      image: elementForChange.image,
    };

    if (url == "/product/") {
      newData.product = elementForChange.src.split("/")[2];
    }

    if (url == "/shop/") {
      axios
        .get(`https://tranzitelektro.ru/api/filtr/list/${name}`)
        .then((response) => {
          console.log(response.data);
          setFiltrFeatures(response.data.feature);
          setFiltrID(response.data._id);
        });
    }

    setDataForServer(newData);
    setImagePreview(elementForChange.image);
    setPrevSrc(elementForChange.src);
    setFiltrFeatures(elementForChange.feature);
    setComponentState("changing");
    setError(null);
  }

  const cleanFile = () => {
    setDataForServer((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function changeSrc(value) {
    setDataForServer((prev) => {
      const updated = {
        ...prev,
        src: value,
      };
      if (value == "/product/") {
        updated.product = "";
      } else if ("product" in updated) {
        delete updated.product;
      }
      if (value == "/shop/") {
        setFiltrFeatures([{ name: "", value: [""] }]);
      } else {
        setFiltrFeatures(null);
      }
      return updated;
    });
  }

  async function removeCategory(id, name) {
    try {
      await axios.delete(
        `https://tranzitelektro.ru/api/categories/delete/${id}`,
        {
          withCredentials: true,
        },
      );

      if (name) {
        await axios.delete(
          `https://tranzitelektro.ru/api/filtr/delete/${name}`,
          {
            withCredentials: true,
          },
        );
      }

      const categories = await loadCategoriesByPage(pageIndex);

      if (categories.length === 0 && pageIndex > 1) {
        const newPageIndex = pageIndex - 1;
        setPageIndex(newPageIndex);
        const newCategories = await loadCategoriesByPage(newPageIndex);
        setCategoryList(newCategories);
      } else {
        setCategoryList(categories);
      }
      await loadPageCount();
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
    }
  }

  function changeFeatureValue(index, featureIndex, newvalue) {
    setFiltrFeatures((prevFeatures) => {
      const updatedFeatures = [...prevFeatures];
      const updatedFeature = {
        ...updatedFeatures[featureIndex],
        value: [...updatedFeatures[featureIndex].value],
      };
      updatedFeature.value[index] = newvalue;
      updatedFeatures[featureIndex] = updatedFeature;
      return updatedFeatures;
    });
  }

  function removeFeatureValue(featureIndex, indexToRemove) {
    console.log(indexToRemove);
    setFiltrFeatures((prev) => {
      return prev.map((feature, index) => {
        if (index == featureIndex && feature.value.length != 1) {
          return {
            ...feature,
            value: feature.value.filter((_, index) => index != indexToRemove),
          };
        } else {
          return feature;
        }
      });
    });
  }

  function handleInputChange(field, value) {
    setDataForServer((prev) => {
      return { ...prev, [field]: value };
    });
  }

  async function sendData() {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      let currentSrc = dataForServer.src + `${dataForServer.name}`;
      if (currentSrc.includes("/product/")) {
        currentSrc = dataForServer.src + `${dataForServer.product}`;
      }

      const categoryData = {
        name: dataForServer.name,
        src: currentSrc,
        image1: dataForServer.image,
      };

      if (
        categoryData.name != "" &&
        categoryData.image1 != null &&
        (dataForServer.src !== "/product/" || dataForServer?.product != "")
      ) {
        const response = await axios.post(
          "https://tranzitelektro.ru/api/categories/add",
          categoryData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );

        if (filtrFeatures != null) {
          const arr = [];
          arr.push(dataForServer.name);
          const filtrData = {
            category: arr,
            feature: filtrFeatures,
          };
          await axios.post(
            "https://tranzitelektro.ru/api/filtr/add",
            filtrData,
          );
        }
        const count = await loadPageCount();
        setError(null);
      } else {
        setError("*Заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
      setError("Ошибка при добавлении категории");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateData() {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      let currentSrc = dataForServer.src + `${dataForServer.name}`;
      if (currentSrc.includes("/product/")) {
        currentSrc = dataForServer.src + `${dataForServer.product}`;
      }

      const categoryData = {
        id: dataForServer.id,
        name: dataForServer.name,
        src: currentSrc,
        image1: dataForServer.image,
        imagecopy: dataForServer.image,
      };

      if (
        categoryData.name != "" &&
        categoryData.image1 != null &&
        (dataForServer.src !== "/product/" || dataForServer?.product != "")
      ) {
        const response = await axios.put(
          "https://tranzitelektro.ru/api/categories/update",
          categoryData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );

        if (filtrFeatures != null) {
          const arr = [];
          arr.push(dataForServer.name);
          const filtrData = {
            id: filtrId,
            category: arr,
            feature: filtrFeatures,
          };
          await axios.put(
            "https://tranzitelektro.ru/api/filtr/update",
            filtrData,
          );
        }

        if (
          prevSrc.includes("/shop/") &&
          !dataForServer.src.includes("/shop/")
        ) {
          await axios.delete(
            `https://tranzitelektro.ru/api/filtr/delete/${dataForServer.name}`,
            {
              withCredentials: true,
            },
          );
        }
        await loadCurrentPageData();

        setError(null);
      } else {
        setError("*Заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      setError("Ошибка при обновлении категории");
    } finally {
      setIsLoading(false);
    }
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
    <div className="categoryMainWrap">
      <div className="controllButtonContainer">
        <button
          className="changeCategory"
          onClick={() => setComponentState("viewing")}
        >
          Список
        </button>
        <button className="changeCategory" onClick={() => addCategory()}>
          Добавить
        </button>
      </div>

      {componentState == "viewing" ? (
        <>
          {categoryList.map((category) => (
            <div className="categoryItem" key={category._id}>
              <h1 className="categoryName">{category.name}</h1>
              <div className="categoryButtonContainer">
                <button
                  className="changeCategory"
                  onClick={() => changeCategory(category._id, category.name)}
                >
                  Изменить
                </button>
                {itemForDelete != category._id ? (
                  <button
                    className="deleteCategory"
                    onClick={() => setItemForDelete(category._id)}
                  >
                    Удалить
                  </button>
                ) : null}
                {itemForDelete == category._id ? (
                  <div className="deleteFinalBlock">
                    <p className="orderInfo-text">Удалить:</p>
                    <button
                      className="deleteOrderButton accept"
                      onClick={() => removeCategory(category._id)}
                    >
                      Да
                    </button>
                    <button
                      className="deleteOrderButton reject"
                      onClick={() => setItemForDelete(null)}
                    >
                      Нет
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
            className="redctorPageContainer"
          >
            {pages}
          </div>
        </>
      ) : (
        ""
      )}

      {componentState == "adding" ? (
        <>
          {imagePreview && (
            <img className="categoryImagePreview" src={imagePreview} />
          )}
          <input
            type="file"
            accept="image/*"
            className="imageInput"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button type="button" className="deleteCategory" onClick={cleanFile}>
            Удалить файл
          </button>
          <div>
            <h1>Название категории</h1>
            <input
              type="text"
              name="name"
              className="categoryInput"
              placeholder="Название"
              value={dataForServer.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <select
            value={dataForServer.src}
            className="selectSrcOption marginBeforFeatures"
            onChange={(e) => changeSrc(e.target.value)}
          >
            <option value="/categories/">Ссылка на подкатегории</option>
            <option value="/product/">Ссылка на товар</option>
            <option value="/shop/">Ссылка на магазин</option>
          </select>

          {dataForServer.product != undefined ? (
            <>
              <p>Название товара</p>
              <input
                type="text"
                name="name"
                placeholder="Название"
                className="categoryInput"
                value={dataForServer.product ?? ""}
                onChange={(e) => handleInputChange("product", e.target.value)}
              />
            </>
          ) : (
            ""
          )}

          {filtrFeatures?.map((feature, featureIndex) => (
            <div className="categoryInputContainer " key={featureIndex}>
              <h1>Название свойства</h1>
              <input
                className="categoryInput"
                value={feature.name}
                onChange={(e) =>
                  handleCategoryChange("name", e.target.value, featureIndex)
                }
              />
              <div className="inputFeatureContainer">
                <button
                  className="changeCategory"
                  onClick={() => addFeatureValue(featureIndex)}
                >
                  Добавить значение
                </button>
                <button
                  className="deleteCategory"
                  onClick={() => removeFeature(featureIndex)}
                >
                  Удалить свойство
                </button>
              </div>
              <h1 className="">Варианты значений</h1>
              <div className="inputFeatureContainer vertical">
                {feature.value.map((value, index) => (
                  <div className="inputContainer">
                    <input
                      value={value}
                      className="categoryInput"
                      onChange={(e) =>
                        changeFeatureValue(index, featureIndex, e.target.value)
                      }
                    />
                    <button
                      className="deleteCategory"
                      onClick={() => removeFeatureValue(featureIndex, index)}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error != null ? <p className="errorTest">{error}</p> : ""}
          <div className="inputFeatureContainer">
            <button
              style={{ display: `${filtrFeatures != null ? "block" : "none"}` }}
              className="changeCategory"
              onClick={() => addFeature()}
            >
              Добавить свойство
            </button>
            <button
              className={isLoading ? "dataLoading" : "changeProduct"}
              onClick={sendData}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка данных..." : "Загрузить данные"}
            </button>
          </div>
        </>
      ) : (
        ""
      )}

      {componentState == "changing" ? (
        <>
          {imagePreview && (
            <img className="categoryImagePreview" src={imagePreview} />
          )}
          <input
            type="file"
            accept="image/*"
            className="imageInput"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button type="button" className="deleteCategory" onClick={cleanFile}>
            Удалить файл
          </button>
          <div>
            <h1>Название категории</h1>
            <input
              type="text"
              name="name"
              className="categoryInput"
              placeholder="Название"
              value={dataForServer.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <select
            value={dataForServer.src}
            className="selectSrcOption marginBeforFeatures"
            onChange={(e) => changeSrc(e.target.value)}
          >
            <option value="/categories/">Ссылка на подкатегории</option>
            <option value="/product/">Ссылка на товар</option>
            <option value="/shop/">Ссылка на магазин</option>
          </select>

          {dataForServer.product != undefined ? (
            <>
              <p>Название товара</p>
              <input
                type="text"
                name="name"
                placeholder="Название"
                className="categoryInput"
                value={dataForServer.product ?? ""}
                onChange={(e) => handleInputChange("product", e.target.value)}
              />
            </>
          ) : (
            ""
          )}

          {filtrFeatures?.map((feature, featureIndex) => (
            <div className="categoryInputContainer " key={featureIndex}>
              <h1>Название свойства</h1>
              <input
                className="categoryInput"
                value={feature.name}
                onChange={(e) =>
                  handleCategoryChange("name", e.target.value, featureIndex)
                }
              />
              <div className="inputFeatureContainer">
                <button
                  className="changeCategory"
                  onClick={() => addFeatureValue(featureIndex)}
                >
                  Добавить значение
                </button>
                <button
                  className="deleteCategory"
                  onClick={() => removeFeature(featureIndex)}
                >
                  Удалить свойство
                </button>
              </div>
              <h1 className="">Варианты значений</h1>
              <div className="inputFeatureContainer vertical">
                {feature.value.map((value, index) => (
                  <div className="inputContainer">
                    <input
                      value={value}
                      className="categoryInput"
                      onChange={(e) =>
                        changeFeatureValue(index, featureIndex, e.target.value)
                      }
                    />
                    <button
                      className="deleteCategory"
                      onClick={() => removeFeatureValue(featureIndex, index)}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error != null ? <p className="errorTest">{error}</p> : ""}
          <div className="inputFeatureContainer">
            <button
              style={{ display: `${filtrFeatures != null ? "block" : "none"}` }}
              className="changeCategory"
              onClick={() => addFeature()}
            >
              Добавить свойство
            </button>
            <button
              className={isLoading ? "dataLoading" : "changeProduct"}
              onClick={updateData}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка данных..." : "Загрузить данные"}
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default CategoryRedactor;
