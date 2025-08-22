import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/categories.css";
import CategoryItem from "../components/categoryitem";
import { useParams } from "react-router-dom";
import axios from "axios";

function ExtraSubCategories() {
  const { subcategory } = useParams();
  const [extraSubCategoryData, setExtraSubCategoryData] = useState([]);
  useEffect(() => {
    axios.get(`/api/subcategories/list/${subcategory}`).then((response) => {
      setExtraSubCategoryData(response.data);
    });
  }, []);
  return (
    <>
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
      </div>
      <Footer />
    </>
  );
}
export default ExtraSubCategories;
