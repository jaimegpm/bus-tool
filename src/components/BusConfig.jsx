/**
 * BusConfig Component
 * Main component for configuring bus runs and calculating gold distribution
 * Handles different raid scenarios and calculates optimal gold distribution between drivers and buyers
 */
import { useState, useEffect } from 'react';
import { getAssetUrl, getOptimizedImageUrl } from '../utils/assetUtils';

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
   * Main function to calculate gold distribution between drivers
   * Handles different raid scenarios (1c7, 2c6, 5c3, 6c2, etc.)
   * Returns an array of distribution objects containing driver, buyer and gold amount
   */
  const calculateGoldDistribution = (totalPrice, driversCount, buyersCount) => {
    if (driversCount <= 0 || buyersCount <= 0) return [];
    
    // Total income and equal gold per driver
    const totalIncome = totalPrice * buyersCount;
    const goldPerDriver = Math.floor(totalIncome / driversCount);
    
    // Create the distribution plan
    const distribution = [];
    
    // Track how much gold each driver has received
    const driverGold = {};
    for (let i = 1; i <= driversCount; i++) {
      driverGold[i] = 0;
    }
    
    // Special handling for 1c7 scenario (8 player raid with 1 driver)
    if (driversCount === 1 && buyersCount === 7 && raid.totalPlayers === 8) {
      // Separar por parties para mejor visualización
      // Party 1: driver 1 + 3 buyers (n2, n3, n4)
      // Party 2: 4 buyers (n1, n2, n3, n4)
      
      distribution.push({ 
        driver: 1, 
        buyer: "all buyers n2-n4 (party 1)", 
        gold: totalPrice,
        isGrouped: true
      });
      
      distribution.push({ 
        driver: 1, 
        buyer: "all buyers n1-n4 (party 2)", 
        gold: totalPrice,
        isGrouped: true
      });
      
      driverGold[1] += totalPrice * 7; // Total sigue siendo 7 buyers
    }
    // Special handling for 2c6 scenario (8 player raid with 2 drivers)
    else if (driversCount === 2 && buyersCount === 6 && raid.totalPlayers === 8) {
      // Distribución específica para 2c6
      // Party 1: d1, d2, n3, n4
      // Party 2: n1, n2, n3, n4
      
      // Driver 1 recibe pagos de:
      // - n3 y n4 de party 1
      // - n1 de party 2
      distribution.push({ driver: 1, buyer: "n3 (party 1)", gold: totalPrice });
      distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: totalPrice });
      distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
      driverGold[1] += totalPrice * 3;
      
      // Driver 2 recibe pagos de:
      // - n2, n3 y n4 de party 2
      distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
      distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: totalPrice });
      distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: totalPrice });
      driverGold[2] += totalPrice * 3;
    }
    // Special handling for 5c3 scenario (8 player raid with 5 drivers)
    else if (driversCount === 5 && buyersCount === 3 && raid.totalPlayers === 8) {
      // Distribución específica para 5c3
      // Party 1: d1, d2, d3, d4
      // Party 2: d5, n2, n3, n4
      
      // Calculamos los montos parciales (40% y 20% del precio)
      const fullAmount = Math.floor(totalPrice * 0.4); // 40% del precio
      const halfAmount = Math.floor(totalPrice * 0.2); // 20% del precio
      
      // Distribución según tabla proporcionada
      // D1 recibe 40% de N2 y 20% de N3
      distribution.push({ driver: 1, buyer: "n2 (party 2)", gold: fullAmount });
      distribution.push({ driver: 1, buyer: "n3 (party 2)", gold: halfAmount });
      driverGold[1] += fullAmount + halfAmount;
      
      // D2 recibe 40% de N2 y 20% de N4
      distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: fullAmount });
      distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: halfAmount });
      driverGold[2] += fullAmount + halfAmount;
      
      // D3 recibe 40% de N3 y 20% de N4
      distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: fullAmount });
      distribution.push({ driver: 3, buyer: "n4 (party 2)", gold: halfAmount });
      driverGold[3] += fullAmount + halfAmount;
      
      // D4 recibe 20% de N2 y 40% de N4
      distribution.push({ driver: 4, buyer: "n2 (party 2)", gold: halfAmount });
      distribution.push({ driver: 4, buyer: "n4 (party 2)", gold: fullAmount });
      driverGold[4] += halfAmount + fullAmount;
      
      // D5 recibe 20% de N3 y 40% de N4
      distribution.push({ driver: 5, buyer: "n3 (party 2)", gold: halfAmount });
      distribution.push({ driver: 5, buyer: "n4 (party 2)", gold: fullAmount });
      driverGold[5] += halfAmount + fullAmount;
    }
    // Special handling for 6c2 scenario (8 player raid with 6 drivers)
    else if (driversCount === 6 && buyersCount === 2 && raid.totalPlayers === 8) {
      // Distribución específica para 6c2
      // Party 1: d1, d2, d3, d4
      // Party 2: d5, d6, n3, n4
      
      // Distribución solicitada:
      // d1, d2, d3 venden a n3 (party 2)
      // d4, d5, d6 venden a n4 (party 2)
      
      // Calculamos el monto que cada buyer paga a cada driver (1/3 del precio total)
      const driverShare = Math.floor(totalPrice / 3);
      // Ajuste para asegurar que la suma sea exactamente el precio total
      const remainder = totalPrice - (driverShare * 3);
      
      // Los conductores d1, d2, d3 reciben del comprador n3 (party 2)
      distribution.push({ driver: 1, buyer: "n3 (party 2)", gold: driverShare });
      driverGold[1] += driverShare;
      
      distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: driverShare });
      driverGold[2] += driverShare;
      
      // El último conductor recibe el resto para asegurar que sume exactamente el precio total
      distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: driverShare + remainder });
      driverGold[3] += driverShare + remainder;
      
      // Los conductores d4, d5, d6 reciben del comprador n4 (party 2)
      distribution.push({ driver: 4, buyer: "n4 (party 2)", gold: driverShare });
      driverGold[4] += driverShare;
      
      distribution.push({ driver: 5, buyer: "n4 (party 2)", gold: driverShare });
      driverGold[5] += driverShare;
      
      // El último conductor recibe el resto para asegurar que sume exactamente el precio total
      distribution.push({ driver: 6, buyer: "n4 (party 2)", gold: driverShare + remainder });
      driverGold[6] += driverShare + remainder;
    }
    // Special handling for 7c1 scenario (8 player raid with 7 drivers)
    else if (driversCount === 7 && buyersCount === 1 && raid.totalPlayers === 8) {
      // Distribución específica para 7c1
      // Party 1: d1, d2, d3, d4
      // Party 2: d5, d6, d7, n4
      
      // Calculamos el monto que cada driver recibe (1/7 del precio total)
      const driverShare = Math.floor(totalPrice / 7);
      // Ajuste para asegurar que la suma sea exactamente el precio total
      const remainder = totalPrice - (driverShare * 7);
      
      // Distribuimos el oro entre los 7 conductores
      for (let i = 1; i <= 7; i++) {
        // El último conductor recibe el resto para asegurar que sume exactamente el precio total
        const goldAmount = (i === 7) ? driverShare + remainder : driverShare;
        
        distribution.push({ 
          driver: i, 
          buyer: "n4 (party 2)", 
          gold: goldAmount 
        });
        
        driverGold[i] += goldAmount;
      }
    }
    // Special handling for 3c5 scenario (8 player raid with 3 drivers)
    else if (driversCount === 3 && buyersCount === 5 && raid.totalPlayers === 8) {
      // Distribución específica para 3c5
      // Party 1: d1, d2, d3, n4
      // Party 2: n1, n2, n3, n4
      
      // Primero, asignamos los buyers completos
      // Driver 1 recibe de n1 party2
      distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
      driverGold[1] += totalPrice;
      
      // Driver 2 recibe de n2 party2
      distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
      driverGold[2] += totalPrice;
      
      // Driver 3 recibe de n3 party2
      distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: totalPrice });
      driverGold[3] += totalPrice;
      
      // Ahora distribuimos los n4 de ambas parties
      // Calculamos cuánto falta a cada driver para llegar al gold per driver
      const remainingNeeded1 = goldPerDriver - driverGold[1];
      const remainingNeeded2 = goldPerDriver - driverGold[2];
      const remainingNeeded3 = goldPerDriver - driverGold[3];
      
      // Driver 1 recibe parte de n4 party1
      const d1FromN4P1 = remainingNeeded1;
      distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: d1FromN4P1 });
      driverGold[1] += d1FromN4P1;
      
      // Driver 2 recibe parte de n4 party2
      const d2FromN4P2 = remainingNeeded2;
      distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: d2FromN4P2 });
      driverGold[2] += d2FromN4P2;
      
      // Driver 3 recibe el resto de n4 party1 y n4 party2
      const d3FromN4P1 = totalPrice - d1FromN4P1;
      const d3FromN4P2 = totalPrice - d2FromN4P2;
      
      distribution.push({ driver: 3, buyer: "n4 (party 1)", gold: d3FromN4P1 });
      driverGold[3] += d3FromN4P1;
      
      distribution.push({ driver: 3, buyer: "n4 (party 2)", gold: d3FromN4P2 });
      driverGold[3] += d3FromN4P2;
    }
    // Special handling for 4-player raid scenarios
    else if (raid.totalPlayers === 4) {
      // 1c3 scenario (1 driver, 3 buyers)
      if (driversCount === 1 && buyersCount === 3) {
        // En 1c3, el único driver recibe de todos los compradores
        distribution.push({ driver: 1, buyer: "n2", gold: totalPrice });
        distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
        distribution.push({ driver: 1, buyer: "n4", gold: totalPrice });
        
        driverGold[1] += totalPrice * 3;
      }
      // 2c2 scenario (2 drivers, 2 buyers)
      else if (driversCount === 2 && buyersCount === 2) {
        // En 2c2, cada driver recibe de un comprador
        distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
        driverGold[1] += totalPrice;
        
        distribution.push({ driver: 2, buyer: "n4", gold: totalPrice });
        driverGold[2] += totalPrice;
      }
      // 3c1 scenario (3 drivers, 1 buyer)
      else if (driversCount === 3 && buyersCount === 1) {
        // En 3c1, los tres drivers reciben del único comprador
        // Calculamos la parte equitativa para cada driver
        const driverShare = Math.floor(totalPrice / 3);
        // Ajuste para asegurar que la suma sea exactamente el precio total
        const remainder = totalPrice - (driverShare * 3);
        
        // Distribuimos el oro entre los 3 conductores
        for (let i = 1; i <= 3; i++) {
          // El último conductor recibe el resto para asegurar que sume exactamente el precio total
          const goldAmount = (i === 3) ? driverShare + remainder : driverShare;
          
          distribution.push({ 
            driver: i, 
            buyer: "n4", 
            gold: goldAmount 
          });
          
          driverGold[i] += goldAmount;
        }
      }
      // Generic algorithm for other 4-player scenarios (fallback)
      else {
        // Track buyers by party
        const party1Buyers = [];
        const party2Buyers = [];
        
        // Assign buyers to parties (cada party tiene 4 posiciones)
        // Primero identificamos cuántos drivers van en cada party
        let drivers1 = Math.min(driversCount, 4);
        let drivers2 = driversCount - drivers1;
        
        // Calculamos cuántos buyers hay en cada party
        let buyers1 = 4 - drivers1;
        let buyers2 = 4 - drivers2;
        
        // Asignamos los IDs de los compradores
        for (let i = 1; i <= buyers1; i++) {
          party1Buyers.push(i + drivers1);
        }
        
        for (let i = 1; i <= buyers2; i++) {
          party2Buyers.push(i + drivers2);
        }
        
        // First assign party 2 buyers to party 2 drivers if possible, otherwise distribute among all drivers
        for (let i = 0; i < party2Buyers.length; i++) {
          // Si hay drivers en party 2, asignar preferentemente a ellos
          let driverId;
          if (drivers2 > 0 && i < drivers2) {
            // Asignar a los drivers de party 2 (los últimos)
            driverId = driversCount - drivers2 + i + 1;
          } else {
            // Asignar a cualquier driver, priorizando los que tienen menos oro
            const driverEntries = Object.entries(driverGold)
              .sort((a, b) => a[1] - b[1]);
            driverId = parseInt(driverEntries[0][0]);
          }
          
          const buyerId = party2Buyers[i];
          
          distribution.push({
            driver: driverId,
            buyer: `n${buyerId} (party 2)`,
            gold: totalPrice
          });
          
          driverGold[driverId] += totalPrice;
        }
        
        // Track remaining buyers' payments
        const buyerPayments = {};
        party1Buyers.forEach(id => {
          buyerPayments[id] = 0;
        });
        
        // Distribute party 1 buyers to balance gold
        let currentBuyerIndex = 0;
        
        // Keep distributing until all drivers have their gold or all buyers have paid
        while (Object.values(driverGold).some(gold => gold < goldPerDriver) && 
               currentBuyerIndex < party1Buyers.length) {
          
          const buyerId = party1Buyers[currentBuyerIndex];
          const buyerRemainingPayment = totalPrice - buyerPayments[buyerId];
          
          if (buyerRemainingPayment <= 0) {
            currentBuyerIndex++;
            continue;
          }
          
          // Find driver with least gold
          const driverEntries = Object.entries(driverGold)
            .sort((a, b) => a[1] - b[1]);
          
          const [driverId, gold] = driverEntries[0];
          const driverNeedsMore = goldPerDriver - gold;
          
          if (driverNeedsMore <= 0) {
            break; // All drivers have their gold
          }
          
          // Determine how much this driver should get from this buyer
          const amountToAssign = Math.min(driverNeedsMore, buyerRemainingPayment);
          
          if (amountToAssign > 0) {
            distribution.push({
              driver: parseInt(driverId),
              buyer: `n${buyerId} (party 1)`,
              gold: amountToAssign
            });
            
            driverGold[driverId] += amountToAssign;
            buyerPayments[buyerId] += amountToAssign;
            
            // If buyer has paid in full, move to next buyer
            if (buyerPayments[buyerId] >= totalPrice) {
              currentBuyerIndex++;
            }
          }
        }
      }
    }
    // Generic algorithm for other scenarios
    else {
      // Track buyers by party
      const party1Buyers = [];
      const party2Buyers = [];
      
      // Assign buyers to parties (cada party tiene 4 posiciones)
      // Primero identificamos cuántos drivers van en cada party
      let drivers1 = Math.min(driversCount, 4);
      let drivers2 = driversCount - drivers1;
      
      // Calculamos cuántos buyers hay en cada party
      let buyers1 = 4 - drivers1;
      let buyers2 = 4 - drivers2;
      
      // Asignamos los IDs de los compradores
      for (let i = 1; i <= buyers1; i++) {
        party1Buyers.push(i + drivers1);
      }
      
      for (let i = 1; i <= buyers2; i++) {
        party2Buyers.push(i + drivers2);
      }
      
      // First assign party 2 buyers to party 2 drivers if possible, otherwise distribute among all drivers
      for (let i = 0; i < party2Buyers.length; i++) {
        // Si hay drivers en party 2, asignar preferentemente a ellos
        let driverId;
        if (drivers2 > 0 && i < drivers2) {
          // Asignar a los drivers de party 2 (los últimos)
          driverId = driversCount - drivers2 + i + 1;
        } else {
          // Asignar a cualquier driver, priorizando los que tienen menos oro
          const driverEntries = Object.entries(driverGold)
            .sort((a, b) => a[1] - b[1]);
          driverId = parseInt(driverEntries[0][0]);
        }
        
        const buyerId = party2Buyers[i];
        
        distribution.push({
          driver: driverId,
          buyer: `n${buyerId} (party 2)`,
          gold: totalPrice
        });
        
        driverGold[driverId] += totalPrice;
      }
      
      // Track remaining buyers' payments
      const buyerPayments = {};
      party1Buyers.forEach(id => {
        buyerPayments[id] = 0;
      });
      
      // Distribute party 1 buyers to balance gold
      let currentBuyerIndex = 0;
      
      // Keep distributing until all drivers have their gold or all buyers have paid
      while (Object.values(driverGold).some(gold => gold < goldPerDriver) && 
             currentBuyerIndex < party1Buyers.length) {
        
        const buyerId = party1Buyers[currentBuyerIndex];
        const buyerRemainingPayment = totalPrice - buyerPayments[buyerId];
        
        if (buyerRemainingPayment <= 0) {
          currentBuyerIndex++;
          continue;
        }
        
        // Find driver with least gold
        const driverEntries = Object.entries(driverGold)
          .sort((a, b) => a[1] - b[1]);
        
        const [driverId, gold] = driverEntries[0];
        const driverNeedsMore = goldPerDriver - gold;
        
        if (driverNeedsMore <= 0) {
          break; // All drivers have their gold
        }
        
        // Determine how much this driver should get from this buyer
        const amountToAssign = Math.min(driverNeedsMore, buyerRemainingPayment);
        
        if (amountToAssign > 0) {
          distribution.push({
            driver: parseInt(driverId),
            buyer: `n${buyerId} (party 1)`,
            gold: amountToAssign
          });
          
          driverGold[driverId] += amountToAssign;
          buyerPayments[buyerId] += amountToAssign;
          
          // If buyer has paid in full, move to next buyer
          if (buyerPayments[buyerId] >= totalPrice) {
            currentBuyerIndex++;
          }
        }
      }
    }
    
    return distribution;
  };
  
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
        // Calculate gold distribution
        const distribution = calculateGoldDistribution(price, drivers, buyers);
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
  
  /**
   * Helper function to format gold values
   * Converts large numbers to k format (e.g., 1000 -> 1k)
   */
  const formatGold = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    }
    return value;
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
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg transition-all duration-300 hover:shadow-soft">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Number of Drivers
            </label>
            <div className="flex items-center">
              <button 
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                onClick={() => drivers > 1 && setDrivers(drivers - 1)}
                disabled={drivers <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                type="text"
                value={drivers}
                onChange={handleDriverChange}
                className="w-16 text-center py-1 border-y border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                onClick={() => drivers < maxDrivers && setDrivers(drivers + 1)}
                disabled={drivers >= maxDrivers}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-sm text-blue-800 dark:text-blue-300 font-medium animate-pulse-slow">
                {drivers}c{buyers} ({drivers} drivers, {buyers} buyers)
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg transition-all duration-300 hover:shadow-soft">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <div className="w-4 h-4 mr-1 flex-shrink-0">
                <img src={goldIconUrl} alt="Gold" className="w-full h-full object-contain" />
              </div>
              Total Bus Price (Gold)
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 hover:shadow-inner-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">gold</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[10000, 15000, 20000, 25000, 30000].map((amount) => (
                <button 
                  key={amount}
                  className={`text-sm py-1 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    price === amount 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-medium shadow-inner' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setPrice(amount)}
                >
                  {amount >= 1000 ? `${amount/1000}k` : amount}
                </button>
              ))}
            </div>
          </div>
          
          <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-all duration-500 relative overflow-hidden ${
            isCalculating ? 'opacity-50' : 'opacity-100'
          } ${animateResult ? 'animate-glow' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-500/5 animate-pulse-slow"></div>
            <div className="relative z-10">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Results
                {isCalculating && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </h3>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Total Buyers</div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{buyers}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                      <img src={goldIconUrl} alt="Gold" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Price per Buyer</div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatGold(price)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <img src={goldIconUrl} alt="Gold" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Total Income</div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatGold(price * buyers)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <img src={goldIconUrl} alt="Gold" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Gold per Driver</div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatGold(Math.floor(price * buyers / drivers))}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {goldDistribution.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/30">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Gold Distribution</h4>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-md p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-100 dark:border-blue-900/30">
                          <th className="text-center py-1 font-medium text-gray-600 dark:text-gray-400">Driver</th>
                          <th className="text-center py-1 font-medium text-gray-600 dark:text-gray-400">Buyer</th>
                          <th className="text-center py-1 font-medium text-gray-600 dark:text-gray-400">Gold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {goldDistribution.map((item, index) => (
                          <tr key={index} className="border-b border-blue-50 dark:border-blue-900/10 last:border-0">
                            <td className="py-1 text-center text-blue-800 dark:text-blue-300">d{item.driver}</td>
                            <td className="py-1 text-center">{item.buyer}</td>
                            <td className="py-1 flex items-center justify-center">
                              <img src={goldIconUrl} alt="Gold" className="w-3 h-3 mr-1" />
                              {item.isGrouped ? (
                                formatGold(item.gold)
                              ) : (
                                formatGold(item.gold)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}