import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/categories.css";
import CategoryItem from "../components/categoryitem";
import { useParams } from "react-router-dom";
import axios from "axios";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import AOS from "aos";
import search from "../assets/search.svg";
import cross from "../assets/cross.png";
function ExtraSubCategories() {
  const { subcategory } = useParams();
  const [extraSubCategoryData, setExtraSubCategoryData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const inputRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
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
    axios
      .get(`https://tranzitelektro.ru/api/extrasubcategory/list/${subcategory}`)
      .then((response) => {
        console.log(response);
        setExtraSubCategoryData(response.data);
      });
  }, []);
  async function findCategories() {
    console.log(inputRef.current.value);
    const [categories, subcategories, extrasubcategories] = await Promise.all([
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
      <div className="HeaderWrap">
        <Header />
      </div>
      <div className="headerTitleWrap">
        <h1 className="katalogTitle">Каталог</h1>
        <div className="searchWrap">
          <input
            type="text"
            name="name"
            placeholder="Название"
            className="searchInput"
            ref={inputRef}
          />
          <button
            className="searchButton"
            onClick={() => {
              (setMessage(null), setSearchResults([]), findCategories());
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
          className="resultWrap"
          style={{
            display: `${searchResults.length != 0 || message != null ? "block" : "none"}`,
          }}
        >
          <div className="resultBlock">
            {searchResults.map((category) => (
              <Link to={category.src}>
                <p className="resultItem">{category.name}</p>
              </Link>
            ))}
            {message != null ? (
              <div className="messageWrap">{message}</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="categoryContainer animFlag">
        {extraSubCategoryData.map((subcategory) => (
          <CategoryItem
            name={subcategory.name}
            src={subcategory.src}
            image={subcategory.image}
          />
        ))}
        {extraSubCategoryData.length == 0 ? (
          <h1 className="notFoundText">Подкатегории не найдены</h1>
        ) : (
          ""
        )}
      </div>
      <Footer />
    </>
  );
}
export default ExtraSubCategories;
