import React from 'react';
import moment from 'moment'
import { DatePicker } from 'antd';

const dateFormat = 'DD.MM.YYYY';

const DateSelectors = ({ dateFrom, dateTo, setDateFrom, setDateTo }) => (
  <div>
    <div style={{ marginBottom: 12 }}>
      <DatePicker
        placeholder={'From'}
        size={'small'}
        value={dateFrom && moment(dateFrom)}
        format={dateFormat}
        onChange={value => setDateFrom(value ? value.toDate() : undefined)}
      />
    </div>
    <div>
      <DatePicker
        placeholder={'To'}
        size={'small'}
        value={dateTo && moment(dateTo)}
        format={dateFormat}
        onChange={value => setDateTo(value ? value.toDate() : undefined)}
      />
    </div>
  </div>
);

export default DateSelectors;