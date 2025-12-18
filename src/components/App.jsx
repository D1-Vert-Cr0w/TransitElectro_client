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
import Cartpage from "../pages/cartpage.jsx";
import Dashboard from "../pages/dashboardpage.jsx";
import { AuthProvider } from "../contexts/AuthContext.jsx";
import Discount from "../pages/discountpage.jsx";
import DiscountDitails from "../pages/discountdetails.jsx";
const $api = axios.create({
  withCredentials: true,
  baseURL: "https://tranzitelektro.ru/api",
});
axios.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const response = await $api.get(
          "https://tranzitelektro.ru/api/user/refresh",
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("user", response.data.user);
        return $api.request(originalRequest);
      } catch (e) {
        console.log("Не авторизован");
      }
    }
  }
);
if (!localStorage.getItem("user")) {
  axios
    .get("https://tranzitelektro.ru/api/user/reconnect", {
      withCredentials: true,
    })
    .then((response) => localStorage.setItem("user", response.data));
}
function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/discount" element={<Discount />}></Route>
          <Route
            path="/discount/ditails/:title"
            element={<DiscountDitails />}
          ></Route>
          <Route path="/cart" element={<Cartpage />}></Route>
          <Route path="/shop/:category" element={<Shop />}></Route>
          <Route path="/shop/:category/:subcategory" element={<Shop />}></Route>
          <Route
            path="/shop/:category/:subcategory/:extrasubcategory"
            element={<Shop />}
          ></Route>
          <Route path="/categories" element={<Categories />}></Route>
          <Route
            path="/categories/:category"
            element={<SubCategories />}
          ></Route>
          <Route
            path="/categories/:category/:subcategory"
            element={<ExtraSubCategories />}
          ></Route>
          <Route path="/product/:name" element={<Product />}></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
