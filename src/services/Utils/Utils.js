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

/**
 * Checkeur de mot de passe
 * @param {string} password LE mot de passe a check
 * @return {boolean}
 */
const checkPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{6,})$/.test(password);
};

/**
 * Checkeur d'email
 * @param {string} email L'email a check
 * @return {boolean}
 */
const checkEmail = (email) => {
    return /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export { priceAfterPromo, refresh, checkPassword, checkEmail };
