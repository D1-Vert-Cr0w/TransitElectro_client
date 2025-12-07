import Logo from "../assets/logowhite.svg";
import "../styles/footer.css";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="footerWrap">
      <div className="footerContainer">
        <div className="logoContainer">
          <img src={Logo} className="footerLogo" />
          <p className="footerLogoLable">
            <Link to="/">Транзит Электро</Link>
          </p>
        </div>
        <div className="footerTextContainer">
          <span className="footerText need-to-hide">
            <Link to="/about" className="footerlinkDecor">
              О нас
            </Link>
          </span>
          <span className="footerText specElemMrgn">
            <Link to="/categories" className="footerlinkDecor">
              Каталог
            </Link>
          </span>
        </div>
        <div className="footerSubContainer">
          <p className="footerText">+7(342)247-77-37</p>
          <p className="footerText">пн-пт 9:00-18:00</p>
          <p className="footerText">tranzitelektro@bk.ru</p>
        </div>
      </div>
    </div>
  );
}
export default Footer;
