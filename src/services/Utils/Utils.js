/**
 * Prix apres reduction
 * @param {float} price
 * @param {number} promo
 * @return {float}
 */
const priceAfterPromo = (price, promo) => {
    return price - (price * promo) / 100;
};

/**
 * Rafraichir la page
 */
const refresh = () => {
    window.location.reload();
};

export { priceAfterPromo, refresh };
