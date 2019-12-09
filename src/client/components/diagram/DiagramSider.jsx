import React from 'react';
import moment from 'moment';
import { DatePicker, Button } from 'antd';
const { MonthPicker } = DatePicker;

const DiagramSider = ({ date, setDate, closeDiagram }) => (
  <div style={{ marginLeft: 12, marginTop: 24 }}>
    <div style={{ marginBottom: 12 }}>
      <MonthPicker
        size={'small'}
        onChange={value => setDate(value ? value.toDate() : undefined)}
        value={date && moment(date)}
        placeholder="Select month"
      />
    </div>
    <Button onClick={closeDiagram} style={{ width: 173 }}>Back </Button>
  </div >
);
export default DiagramSider;
