import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../pages/product.jsx";
import "../styles/categoryredactor.css";
function CategoryRedactor() {
  const [componentState, setComponentState] = useState("viewing");
  const [categoryList, setCategoryList] = useState([]);
  const fileInputRef = useRef(null);
  const [dataForServer, setDataForServer] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [filtrFeatures, setFiltrFeatures] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      axios
        .get("/api/categories/list", {
          withCredentials: true,
        })
        .then((response) => {
          setCategoryList(response.data);
        });
    }
    if (componentState == "viewing") {
      fetchData();
    }
  }, [componentState]);
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
  const removeDiscount = (indexToRemove) => {
    if (filtrFeatures.length != 1) {
      setFiltrFeatures((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
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
      src: "/category/",
      image: null,
    });
    setImagePreview(null);
    setFiltrFeatures([{ name: "", value: [""] }]);
    setComponentState("adding");
    setError(null);
  }
  function changeCategory(id) {
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
    setDataForServer(newData);
    setImagePreview(elementForChange.image);
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
      return updated;
    });
  }
  function removeCategory(id) {
    axios
      .delete(`/api/categories/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const newData = categoryList.filter((element) => element._id !== id);
        setCategoryList(newData);
      });
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
  function removeFeatureValue(featureIndex, valueToRemove) {
    setFiltrFeatures((prev) => {
      return prev.map((feature, index) => {
        if (index == featureIndex && feature.value.length != 1) {
          return {
            ...feature,
            value: feature.value.filter((value) => value != valueToRemove),
          };
        } else {
          return feature;
        }
      });
    });
  }
  async function sendData() {
    try {
      let currentSrc = dataForServer.src + `${dataForServer.name}`;
      if (currentSrc.includes("/product/")) {
        currentSrc = dataForServer.src + `${dataForServer.product}`;
      }
      const data = {
        name: dataForServer.name,
        src: currentSrc,
        image1: dataForServer.image,
      };
      if (
        data.name != "" &&
        data.image1 != null &&
        dataForServer.product != ""
      ) {
      }
      if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        const response = await axios.post("/api/categories/add", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        setPrevData(data);
        if (error != null) {
          setError(null);
        }
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  }
  async function updateData() {
    try {
      let currentSrc = dataForServer.src + `${dataForServer.name}`;
      if (currentSrc.includes("/product/")) {
        currentSrc = dataForServer.src + `${dataForServer.product}`;
      }
      const data = {
        id: dataForServer.id,
        name: dataForServer.name,
        src: currentSrc,
        image1: dataForServer.image,
        imagecopy: dataForServer.image,
      };
      if (
        data.name != "" &&
        data.image1 != null &&
        dataForServer.product != ""
      ) {
        if (JSON.stringify(prevData) !== JSON.stringify(data)) {
          const response = await axios.put("/api/categories/update", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
          setPrevData(data);
        }
        if (error != null) {
          setError(null);
        }
      } else {
        setError("*заполните все поля");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
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
      {componentState == "viewing"
        ? categoryList.map((category) => (
            <div className="categoryItem">
              <h1 className="categoryName">{category.name}</h1>
              <div className="categoryButtonContainer">
                <button
                  className="changeCategory"
                  onClick={() => changeCategory(category._id)}
                >
                  Изменить
                </button>
                <button
                  className="deleteCategory"
                  onClick={() => removeCategory(category._id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        : ""}
      {componentState == "adding" ? (
        <>
          {imagePreview && (
            <img className="categoryImagePreview" src={imagePreview} />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button type="button" onClick={cleanFile}>
            Удалить файл
          </button>
          <div>
            <p>Название категории</p>
            <input
              type="text"
              name="name"
              placeholder="Название"
              value={dataForServer.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <select
            value={dataForServer.src}
            onChange={(e) => changeSrc(e.target.value)}
          >
            <option value="/category/">Ссылка на категорию</option>
            <option value="/product/">Ссылка на товар</option>
            <option value="/shop/">Ссылка на магазин</option>
          </select>
          <p>Название товара</p>
          {dataForServer.product != undefined ? (
            <input
              type="text"
              name="name"
              placeholder="Название"
              value={dataForServer.product ?? ""}
              onChange={(e) => handleInputChange("product", e.target.value)}
            />
          ) : (
            ""
          )}

          {filtrFeatures.map((feature, featureIndex) => (
            <div className="categoryInputContainer" key={featureIndex}>
              <h1>Название свойства</h1>
              <input
                value={feature.name}
                onChange={(e) =>
                  handleCategoryChange("name", e.target.value, featureIndex)
                }
              />
              <button
                className="changeCategory"
                onClick={() => addFeatureValue(featureIndex)}
              >
                Добавить значение
              </button>
              <h1 className="">Варианты значений</h1>
              <div className="inputFeatureContainer vertical">
                {feature.value.map((value, index) => (
                  <div className="inputContainer">
                    <input
                      value={value}
                      onChange={(e) =>
                        changeFeatureValue(index, featureIndex, e.target.value)
                      }
                    />
                    <button
                      className="deleteDiscount"
                      onClick={() => removeFeatureValue(featureIndex, value)}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="deleteDiscount"
                onClick={() => removeDiscount(featureIndex)}
              >
                Удалить
              </button>
              <button className="changeCategory" onClick={() => addFeature()}>
                Добавить
              </button>
            </div>
          ))}

          {error != null ? <p>{error}</p> : ""}
          <button className="changeCategory" onClick={() => sendData()}>
            Загрузить данные
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default CategoryRedactor;
