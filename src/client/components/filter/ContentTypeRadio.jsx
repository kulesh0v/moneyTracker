import React from 'react';
import { Radio } from 'antd';
const ContentTypeRadio = ({ contentType, setContentType, contentTypes }) => {
  return (
    <Radio.Group value={contentType} onChange={(e) => { setContentType(e.target.value) }}>
      {
        contentTypes.map(type => (
          <Radio key={type.value} value={type.value}>{type.label}</Radio>
        ))
      }
    </Radio.Group>
  )
}

export default ContentTypeRadio;
