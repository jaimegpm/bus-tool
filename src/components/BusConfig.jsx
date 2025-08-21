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
import NameInputs from './bus/NameInputs';
// PresetTabs moved to BusConfigPage level

export default function BusConfig({ 
  raid, 
  onConfigChange,
  presetConfig = null,
  onPresetConfigChange = null 
}) {
  // State management
  const [drivers, setDrivers] = useState(1);
  const [price, setPrice] = useState(5000);
  const [buyerPrice, setBuyerPrice] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [goldDistribution, setGoldDistribution] = useState([]);
  const [useNewMethod, setUseNewMethod] = useState(true);
  const [driverNames, setDriverNames] = useState([]);
  const [buyerNames, setBuyerNames] = useState([]);
  // activePresetId removed - managed by parent component now
  
  const goldIconUrl = getOptimizedImageUrl('images/icons/gold.webp', 'sm', true);
  
  // Calculate max drivers and buyers
  const maxDrivers = raid ? raid.totalPlayers - 1 : 0;
  const buyers = raid ? raid.totalPlayers - drivers : 0;

  /**
   * Initialize name arrays when driver/buyer count changes
   */
  useEffect(() => {
    setDriverNames(prev => {
      const newNames = [...prev];
      while (newNames.length < drivers) newNames.push('');
      return newNames.slice(0, drivers);
    });
    
    setBuyerNames(prev => {
      const newNames = [...prev];
      while (newNames.length < buyers) newNames.push('');
      return newNames.slice(0, buyers);
    });
  }, [drivers, buyers]);
  
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

  // Apply preset configuration when received from parent
  useEffect(() => {
    if (presetConfig) {
      setDrivers(presetConfig.drivers);
      setPrice(presetConfig.price);
      
      // Load driver names, ensuring array has correct length
      const newDriverNames = [...presetConfig.driverNames];
      while (newDriverNames.length < presetConfig.drivers) newDriverNames.push('');
      setDriverNames(newDriverNames.slice(0, presetConfig.drivers));
      
      // Reset buyer names since they're not saved in presets
      setBuyerNames(prev => {
        const newNames = [];
        const buyers = raid.totalPlayers - presetConfig.drivers;
        for (let i = 0; i < buyers; i++) {
          newNames.push('');
        }
        return newNames;
      });
    }
  }, [presetConfig, raid]);
  
  // Preset handling moved to parent component (BusConfigPage)

  /**
   * Input change handlers for drivers and price
   */
  const handleDriverChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setDrivers(0);
      onPresetConfigChange && onPresetConfigChange(null); // Clear active preset
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) return;
    
    // Clear active preset when user manually changes configuration
    onPresetConfigChange && onPresetConfigChange(null);
    
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
      onPresetConfigChange && onPresetConfigChange(null); // Clear active preset
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) return;
    
    // Clear active preset when user manually changes configuration
    onPresetConfigChange && onPresetConfigChange(null);
    setPrice(numValue);
  };

  // Wrapped handlers for name changes that clear active preset
  const handleDriverNameChange = (names) => {
    setDriverNames(names);
    onPresetConfigChange && onPresetConfigChange(null);
  };

  const handleBuyerNameChange = (names) => {
    setBuyerNames(names);
    onPresetConfigChange && onPresetConfigChange(null);
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
    <div className="space-y-4 sm:space-y-6">
      {/* Configuration content without background since it's provided by parent */}
      <DriverSelector 
        drivers={drivers}
        setDrivers={setDrivers}
        maxDrivers={maxDrivers}
        buyers={buyers}
        handleDriverChange={handleDriverChange}
      />

      <NameInputs 
        drivers={drivers}
        buyers={buyers}
        driverNames={driverNames}
        buyerNames={buyerNames}
        onDriverNameChange={handleDriverNameChange}
        onBuyerNameChange={handleBuyerNameChange}
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
        useNewMethod={useNewMethod}
        onMethodToggle={setUseNewMethod}
        driverNames={driverNames}
        buyerNames={buyerNames}
      />
    </div>
  );
}