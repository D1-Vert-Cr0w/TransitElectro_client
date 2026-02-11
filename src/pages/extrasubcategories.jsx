import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/categories.css";
import CategoryItem from "../components/categoryitem";
import { useParams } from "react-router-dom";
import axios from "axios";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import AOS from "aos";
function ExtraSubCategories() {
  const { subcategory } = useParams();
  const [extraSubCategoryData, setExtraSubCategoryData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
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

      <h1 className="katalogTitle">{subcategory}</h1>
      <div className="categoryContainer">
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
