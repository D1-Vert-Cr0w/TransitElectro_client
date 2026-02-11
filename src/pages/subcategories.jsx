import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/categories.css";
import CategoryItem from "../components/categoryitem";
import { useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
function SubCategories() {
  const { category } = useParams();
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    axios
      .get(`https://tranzitelektro.ru/api/subcategories/list/${category}`)
      .then((response) => {
        setSubCategoryData(response.data);
      });
  }, []);
  return (
    <>
      {pageLoaded == true ? (
        <>
          <div className="HeaderWrap">
            <Header />
          </div>

          <h1 className="katalogTitle">{category}</h1>
          <div className="categoryContainer">
            {subCategoryData.map((category) => (
              <CategoryItem
                name={category.name}
                src={category.src}
                image={category.image}
              />
            ))}
          </div>
          <Footer />
        </>
      ) : (
        <div className="loadingBackground">
          <div className="loadingAnimationElement"></div>
          <img className="loadingImage" src={Lamp}></img>
          <img className=" Cog" src={Cog}></img>
        </div>
      )}
    </>
  );
}
export default SubCategories;
