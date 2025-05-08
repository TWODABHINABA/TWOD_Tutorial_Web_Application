import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../../currencyConfig/CurrencyContext';

const countries = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'BG', name: 'Bulgaria', currency: 'BGN', symbol: 'лв' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'Fr' },
  { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK', symbol: 'Kč' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', symbol: 'kr' },
  { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', symbol: 'HK$' },
  { code: 'HU', name: 'Hungary', currency: 'HUF', symbol: 'Ft' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
  { code: 'IL', name: 'Israel', currency: 'ILS', symbol: '₪' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'IS', name: 'Iceland', currency: 'ISK', symbol: 'kr' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', symbol: '$' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
  { code: 'NO', name: 'Norway', currency: 'NOK', symbol: 'kr' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', symbol: '₱' },
  { code: 'PL', name: 'Poland', currency: 'PLN', symbol: 'zł' },
  { code: 'RO', name: 'Romania', currency: 'RON', symbol: 'lei' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { code: 'TH', name: 'Thailand', currency: 'THB', symbol: '฿' },
  { code: 'TR', name: 'Turkey', currency: 'TRY', symbol: '₺' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' }
];

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { selectedCountry, setSelectedCountry, detectedCountry, isManualSelection, resetToDetectedCountry } = useCurrency();
  const [currentCountry, setCurrentCountry] = useState(null);

  useEffect(() => {
    const current = countries.find(country => country.code === selectedCountry);
    setCurrentCountry(current);
  }, [selectedCountry]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 focus:outline-none"
      >
        {currentCountry ? (
          <>
            <span>{currentCountry.symbol}</span>
            <span>{currentCountry.code}</span>
          </>
        ) : (
          <span>Select Country</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className={`${
                  selectedCountry === country.code
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } flex items-center justify-between w-full px-4 py-2 text-sm`}
                role="menuitem"
              >
                <span>{country.name}</span>
                <span>{country.symbol}</span>
              </button>
            ))}
            {isManualSelection && (
              <button
                onClick={() => {
                  resetToDetectedCountry();
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:bg-gray-100 flex items-center justify-between w-full px-4 py-2 text-sm border-t sticky bottom-0 bg-white"
                role="menuitem"
              >
                <span>Use Detected Country</span>
                <span className="text-xs text-gray-500">({detectedCountry})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector; 