import React, { useState } from 'react';
import { formatGold } from '../../utils/BusLogic';

/**
 * Component for displaying text instructions for mail-based gold distribution
 * Shows copyable text phrases for each buyer
 */
export default function TextInstructions({ 
  goldDistribution, 
  driverNames, 
  buyerNames 
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Generate text instructions from gold distribution
  const generateInstructions = () => {
    const instructions = [];
    const buyerInstructions = {};

    // Group instructions by buyer
    goldDistribution.forEach((item) => {
      const driverName = driverNames[item.driver - 1] || `Driver${item.driver}`;
      const buyerKey = item.buyer;
      
      if (!buyerInstructions[buyerKey]) {
        buyerInstructions[buyerKey] = [];
      }
      
      buyerInstructions[buyerKey].push({
        driver: item.driver,
        driverName,
        gold: item.gold,
        isGrouped: item.isGrouped,
        totalBuyers: item.totalBuyers
      });
    });

    // Convert to instructions array
    Object.entries(buyerInstructions).forEach(([buyerKey, payments]) => {
      // Extract buyer info from key
      let buyerIndex = 0;
      let buyerName = '';
      
      if (buyerKey.includes('all buyers')) {
        // Handle grouped buyers
        const partyMatch = buyerKey.match(/party (\d+)/);
        const partyNum = partyMatch ? partyMatch[1] : '?';
        buyerName = `Party${partyNum}`;
      } else {
        // Handle individual buyers
        const buyerMatch = buyerKey.match(/n(\d+)/);
        if (buyerMatch) {
          buyerIndex = parseInt(buyerMatch[1]) - 1;
          buyerName = buyerNames[buyerIndex] || `Buyer${buyerIndex + 1}`;
        }
      }

      // Create instruction for each payment this buyer needs to make
      payments.forEach((payment) => {
        const goldText = formatGold(payment.gold);
        let instruction = `${buyerName} send ${goldText} to ${payment.driverName}`;
        
        // Add multiplier if grouped
        if (payment.isGrouped && payment.totalBuyers) {
          instruction += ` x${payment.totalBuyers}`;
        }
        
        // Ensure instruction fits in 50 characters
        if (instruction.length > 50) {
          // Try shortening names
          const shortBuyerName = buyerName.substring(0, 8);
          const shortDriverName = payment.driverName.substring(0, 8);
          instruction = `${shortBuyerName} send ${goldText} to ${shortDriverName}`;
          
          if (payment.isGrouped && payment.totalBuyers && instruction.length <= 47) {
            instruction += ` x${payment.totalBuyers}`;
          }
        }

        instructions.push({
          id: `${buyerKey}-${payment.driver}`,
          text: instruction,
          buyerName,
          driverName: payment.driverName,
          gold: payment.gold,
          originalLength: `${buyerName} send ${goldText} to ${payment.driverName}`.length
        });
      });
    });

    return instructions;
  };

  const instructions = generateInstructions();

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (instructions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No instructions to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center text-sm sm:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Mail Instructions
        </h4>
        
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Click to copy
        </span>
      </div>

      <div className="grid gap-2">
        {instructions.map((instruction, index) => (
          <div
            key={instruction.id}
            onClick={() => copyToClipboard(instruction.text, index)}
            className="group relative bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                     border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
                     rounded-lg p-3 cursor-pointer transition-all duration-200 
                     hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1 mr-2">
                {instruction.text}
              </code>
              
              <div className="flex items-center space-x-2">
                {/* Character count indicator */}
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  instruction.text.length > 50 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                    : instruction.text.length > 45
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {instruction.text.length}
                </span>
                
                {/* Copy indicator */}
                {copiedIndex === index ? (
                  <div className="flex items-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
                          bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
                          transition-opacity pointer-events-none whitespace-nowrap z-10">
              Click to copy to clipboard
            </div>
          </div>
        ))}
      </div>

      {instructions.some(i => i.text.length > 50) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Some messages exceed 50 characters. Consider using shorter names.
          </p>
        </div>
      )}
    </div>
  );
}
