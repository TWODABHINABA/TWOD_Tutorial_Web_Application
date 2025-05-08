import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

// Country to currency mapping
const countryToCurrency = {
  'US': 'USD',
  'AU': 'AUD',
  'BG': 'BGN',
  'BR': 'BRL',
  'CA': 'CAD',
  'CH': 'CHF',
  'CN': 'CNY',
  'CZ': 'CZK',
  'DK': 'DKK',
  'EU': 'EUR',
  'GB': 'GBP',
  'HK': 'HKD',
  'HU': 'HUF',
  'ID': 'IDR',
  'IL': 'ILS',
  'IN': 'INR',
  'IS': 'ISK',
  'JP': 'JPY',
  'KR': 'KRW',
  'MX': 'MXN',
  'MY': 'MYR',
  'NO': 'NOK',
  'NZ': 'NZD',
  'PH': 'PHP',
  'PL': 'PLN',
  'RO': 'RON',
  'SE': 'SEK',
  'SG': 'SGD',
  'TH': 'THB',
  'TR': 'TRY',
  'ZA': 'ZAR'
};

export const CurrencyProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Fetch user location using ipapi.co
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const location = {
          country: data.country_name,
          currency: data.currency,
          currencyCode: data.currency,
          countryCode: data.country_code
        };
        
        setUserLocation(location);
        
        // If no country is selected yet and no manual selection exists, use the detected country
        if (!selectedCountry && !localStorage.getItem('selectedCountry')) {
          setSelectedCountry(location.countryCode);
        }
      } catch (err) {
        console.error('❌ Error fetching user location:', err);
        setError('Failed to fetch user location');
      }
    };

    fetchUserLocation();
  }, []);

  // Load saved country preference from localStorage
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setSelectedCountry(savedCountry);
      setIsManualSelection(true);
    }
  }, []);

  // Save country preference to localStorage when it changes
  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem('selectedCountry', selectedCountry);
    }
  }, [selectedCountry]);

  // Fetch exchange rates when user location is available
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Fetch rates for all major currencies using USD as base
        const response = await fetch('https://api.frankfurter.app/latest?from=USD');
        const data = await response.json();
        setExchangeRates(data.rates);
        console.log("indian : ",data.rates);
      } catch (err) {
        console.error('❌ Error fetching exchange rates:', err);
        setError('Failed to fetch exchange rates');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Function to convert amount to user's currency
  const convertToUserCurrency = (amount, fromCurrency = 'USD') => {
    if (!exchangeRates || !selectedCountry) {
      console.log('⚠️ Missing exchange rates or country selection, returning original amount');
      return amount;
    }

    const targetCurrency = countryToCurrency[selectedCountry];
    if (!targetCurrency) {
      console.log('⚠️ No currency mapping found for country:', selectedCountry);
      return amount;
    }

    // If converting from the same currency, return the original amount
    if (fromCurrency === targetCurrency) {
      return amount;
    }

    // Convert using USD as base currency
    const toRate = exchangeRates[targetCurrency];
    if (!toRate) {
      console.log('⚠️ No exchange rate found for currency:', targetCurrency);
      return amount;
    }

    // If fromCurrency is not USD, first convert to USD
    if (fromCurrency !== 'USD') {
      const fromRate = exchangeRates[fromCurrency];
      if (!fromRate) {
        console.log('⚠️ No exchange rate found for currency:', fromCurrency);
        return amount;
      }
      // Convert to USD first
      amount = amount / fromRate;
    }

    // Convert from USD to target currency
    const convertedAmount = (amount * toRate).toFixed(2);
    return convertedAmount;
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    if (!selectedCountry) {
      console.log('⚠️ No country selected, using USD');
      return `$${amount}`;
    }

    const currencyCode = countryToCurrency[selectedCountry];
    if (!currencyCode) {
      console.log('⚠️ No currency code available for country:', selectedCountry);
      return `$${amount}`;
    }

    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
    
    return formatted;
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsManualSelection(true);
  };

  const resetToDetectedCountry = () => {
    if (userLocation?.countryCode) {
      setSelectedCountry(userLocation.countryCode);
      setIsManualSelection(false);
      localStorage.removeItem('selectedCountry');
    }
  };

  const value = {
    userLocation,
    exchangeRates,
    loading,
    error,
    convertToUserCurrency,
    formatCurrency,
    selectedCountry,
    setSelectedCountry: handleCountrySelect,
    isManualSelection,
    resetToDetectedCountry,
    detectedCountry: userLocation?.countryCode
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired
};





// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../components/User-management/api';

// const CurrencyContext = createContext();

// export const useCurrency = () => useContext(CurrencyContext);

// export const CurrencyProvider = ({ children }) => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [exchangeRates, setExchangeRates] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch user location using ipapi.co
//   useEffect(() => {
//     const fetchUserLocation = async () => {
//       try {
//         const response = await fetch('https://ipapi.co/json/');
//         const data = await response.json();
        
//         setUserLocation({
//           country: data.country_name,
//           currency: data.currency,
//           currencyCode: data.currency,
//           countryCode: data.country_code
//         });
        
//       } catch (err) {
//         console.error('❌ Error fetching user location:', err);
//         setError('Failed to fetch user location');
//       }
//     };

//     fetchUserLocation();
//   }, []);

//   // Fetch exchange rates when user location is available
//   useEffect(() => {
//     const fetchExchangeRates = async () => {
//       if (!userLocation?.currencyCode) {
//         console.log('⚠️ No currency code available yet');
//         return;
//       }

//       try {
//         const response = await fetch('https://api.frankfurter.app/latest?from=USD');
//         const data = await response.json();
//         setExchangeRates(data.rates);
//       } catch (err) {
//         console.error('❌ Error fetching exchange rates:', err);
//         setError('Failed to fetch exchange rates');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExchangeRates();
//   }, [userLocation]);

//   // Function to convert amount to user's currency
//   const convertToUserCurrency = (amount, fromCurrency = 'USD') => {
    

//     if (!exchangeRates || !userLocation?.currencyCode) {
//       console.log('⚠️ Missing exchange rates or currency code, returning original amount');
//       return amount;
//     }

//     const rate = exchangeRates[userLocation.currencyCode];
//     if (!rate) {
//       console.log('⚠️ No exchange rate found for currency:', userLocation.currencyCode);
//       return amount;
//     }

//     const convertedAmount = (amount * rate).toFixed(2);
   
//     return convertedAmount;
//   };

//   // Function to format currency
//   const formatCurrency = (amount) => {
   

//     if (!userLocation?.currencyCode) {
//       console.log('⚠️ No currency code available, using USD');
//       return `$${amount}`;
//     }

//     const formatted = new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: userLocation.currencyCode
//     }).format(amount);
    
//     return formatted;
//   };

//   const value = {
//     userLocation,
//     exchangeRates,
//     loading,
//     error,
//     convertToUserCurrency,
//     formatCurrency
//   };

//   return (
//     <CurrencyContext.Provider value={value}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// };
