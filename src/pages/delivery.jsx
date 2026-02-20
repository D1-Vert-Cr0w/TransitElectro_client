import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useRef, useState, useEffect } from "react";
import React from "react";
import Shield from "../assets/security.svg";
import Logistic from "../assets/delivery.svg";
import Durability from "../assets/durability.svg";
import Garantee from "../assets/garantee.svg";
import "../styles/delivery.css";
import Lamp from "../assets/lightbulb.svg";
import Banner from "../assets/99.png";
import Cog from "../assets/cog.svg";
function Delivery() {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animOnScroll");
          }
        });
      }, {});
      const elementsToAnimate = document.querySelectorAll(".animFlag");
      elementsToAnimate.forEach((el) => observer.observe(el));
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {pageLoaded == false ? (
        <div className="loadingBackground">
          <div className="loadingAnimationElement"></div>
          <img className="loadingImage" src={Lamp}></img>
          <img className=" Cog" src={Cog}></img>
        </div>
      ) : null}
      <Header />
      <h1 className="katalogTitle">Доставка</h1>
      <div className="deliveryBannerContainer">
        <img className="deliveryBannerImg" src={Banner} />
        <div className="animFlag">
          <p className="deliveryBannerText newPart ">
            Доставка Компания «Транзит Электро» предлагает гибкие варианты
            доставки металлических кабеленесущих систем, адаптированные под
            потребности вашего бизнеса.Мы обеспечиваем профессиональную доставку
            продукции непосредственно на ваш объект. Стоимость рассчитывается
            индивидуально с учетом удаленности пункта назначения и объема груза.
            Забрать готовый заказ вы можете непосредственно с нашего
            производственного склада. Это оптимальное решение для клиентов,
            желающих минимизировать логистические издержки и контролировать
            сроки получения продукции.При возникновении вопросов наш
            персональный менеджер всегда готов оказать содействие в организации
            самовывоза.
          </p>
          <p className="deliveryBannerText">
            График работы склада: понедельник – пятница, 8:00 – 17:00
          </p>
          <div className="newPart">
            <p className="deliveryBannerText">
              Необходимые документы для получения:
            </p>
            <p className="deliveryBannerText">
              • Доверенность на водителя или экспедитора
            </p>
            <p className="deliveryBannerText">
              • Паспорт лица, указанного в доверенности
            </p>
          </div>
          <p className="deliveryBannerText">
            Помимо наших проверенных партнеров, мы готовы организовать отправку
            через:
          </p>
          <p className="deliveryBannerText">
            • Федеральную транспортную компанию по вашему выбору
          </p>
          <p className="deliveryBannerText">
            • Отдельный автотранспорт для крупногабаритных заказов
          </p>
          <p className="deliveryBannerText">
            • Догрузом для оптимизации затрат
          </p>
          <p className="deliveryBannerText">
            • Железнодорожным транспортом для межрегиональных поставок
          </p>
        </div>
      </div>

      <h1 className="katalogTitle animFlag">Упаковка продукции</h1>
      <div className="deliveryTextContainer animFlag">
        <p className="deliveryBannerText">
          Надежная упаковка – гарантия сохранности вашего заказа на всех этапах
          транспортировки. Мы разработали усиленную систему упаковки,
          соответствующую стандартам промышленной логистики.
        </p>
      </div>
      <div className="advantagesTitle animFlag">
        Преимущества нашей упаковки
      </div>
      <div className="advantagesWrap animFlag">
        <img src={Shield} className="advantagesIcon" />
        <div className="advantagesTextContainer">
          <p className="advantagesSubtitle">Усиленная защита конструкции</p>
          <p className="advantagesText">
            Упаковка с укрепленными краями и углами минимизирует риск деформации
            изделий даже при интенсивных погрузочно-разгрузочных работах.
          </p>
        </div>
      </div>
      <div className="advantagesWrap animFlag">
        <img src={Durability} className="advantagesIcon" />
        <div className="advantagesTextContainer">
          <p className="advantagesSubtitle">Ударопрочность</p>
          <p className="advantagesText">
            Специальная конструкция выдерживает механические воздействия,
            типичные для междугородних и международных перевозок, обеспечивая
            целостность продукции.
          </p>
        </div>
      </div>
      <div className="advantagesWrap animFlag">
        <img src={Garantee} className="advantagesIcon" />
        <div className="advantagesTextContainer">
          <p className="advantagesSubtitle">Гарантии качества</p>
          <p className="advantagesText">
            Мы понимаем, что повреждение кабеленесущих систем при
            транспортировке недопустимо – это влияет на безопасность
            эксплуатации и долговечность изделий. Наша упаковка отражает
            приверженность высочайшим стандартам качества.
          </p>
        </div>
      </div>
      <div className="advantagesWrap animFlag">
        <img src={Logistic} className="advantagesIcon" />
        <div className="advantagesTextContainer">
          <p className="advantagesSubtitle">Эффективная логистика</p>
          <p className="advantagesText">
            Продуманная система упаковки оптимизирует процесс погрузки и
            разгрузки, сокращает время обработки груза и исключает
            дополнительные издержки, связанные с повреждениями. Каждая поставка
            от «Транзит Электро» – это надежность, пунктуальность и безупречное
            качество продукции от производителя до вашего объекта.
          </p>
        </div>
      </div>
      <h1 className="katalogTitle animFlag">Как получить счет на оплату</h1>
      <div className="deliveryTextContainer animFlag">
        <p className="deliveryBannerText">
          Для формирования счета направьте карточку предприятия с полными
          реквизитами на электронную почту tranzitelektro@bk.ru или
          персональному менеджеру вашей компании. Счет будет подготовлен в
          кратчайшие сроки.
        </p>
        <div className="newPart">
          <p className="deliveryBannerText">Минимальная сумма заказа:</p>
          <p className="deliveryBannerText">
            Для клиентов на территории РФ – от 15 000 рублей
          </p>
          <p className="deliveryBannerText">
            Для клиентов из стран СНГ – от 50 000 рублей
          </p>
        </div>
        <p className="deliveryBannerText">
          Мы работаем по системе безналичного расчета, что обеспечивает
          прозрачность и безопасность финансовых операций для обеих сторон.
        </p>
        <p className="deliveryBannerText">
          Реквизиты для оплаты: ООО «Транзит Электро» ИНН 5948067245
        </p>
      </div>
      <h1 className="katalogTitle animFlag">Оплата</h1>
      <div className="deliveryTextContainer animFlag">
        <p className="deliveryBannerText">
          Мы работаем по системе безналичного расчета, что обеспечивает
          прозрачность и безопасность финансовых операций для обеих сторон.
        </p>
        <div className="newPart">
          <p className="deliveryBannerText">Реквизиты для оплаты:</p>
          <p className="deliveryBannerText">ООО «Транзит Электро»</p>
          <p className="deliveryBannerText">ИНН 5948067245</p>
        </div>
        <p className="deliveryBannerText">
          Мы работаем по системе безналичного расчета, что обеспечивает
          прозрачность и безопасность финансовых операций для обеих сторон.
        </p>
        <p className="deliveryBannerText">
          Реквизиты для оплаты: ООО «Транзит Электро» ИНН 5948067245
        </p>
      </div>
      <h1 className="katalogTitle animFlag">Как получить счет на оплату</h1>
      <div className="deliveryTextContainer footerMargin animFlag">
        <p className="deliveryBannerText">
          Для формирования счета направьте карточку предприятия с полными
          реквизитами на электронную почту tranzitelektro@bk.ru или
          персональному менеджеру вашей компании. Счет будет подготовлен в
          кратчайшие сроки.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Delivery;
