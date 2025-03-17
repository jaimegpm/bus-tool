/**
 * Main component for bus run configuration and gold distribution calculations
 * Handles raid scenarios and gold distribution between drivers and buyers
 */
import { useState, useEffect } from 'react';
import { getAssetUrl, getOptimizedImageUrl } from '../utils/assetUtils';
import { calculateGoldDistribution, formatGold, getDriverColor, getBuyerPartyIndicator } from '../utils/BusLogic';
import ResultsSummary from './bus/ResultsSummary';
import DriverSelector from './bus/DriverSelector';
import PriceInput from './bus/PriceInput';

export default function BusConfig({ raid, onConfigChange }) {
  // State management
  const [drivers, setDrivers] = useState(1);
  const [price, setPrice] = useState(5000);
  const [buyerPrice, setBuyerPrice] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [goldDistribution, setGoldDistribution] = useState([]);
  
  const goldIconUrl = getOptimizedImageUrl('images/icons/gold.webp', 'sm', true);
  
  // Calculate max drivers and buyers
  const maxDrivers = raid ? raid.totalPlayers - 1 : 0;
  const buyers = raid ? raid.totalPlayers - drivers : 0;
  
  /**
   * Handles gold distribution calculations when raid, drivers or price changes
   * Updates distribution and notifies parent component
   */
  useEffect(() => {
    if (raid && drivers > 0 && price > 0) {
      setIsCalculating(true);
      setAnimateResult(false);
      
      const timer = setTimeout(() => {
        const distribution = calculateGoldDistribution(price, drivers, buyers, raid);
        setGoldDistribution(distribution);
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
   * Input change handlers for drivers and price
   */
  const handleDriverChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setDrivers(0);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) return;
    
    if (numValue < 1) {
      setDrivers(1);
    } 
    else if (numValue >= raid.totalPlayers) {
      setDrivers(maxDrivers);
    }
    else {
      setDrivers(numValue);
    }
  };
  
  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setPrice(0);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) return;
    
    setPrice(numValue);
  };
  
  if (!raid) return null;
  
  /**
   * Main component render with:
   * - Driver configuration
   * - Price inputs
   * - Results display
   * - Gold distribution table
   */
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md animate-slide-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:from-blue-900/5 dark:to-purple-900/5"></div>
      <div className="relative z-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Bus Configuration
        </h2>
        
        <div className="space-y-4 sm:space-y-6">
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