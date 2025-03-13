/**
 * BusConfig Component
 * Main component for configuring bus runs and calculating gold distribution
 * Handles different raid scenarios and calculates optimal gold distribution between drivers and buyers
 */
import { useState, useEffect } from 'react';
import { getAssetUrl, getOptimizedImageUrl } from '../utils/assetUtils';
import { calculateGoldDistribution, formatGold, getDriverColor, getBuyerPartyIndicator } from '../utils/BusLogic';
import ResultsSummary from './bus/ResultsSummary';
import DriverSelector from './bus/DriverSelector';
import PriceInput from './bus/PriceInput';

export default function BusConfig({ raid, onConfigChange }) {
  // Component state management
  const [drivers, setDrivers] = useState(1);
  const [price, setPrice] = useState(5000);
  const [buyerPrice, setBuyerPrice] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [goldDistribution, setGoldDistribution] = useState([]);
  
  // Get optimized gold icon URL
  const goldIconUrl = getOptimizedImageUrl('images/icons/gold.webp', 'sm', true);
  
  // Calculate maximum drivers and buyers based on raid configuration
  const maxDrivers = raid ? raid.totalPlayers - 1 : 0;
  const buyers = raid ? raid.totalPlayers - drivers : 0;
  
  /**
   * Effect hook to handle gold distribution calculations
   * Triggers when raid, drivers or price changes
   * Updates the gold distribution and notifies parent component
   */
  useEffect(() => {
    if (raid && drivers > 0 && price > 0) {
      setIsCalculating(true);
      setAnimateResult(false);
      
      // Simulate calculation delay for better UX
      const timer = setTimeout(() => {
        // Calculate gold distribution using the imported function
        const distribution = calculateGoldDistribution(price, drivers, buyers, raid);
        setGoldDistribution(distribution);
        
        // Set buyer price (each buyer pays the full price)
        setBuyerPrice(price);
        
        onConfigChange({
          drivers,
          buyers,
          totalPrice: price,
          pricePerBuyer: price,
          goldDistribution: distribution
        });
        
        setIsCalculating(false);
        setAnimateResult(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [raid, drivers, price, buyers, onConfigChange]);
  
  /**
   * Handlers for input changes
   * Validate and update drivers count and price values
   */
  const handleDriverChange = (e) => {
    const value = e.target.value;
    
    // Si está vacío, establecer directamente a 1
    if (value === '') {
      setDrivers(1);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // Validar que sea un número
    if (isNaN(numValue)) return;
    
    // Si es menor que 1, establecer en 1
    if (numValue < 1) {
      setDrivers(1);
    } 
    // Si es mayor que el máximo, establecer al máximo
    else if (numValue >= raid.totalPlayers) {
      setDrivers(maxDrivers);
    }
    // Caso normal
    else {
      setDrivers(numValue);
    }
  };
  
  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    // Si está vacío, establecer a 0
    if (value === '') {
      setPrice(0);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // Validar que sea un número
    if (isNaN(numValue)) return;
    
    // Si es válido, actualizamos
    setPrice(numValue);
  };
  
  if (!raid) return null;
  
  /**
   * Component UI rendering
   * Includes:
   * - Driver count configuration
   * - Price input and quick selection buttons
   * - Results display with total calculations
   * - Detailed gold distribution table
   */
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-slide-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:from-blue-900/5 dark:to-purple-900/5"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Bus Configuration
        </h2>
        
        <div className="space-y-6">
          <DriverSelector 
            drivers={drivers}
            setDrivers={setDrivers}
            maxDrivers={maxDrivers}
            buyers={buyers}
            handleDriverChange={handleDriverChange}
          />
          
          <PriceInput 
            price={price}
            handlePriceChange={handlePriceChange}
            setPrice={setPrice}
            goldIconUrl={goldIconUrl}
          />
          
          <ResultsSummary 
            isCalculating={isCalculating}
            animateResult={animateResult}
            buyers={buyers}
            price={price}
            drivers={drivers}
            goldIconUrl={goldIconUrl}
            goldDistribution={goldDistribution}
          />
        </div>
      </div>
    </div>
  );
}