






// import { useCurrency } from './CurrencyContext';

// export const useCurrencyConverter = () => {
//   const { 
//     userLocation, 
//     exchangeRates, 
//     loading, 
//     error, 
//     convertToUserCurrency, 
//     formatCurrency 
//   } = useCurrency();

//   const convertAndFormat = (amount, fromCurrency = 'USD') => {
    

//     const convertedAmount = convertToUserCurrency(amount, fromCurrency);

//     const formattedAmount = formatCurrency(convertedAmount);
//     console.log('💰 useCurrencyConverter - Final formatted amount:', formattedAmount);

//     return formattedAmount;
//   };

//   return {
//     userLocation,
//     exchangeRates,
//     loading,
//     error,
//     convertToUserCurrency,
//     formatCurrency,
//     convertAndFormat
//   };
// }; 






import { useCurrency } from './CurrencyContext';

export const useCurrencyConverter = () => {
  const { 
    userLocation, 
    exchangeRates, 
    loading, 
    error, 
    convertToUserCurrency, 
    formatCurrency,
    selectedCountry,
    setSelectedCountry,
    isManualSelection,
    resetToDetectedCountry
  } = useCurrency();

  const convertAndFormat = (amount, fromCurrency = 'USD') => {
    const convertedAmount = convertToUserCurrency(amount, fromCurrency);
    const formattedAmount = formatCurrency(convertedAmount);
    console.log('💰 useCurrencyConverter - Final formatted amount:', formattedAmount);
    return formattedAmount;
  };

  return {
    userLocation,
    exchangeRates,
    loading,
    error,
    convertToUserCurrency,
    formatCurrency,
    convertAndFormat,
    selectedCountry,
    setSelectedCountry,
    isManualSelection,
    resetToDetectedCountry
  };
}; 