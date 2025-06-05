import "../styles/item.css";
import { Link } from "react-router-dom";
function Item(props) {
  return (
    <>
      <div
        className={`${
          props.status == "extraItem" ? "cardWraper extraItem" : "cardWraper"
        }`}
      >
        <img className="cardImage" src={props.image}></img>
        <p className="productName">{props.name}</p>
        <p className="productPrice">{props.price}</p>

        <Link to={`/product/${props.name}`}>
          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default Item;
