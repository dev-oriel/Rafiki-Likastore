import React, { useCallback, useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

const PriceRangeSlider = ({ min, max, initialValues, onPriceChange }) => {
  const [minVal, setMinVal] = useState(initialValues[0]);
  const [maxVal, setMaxVal] = useState(initialValues[1]);
  const minValRef = React.useRef(initialValues[0]);
  const maxValRef = React.useRef(initialValues[1]);
  const range = React.useRef(null);

  // Convert to percentage for slider track
  const getPercent = useCallback((value) => 
    Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Update slider track color
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Handle final price change on mouse up
  const handleMouseUp = () => {
    onPriceChange([minVal, maxVal]);
  };

  return (
    <div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={100} // Set step to 100 KES
          value={minVal}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxVal - 100);
            setMinVal(value);
            minValRef.current = value;
          }}
          onMouseUp={handleMouseUp} // Send final value on release
          className="thumb thumb--left"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={maxVal}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minVal + 100);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          onMouseUp={handleMouseUp} // Send final value on release
          className="thumb thumb--right"
        />

        <div className="relative w-full">
          <div className="absolute h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full w-full z-0"></div>
          <div ref={range} className="absolute h-1 bg-amber-500 rounded-full z-10"></div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span>{formatCurrency(minVal)}</span>
        <span>{formatCurrency(maxVal)}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;