import React from 'react';
import CategoriesList from './CategoriesList.jsx';
import DateSelectors from './DateSelectors.jsx';
import Search from './Search.jsx';
import ContentTypeRadio from './ContentTypeRadio.jsx';

const Filter = (props) => {
  return (
    <div style={{ marginLeft: 12, marginTop: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <ContentTypeRadio
          contentTypes={props.contentTypes}
          setContentType={props.setContentType}
          contentType={props.contentType}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Search
          value={props.searchText}
          onChange={props.setSearchText}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <DateSelectors
          dateTo={props.dateTo}
          dateFrom={props.dateFrom}
          setDateTo={props.setDateTo}
          setDateFrom={props.setDateFrom}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <CategoriesList
          selectedCategories={props.selectedCategories}
          selectCategory={props.selectCategory}
          categories={props.categories}
        />
      </div>
    </div>
  )
};

export default Filter;