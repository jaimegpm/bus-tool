/**
 * Lógica específica para la distribución de oro en raids de 4 jugadores
 */

/**
 * Calcula la distribución de oro para raids de 4 jugadores
 * @param {number} totalPrice - Precio por comprador
 * @param {number} driversCount - Número de conductores
 * @param {number} buyersCount - Número de compradores
 * @param {object} driverGold - Objeto para seguimiento del oro por conductor
 * @param {number} goldPerDriver - Oro por conductor (opcional, para caso genérico)
 * @returns {Array} Objetos de distribución
 */
export const calculateFourManDistribution = (totalPrice, driversCount, buyersCount, driverGold, goldPerDriver) => {
  const distribution = [];
  
  // 1 driver, 3 buyers
  if (driversCount === 1 && buyersCount === 3) {
    distribution.push({ driver: 1, buyer: "n2", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n4", gold: totalPrice });
    
    driverGold[1] += totalPrice * 3;
  }
  // 2 drivers, 2 buyers
  else if (driversCount === 2 && buyersCount === 2) {
    distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
    driverGold[1] += totalPrice;
    
    distribution.push({ driver: 2, buyer: "n4", gold: totalPrice });
    driverGold[2] += totalPrice;
  }
  // 3 drivers, 1 buyer
  else if (driversCount === 3 && buyersCount === 1) {
    const driverShare = Math.floor(totalPrice / 3);
    const remainder = totalPrice - (driverShare * 3);
    
    for (let i = 1; i <= 3; i++) {
      const goldAmount = (i === 3) ? driverShare + remainder : driverShare;
      
      distribution.push({ 
        driver: i, 
        buyer: "n4", 
        gold: goldAmount 
      });
      
      driverGold[i] += goldAmount;
    }
  }
  // Generic 4-player distribution
  else {
    // Para el caso genérico, necesitamos importar la función handleGenericDistribution
    // Pero como esto podría crear una dependencia circular, vamos a implementar
    // una versión simplificada específica para 4 jugadores
    distribution.push(...handleFourManGenericDistribution(totalPrice, driversCount, buyersCount, goldPerDriver || Math.floor(totalPrice * buyersCount / driversCount), driverGold));
  }
  
  return distribution;
};

/**
 * Maneja la distribución de oro para configuraciones no estándar de raids de 4 jugadores
 * @param {number} totalPrice - Precio por comprador
 * @param {number} driversCount - Número de conductores
 * @param {number} buyersCount - Número de compradores
 * @param {number} goldPerDriver - Oro por conductor
 * @param {object} driverGold - Objeto para seguimiento del oro por conductor
 * @returns {Array} Objetos de distribución
 */
const handleFourManGenericDistribution = (totalPrice, driversCount, buyersCount, goldPerDriver, driverGold) => {
  const distribution = [];
  
  // Simplificado para raids de 4 jugadores
  const buyers = [];
  for (let i = 1; i <= buyersCount; i++) {
    buyers.push(i + driversCount);
  }
  
  // Asignar compradores a conductores
  for (let i = 0; i < buyers.length; i++) {
    // Encontrar el conductor que necesita más oro
    const driverEntries = Object.entries(driverGold)
      .sort((a, b) => a[1] - b[1]);
    const driverId = parseInt(driverEntries[0][0]);
    
    const buyerId = buyers[i];
    
    distribution.push({
      driver: driverId,
      buyer: `n${buyerId}`,
      gold: totalPrice
    });
    
    driverGold[driverId] += totalPrice;
  }
  
  return distribution;
}; 