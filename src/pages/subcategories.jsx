import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/categories.css";
import CategoryItem from "../components/categoryitem";
import { useParams } from "react-router-dom";
import axios from "axios";

function SubCategories() {
  const { category } = useParams();
  const [subCategoryData, setSubCategoryData] = useState([]);
  useEffect(() => {
    axios.get(`/api/subcategories/list/${category}`).then((response) => {
      setSubCategoryData(response.data);
    });
  }, []);
  return (
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
  );
}
export default SubCategories;
