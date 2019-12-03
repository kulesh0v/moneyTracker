import React from 'react'
import { Checkbox } from 'antd';

const CategoriesList = ({ categories, selectCategory, selectedCategories }) => (
  <ul className="categories-list">
    {
      categories.map(({ name }) => (
        <li key={name}>
          <Checkbox
            checked={selectedCategories.includes(name)}
            onChange={() => selectCategory(name)}
          >
            {name}
          </Checkbox>
        </li>
      ))
    }
  </ul >
);

export default CategoriesList;