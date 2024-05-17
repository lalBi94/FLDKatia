import "./PricePromo.scss";

export function PricePromo({ oldPrice, newPrice }) {
    return (
        <div className="price-promo-container">
            <span className="price-promo-old">{oldPrice}€</span>
            <span className="price-promo-new">{newPrice}€</span>
        </div>
    );
}
