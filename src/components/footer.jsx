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
            <Link to="/">Transit Electro</Link>
          </p>
        </div>
        <div>
          <span className="footerText need-to-hide">
            <Link to="/about" className="footerlinkDecor">
              О нас
            </Link>
          </span>
          <span className="footerText specElemMrgn">
            <Link to="/shop" className="footerlinkDecor">
              Каталог
            </Link>
          </span>
        </div>
        <div className="footerSubContainer">
          <p className="footerText">8-800-555-35-35</p>
          <p className="footerText">tranzitelektro@bk.ru</p>
        </div>
      </div>
    </div>
  );
}
export default Footer;
