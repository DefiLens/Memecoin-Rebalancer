export const currencyFormat = (num: number): string => {
    return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const numberFormat = (num: number): string => {
    return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
