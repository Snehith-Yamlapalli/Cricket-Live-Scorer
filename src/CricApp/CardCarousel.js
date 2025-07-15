import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from './Card';

export default function CardCarousel({ livedata }) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;
  const maxIndex = Math.max(0, livedata.length - visibleCount);

  const handlePrev = () => setStartIndex(i => Math.max(0, i - 1));
  const handleNext = () => setStartIndex(i => Math.min(maxIndex, i + 1));

  const visibleItems = livedata.slice(startIndex, startIndex + visibleCount);

  return (
   <div className="position-relative">
  {/* Arrows are siblings of the overflow container */}
  <button
    className="carousel-arrow left"
    onClick={handlePrev}
    disabled={startIndex === 0}
  >
    <FaChevronLeft />
  </button>

  {/* This is the overflow window, but does not clip the arrows */}
  <div className="cards-window d-flex overflow-hidden">
    {visibleItems.map((item, idx) => (
      <div key={idx} className="flex-shrink-0 mx-2">
        <Card item={item} />
      </div>
    ))}
  </div>

  <button
    className="carousel-arrow right"
    onClick={handleNext}
    disabled={startIndex === maxIndex}
  >
    <FaChevronRight />
  </button>
</div>
  );
}
