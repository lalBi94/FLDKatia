const priceAfterPromo = (price, promo) => {
    return price - (price * promo) / 100;
};

const refresh = () => {
    window.location.reload();
};

export { priceAfterPromo, refresh };
