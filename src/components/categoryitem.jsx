import "../styles/categorycard.css";
import { Link } from "react-router-dom";
function CategoryItem(props) {
  return (
    <>
      <div className="categoryCardWraper" data-aos="fade-up">
        <Link to={props.src}>
          <div className="categoryCardImageWrap">
            <img className="categoryCardImage" src={props.image}></img>
          </div>
          <p className="categoryProductName">{props.name}</p>
          <button className="toCart">Подробнее</button>
        </Link>
      </div>
    </>
  );
}
export default CategoryItem;
