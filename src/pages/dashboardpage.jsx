import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import UserDashboard from "../components/userdashbord.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboardpage.css";
import AdminDashboard from "../components/admin.jsx";
import ManagerDashboard from "../components/managerdashboard.jsx";
function Dashboard() {
  const [role, setRole] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      axios
        .get(
          `https://tranzitelektro.ru/api/user/check/${localStorage.getItem("user")}`,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setRole(response.data);
        });
    }
    fetchData();
  }, []);
  if (role == "user") {
    return (
      <>
        <div className="headerWrap">
          <Header></Header>
        </div>
        <UserDashboard />
        <Footer></Footer>
      </>
    );
  }
  if (role == "manager") {
    return (
      <>
        <div className="headerWrap">
          <Header></Header>
        </div>
        <ManagerDashboard />
        <Footer></Footer>
      </>
    );
  }
  if (role == "admin") {
    return (
      <>
        <div className="headerWrap">
          <Header></Header>
        </div>
        <AdminDashboard />
        <Footer></Footer>
      </>
    );
  }
}
export default Dashboard;
