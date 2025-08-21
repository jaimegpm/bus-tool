import React, { useRef, useState } from 'react';
import { formatGold, getDriverColor, getBuyerPartyIndicator } from '../../utils/BusLogic';
import html2canvas from 'html2canvas';
import TextInstructions from './TextInstructions';

/**
 * Displays a summary panel showing:
 * - Total buyers and price per buyer
 * - Total income and gold per driver
 * - Detailed gold distribution table
 */
export default function ResultsSummary({ 
  isCalculating, 
  animateResult, 
  buyers, 
  price, 
  drivers, 
  goldIconUrl, 
  goldDistribution,
  useNewMethod,
  onMethodToggle,
  driverNames,
  buyerNames
}) {
  const tableRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  
  // Function to capture table as image and copy to clipboard
  const captureTable = async () => {
    if (!tableRef.current) return;
    
    try {
      const captureButton = document.getElementById('capture-button');
      if (captureButton) {
        captureButton.classList.add('animate-pulse');
      }
      
      setCopyStatus('capturing');
      
      try {
        await document.fonts.ready;
        console.log('Fonts are ready');
      } catch (error) {
        console.log('Font loading error (continuing anyway):', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#161926' : '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        letterRendering: true,
        removeContainer: false,
        dpi: 192,
        onclone: (document, clonedElement) => {
          const tableContainer = clonedElement.querySelector('.bg-white\\/90, .dark\\:bg-gray-800\\/90');
          if (tableContainer) {
            tableContainer.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#161926' : '#ffffff';
            tableContainer.style.backgroundImage = 'none';
          }
          
          const parentElements = tableContainer ? tableContainer.parentElement : null;
          if (parentElements) {
            parentElements.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#161926' : '#ffffff';
            parentElements.style.backgroundImage = 'none';
          }
          
          const table = clonedElement.querySelector('table');
          if (table) {
            table.style.backgroundColor = 'transparent';
          }
          
          const allTableElements = clonedElement.querySelectorAll('table, tbody, tr, td, th');
          allTableElements.forEach(el => {
            el.style.backgroundColor = 'transparent';
          });
          
          const allPositionedElements = clonedElement.querySelectorAll('*');
          allPositionedElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.position === 'relative' && !el.classList.contains('flex')) {
              el.style.position = 'static';
            }
          });
          
          const tableRows = clonedElement.querySelectorAll('tr');
          tableRows.forEach(row => {
            row.style.borderBottom = 'none';
            row.classList.remove('border-b');
            row.style.borderColor = 'transparent';
          });
          
          const headerCells = clonedElement.querySelectorAll('th');
          headerCells.forEach(cell => {
            cell.style.verticalAlign = 'middle';
            cell.style.lineHeight = '1.5';
            cell.style.padding = '8px';
            cell.style.borderBottom = 'none';
          });
          
          const allCells = clonedElement.querySelectorAll('td');
          allCells.forEach(cell => {
            cell.style.verticalAlign = 'middle';
            cell.style.padding = '8px';
            cell.style.lineHeight = '1.5';
            cell.style.borderBottom = 'none';
          });
          
          const allSpans = clonedElement.querySelectorAll('span');
          allSpans.forEach(span => {
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.justifyContent = 'center';
            span.style.lineHeight = '1';
            span.style.transform = 'none';
            span.style.position = 'static';
            span.style.verticalAlign = 'middle';
          });
          
          const firstColCells = clonedElement.querySelectorAll('td:nth-child(1) span');
          firstColCells.forEach(span => {
            span.style.transform = 'translateY(-5px)';
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.justifyContent = 'center';
            span.style.lineHeight = '1';
            span.style.position = 'relative';
            span.style.whiteSpace = 'nowrap';
            
            const originalText = span.textContent.trim();
            
            while (span.firstChild) {
              span.removeChild(span.firstChild);
            }
            
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline-block';
            wrapper.style.transform = 'translateY(-6px)';
            wrapper.style.verticalAlign = 'middle';
            wrapper.style.whiteSpace = 'nowrap';
            wrapper.textContent = originalText;
            
            span.appendChild(wrapper);
          });
          
          const secondColCells = clonedElement.querySelectorAll('td:nth-child(2) span');
          secondColCells.forEach(span => {
            span.style.transform = 'translateY(-5px)';
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.justifyContent = 'center';
            span.style.lineHeight = '1';
            span.style.position = 'relative';
            span.style.whiteSpace = 'nowrap';
            
            const textContent = span.textContent;
            
            const textNode = Array.from(span.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
              const wrapper = document.createElement('span');
              wrapper.style.display = 'inline-block';
              wrapper.style.transform = 'translateY(-6px)';
              wrapper.style.verticalAlign = 'middle';
              wrapper.textContent = textNode.textContent;
              span.replaceChild(wrapper, textNode);
            }
          });
          
          const goldCells = clonedElement.querySelectorAll('td:nth-child(3) span');
          goldCells.forEach(span => {
            span.style.transform = 'translateY(-5px)';
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.justifyContent = 'center';
            span.style.lineHeight = '1';
            span.style.position = 'relative';
            span.style.whiteSpace = 'nowrap';
            
            const textContainer = span.querySelector('span');
            if (textContainer) {
              textContainer.style.transform = 'translateY(0)';
              textContainer.style.display = 'inline-flex';
              textContainer.style.alignItems = 'center';
              textContainer.style.lineHeight = '1';
              textContainer.style.verticalAlign = 'middle';
              
              const numberText = textContainer.firstChild;
              if (numberText && numberText.nodeType === Node.TEXT_NODE) {
                const wrapper = document.createElement('span');
                wrapper.textContent = numberText.textContent;
                wrapper.style.display = 'inline-block';
                wrapper.style.transform = 'translateY(0)';
                wrapper.style.verticalAlign = 'middle';
                textContainer.replaceChild(wrapper, numberText);
              }
            }
            
            const goldIcon = span.querySelector('img');
            if (goldIcon) {
              goldIcon.style.transform = 'translateY(0)';
              goldIcon.style.display = 'inline-block';
              goldIcon.style.verticalAlign = 'middle';
            }
          });
          
          const roundedElements = clonedElement.querySelectorAll('.rounded-md, .rounded-full');
          roundedElements.forEach(el => {
            el.style.boxShadow = window.getComputedStyle(el).boxShadow;
            el.style.border = window.getComputedStyle(el).border;
          });
        }
      });
      
      canvas.toBlob(async (blob) => {
        try {
          if (!blob) {
            throw new Error('Failed to create image');
          }
          
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          
          setCopyStatus('success');
          
          if (captureButton) {
            captureButton.classList.remove('animate-pulse');
            captureButton.classList.add('text-green-500');
            setTimeout(() => {
              captureButton.classList.remove('text-green-500');
              setCopyStatus('');
            }, 2000);
          }
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          
          const url = URL.createObjectURL(blob);
          const message = 'Image could not be copied automatically. Right-click on the image and select "Copy image".';
          const newWindow = window.open(url);
          if (newWindow) {
            newWindow.document.body.innerHTML = `
              <div style="display:flex;flex-direction:column;align-items:center;font-family:system-ui,-apple-system,sans-serif;padding:20px;text-align:center;">
                <h3 style="margin-bottom:15px;color:#374151;">${message}</h3>
                <img src="${url}" alt="Gold distribution" style="max-width:100%;border:1px solid #e5e7eb;border-radius:0.5rem;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" />
              </div>
            `;
          } else {
            alert('Your browser blocked the popup. Please allow popups for this site.');
          }
          
          setCopyStatus('error');
          if (captureButton) {
            captureButton.classList.remove('animate-pulse');
          }
        }
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('Error capturing table:', error);
      alert('Could not capture the table. Please try again.');
      setCopyStatus('error');
      if (document.getElementById('capture-button')) {
        document.getElementById('capture-button').classList.remove('animate-pulse');
      }
    }
  };
  
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-5 rounded-lg transition-all duration-500 relative overflow-hidden border border-blue-200 dark:border-blue-800/50 ${
      isCalculating ? 'opacity-50' : 'opacity-100'
    } ${animateResult ? 'animate-glow' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-500/5 animate-pulse-slow"></div>
      <div className="relative z-10">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Results
          {isCalculating && (
            <svg className="animate-spin ml-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>

        {/* Main stats grid */}
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 sm:p-5 mb-3 sm:mb-5 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 p-3 sm:p-4 rounded-lg flex items-center space-x-3 sm:space-x-4 hover:shadow-md transition-all duration-300 border border-blue-200 dark:border-blue-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-blue-200 dark:border-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium tracking-wider">Total Buyers</div>
                <div className="text-xl sm:text-3xl font-bold text-blue-800 dark:text-blue-300">{buyers}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 p-3 sm:p-4 rounded-lg flex items-center space-x-3 sm:space-x-4 hover:shadow-md transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-yellow-200 dark:border-yellow-700">
                <img src={goldIconUrl} alt="Gold" className="h-5 w-5 sm:h-7 sm:w-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-yellow-600 dark:text-yellow-400 uppercase font-medium tracking-wider">Price per Buyer</div>
                <div className="text-xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-300">{formatGold(price)}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 p-3 sm:p-4 rounded-lg flex items-center space-x-3 sm:space-x-4 hover:shadow-md transition-all duration-300 border border-green-200 dark:border-green-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-green-200 dark:border-green-700">
                <img src={goldIconUrl} alt="Gold" className="h-5 w-5 sm:h-7 sm:w-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-green-600 dark:text-green-400 uppercase font-medium tracking-wider">Total Income</div>
                <div className="text-xl sm:text-3xl font-bold text-green-800 dark:text-green-300">{formatGold(price * buyers)}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 p-3 sm:p-4 rounded-lg flex items-center space-x-3 sm:space-x-4 hover:shadow-md transition-all duration-300 border border-purple-200 dark:border-purple-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-purple-200 dark:border-purple-700">
                <img src={goldIconUrl} alt="Gold" className="h-5 w-5 sm:h-7 sm:w-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-purple-600 dark:text-purple-400 uppercase font-medium tracking-wider">Gold per Driver</div>
                <div className="text-xl sm:text-3xl font-bold text-purple-800 dark:text-purple-300">{formatGold(Math.floor(price * buyers / drivers))}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gold distribution table */}
        {goldDistribution.length > 0 && (
          <div className="mt-3 sm:mt-5 pt-3 sm:pt-5 border-t border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center text-sm sm:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Gold Distribution
              </h4>
              
              <div className="flex items-center space-x-3">
                {/* Method toggle */}
                <label className="flex items-center cursor-pointer group">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mr-2">
                    New Method
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={useNewMethod}
                      onChange={(e) => onMethodToggle(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all duration-200 ${
                      useNewMethod 
                        ? 'bg-green-500 dark:bg-green-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        useNewMethod ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      } shadow-md`}></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {useNewMethod ? 'Mail' : 'Market'}
                  </span>
                </label>

                {/* Copy table button - only show for old method */}
                {!useNewMethod && (
              <button 
                id="capture-button"
                onClick={captureTable}
                className="group relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors bg-transparent border-0 outline-none focus:outline-none"
                aria-label="Copy table to clipboard"
                disabled={copyStatus === 'capturing'}
                title="Copy table to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                
                {/* Success indicator */}
                {copyStatus === 'success' && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 text-white items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </span>
                )}
                
                {/* Tooltip */}
                <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  {copyStatus === 'capturing' ? 'Copying...' : 
                   copyStatus === 'success' ? 'Copied to clipboard!' : 
                   copyStatus === 'error' ? 'Error copying' : 
                   'Copy to clipboard'}
                </span>
              </button>
                )}
              </div>
            </div>
            
            {/* Show table for old method or text instructions for new method */}
            {useNewMethod ? (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 sm:p-4 shadow-md">
                <TextInstructions 
                  goldDistribution={goldDistribution}
                  driverNames={driverNames}
                  buyerNames={buyerNames}
                />
              </div>
            ) : (
            <div ref={tableRef} className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 sm:p-4 shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      <th className="w-1/3 text-center py-2 sm:py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700" style={{ verticalAlign: 'middle' }}>Driver</th>
                      <th className="w-1/3 text-center py-2 sm:py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700" style={{ verticalAlign: 'middle' }}>Buyer</th>
                      <th className="w-1/3 text-center py-2 sm:py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700" style={{ verticalAlign: 'middle' }}>Gold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goldDistribution.map((item, index) => {
                      const driverColor = getDriverColor(item.driver);
                      return (
                        <tr key={index} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors group border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2 sm:py-3 text-center" style={{ verticalAlign: 'middle' }}>
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${driverColor.bg} transition-all duration-300 ${driverColor.text} ${driverColor.border} ${driverColor.shadow} ${driverColor.hover} text-xs sm:text-sm font-bold`} style={{ lineHeight: 1, transform: 'translateY(-5px)' }}>
                                d{item.driver}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 text-center" style={{ verticalAlign: 'middle' }}>
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium ${driverColor.bg} ${driverColor.text} transition-all duration-300 ${driverColor.border} ${driverColor.shadow} ${driverColor.hover}`} style={{ lineHeight: 1, whiteSpace: 'nowrap', transform: 'translateY(-5px)' }}>
                                {item.buyer}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 text-center" style={{ verticalAlign: 'middle' }}>
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md ${driverColor.bg} ${driverColor.text} transition-all duration-300 ${driverColor.border} ${driverColor.shadow} ${driverColor.hover}`} style={{ lineHeight: 1, whiteSpace: 'nowrap', transform: 'translateY(-5px)' }}>
                                <img src={goldIconUrl} alt="Gold" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" style={{ verticalAlign: 'middle', display: 'inline-block' }} />
                                <span className="font-medium text-xs sm:text-sm inline-flex items-center justify-center" style={{ verticalAlign: 'middle' }}>
                                  {formatGold(item.gold)}
                                  {item.isGrouped && item.totalBuyers && (
                                    <span className="text-xs ml-1 opacity-80 inline-block" style={{ whiteSpace: 'nowrap', verticalAlign: 'baseline', position: 'relative', top: 0 }}>
                                      × {item.totalBuyers}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 