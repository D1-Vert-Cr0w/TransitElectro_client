import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import UserDashboard from "../components/userdashbord.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboardpage.css";
import AdminDashboard from "../components/admin.jsx";
function Dashboard() {
  const [role, setRole] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      axios
        .get(`/api/user/check/${localStorage.getItem("user")}`, {
          withCredentials: true,
        })
        .then((response) => {
          setRole(response.data);
        });
    }
    fetchData();
  }, []);
  async function logout() {
    await axios.delete("api/user/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }
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
