import Header from "../components/header";
import Footer from "../components/footer";
import CategoryItem from "../components/categoryitem";
import { useEffect, useState } from "react";
import "../styles/categories.css";
import axios from "axios";

function Categories() {
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:5000/categories/list`).then((response) => {
      setCategoryData(response.data);
    });
  }, []);
  return (
    <>
      <div className="HeaderWrap">
        <Header />
      </div>

      <h1 className="katalogTitle">Каталог</h1>
      <div className="categoryContainer">
        {categoryData.map((category) => (
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
export default Categories;
