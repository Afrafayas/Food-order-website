import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const safeCategories = (categories || []).filter(
    (category) => typeof category === 'string' && category.trim() !== ''
  );

  return (
    <div>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 w-full rounded-md border text-text bg-background border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        {safeCategories.map((category, index) => (
          <option key={index} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
