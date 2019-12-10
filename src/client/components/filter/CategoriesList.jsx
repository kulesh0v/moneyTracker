import React from 'react'
import { Checkbox, Icon } from 'antd';

const CategoriesList = ({ categories, selectCategory, editCategory, deleteCategory, selectedCategories }) => (
  <ul className="categories-list">
    {
      categories.map((category) => (
        <li key={category.key} style={{ display: 'flex' }}>
          <Checkbox
            checked={selectedCategories.includes(category.name)}
            onChange={() => selectCategory(category.name)}
          >
            {category.name}
          </Checkbox>
          <div style={{ marginLeft: 'auto', marginRight: 24 }}>
            <button className="clear-button" onClick={() => editCategory(category)}>
              <Icon type="edit" />
            </button>
            <button className="clear-button" onClick={() => deleteCategory(category)}>
              <Icon type="delete" style={{ marginLeft: 6 }} />
            </button>
          </div>
        </li>
      ))
    }
  </ul >
);

export default CategoriesList;