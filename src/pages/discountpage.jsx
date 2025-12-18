import Header from "../components/header";
import Footer from "../components/footer";
import CategoryItem from "../components/categoryitem";
import { useEffect, useState } from "react";
import "../styles/discountpage.css";
import axios from "axios";
import DiscountItem from "../components/discountitem.jsx";

function Discount() {
  const [discountsData, setDiscountsData] = useState([]);
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
      <div className="HeaderWrap">
        <Header />
      </div>
      <div className="discPageContainer">
        <h1 className="discountTitle">Акции</h1>
        {discountsData.map((discount) => (
          <DiscountItem
            title={discount.title}
            text={discount.text}
            image={discount.image}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
export default Discount;
