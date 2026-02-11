import { Link } from "react-router-dom";
import "../styles/discountitem.css";
function DiscountItem(props) {
  return (
    <>
      <div className="pageContainer">
        <div className="Info-container">
          <div className="Info-textWrap">
            <h1 className="Info-header">{props.title}</h1>
            <div className="Info-text">{props.text}</div>
            <Link to={`ditails/${props.title}`}>
              <button className="ditails">Подробнее</button>
            </Link>
          </div>
          <img className="mainInfo-img" src={props.image} />
        </div>
      </div>
    </>
  );
}
export default DiscountItem;
