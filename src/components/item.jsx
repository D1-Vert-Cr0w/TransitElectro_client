import "../styles/item.css";
import { Link } from "react-router-dom";
function Item(props) {
  return (
    <>
      <div className={"cardWraper"}>
        <Link to={`/product/${props.name}`}>
          <div className="cardImageContainer">
            <img className="cardImage" src={props.image}></img>
          </div>
          <p className="productName">{props.name}</p>

          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default Item;
