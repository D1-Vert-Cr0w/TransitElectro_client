import Header from "../components/header";
import Footer from "../components/footer";
import CategoryItem from "../components/categoryitem";
import { useEffect, useState } from "react";
import "../styles/categories.css";
import axios from "axios";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import AOS from "aos";
function Categories() {
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    axios
      .get(`https://tranzitelektro.ru/api/categories/list`)
      .then((response) => {
        setCategoryData(response.data);
      });
  }, []);
  const [pageLoaded, setPageLoaded] = useState(false);
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

      <h1 className="katalogTitle">Каталог</h1>
      <div className="categoryContainer animFlag">
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
