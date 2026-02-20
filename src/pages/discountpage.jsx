import Header from "../components/header";
import Footer from "../components/footer";
import CategoryItem from "../components/categoryitem";
import { useEffect, useState } from "react";
import "../styles/discountpage.css";
import axios from "axios";
import DiscountItem from "../components/discountitem.jsx";
import Lamp from "../assets/lightbulb.svg";
import Cog from "../assets/cog.svg";
import AOS from "aos";
function Discount() {
  const [discountsData, setDiscountsData] = useState([]);
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
  useEffect(() => {
    axios
      .get(`https://tranzitelektro.ru/api/discount/list`)
      .then((response) => {
        setDiscountsData(response.data);
        console.log(response.data);
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
      <div className="discPageContainer">
        <h1 className="discountTitle">Акции</h1>
        {discountsData.map((discount) => (
          <div className="animFlag">
            <DiscountItem
              title={discount.title}
              text={discount.text}
              image={discount.image}
            />
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
export default Discount;
