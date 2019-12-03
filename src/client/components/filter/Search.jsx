import React from 'react';
import { Input } from 'antd';

const Search = ({ value, onChange }) => (
  <div style={{ width: 173 }}>
    <Input
      size={'small'}
      placeholder={'Search ...'}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

export default Search;