export const formatPrice = (price: number | undefined | null): string => {
    if (typeof price !== 'number' || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};
