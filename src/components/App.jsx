import { Route } from "react-router-dom";
import About from "../pages/about.jsx";
import Main from "../pages/mainpage.jsx";
import Categories from "../pages/categories.jsx";
import SubCategories from "../pages/subcategories.jsx";
import ExtraSubCategories from "../pages/extrasubcategories.jsx";
import Product from "../pages/product.jsx";
import Shop from "../pages/shoppage.jsx";
import { Routes } from "react-router-dom";
import "../styles/index.css";
import axios from "axios";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/shop/:category" element={<Shop />}></Route>
        <Route path="/shop/:category/:subcategory" element={<Shop />}></Route>
        <Route
          path="/shop/:category/:subcategory/:extrasubcategory"
          element={<Shop />}
        ></Route>
        <Route path="/categories" element={<Categories />}></Route>
        <Route path="/categories/:category" element={<SubCategories />}></Route>
        <Route
          path="/categories/:category/:subcategory"
          element={<ExtraSubCategories />}
        ></Route>
        <Route path="/product/:name" element={<Product />}></Route>
      </Routes>
    </>
  );
}

export default App;
