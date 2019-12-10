import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { Modal, Input, InputNumber, DatePicker } from 'antd';

const ProfitModal = ({ visible, type, profit, onOk, onCancel }) => {
  const dateFormat = 'DD.MM.YYYY';
  const [name, setName] = useState();
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(new Date);

  useEffect(() => {
    if (profit) {
      setName(profit.name);
      setPrice(profit.price);
      setDate(new Date(profit.date));
    } else {
      setName();
      setPrice(0);
      setDate(new Date);
    }
  }, [profit]);

  return (
    <Modal
      title={type === 'edit' ? 'Edit profit' : 'Add profit'}
      visible={visible}
      onOk={() => onOk({ name, date, price, key: profit && profit.key })}
      onCancel={onCancel}
      okButtonProps={{ disabled: !(date && date < new Date && price && name) }}
    >
      <p>
        <Input
          onChange={e => setName(e.target.value)}
          placeholder={'Comment'}
          minLength={1}
          maxLength={25}
          value={name}
        />
      </p>
      <p>
        <InputNumber
          formatter={value => `$ ${value}`}
          onChange={setPrice}
          value={price}
          min={0}
          max={10 ** 12}
        />
      </p>
      <p>
        <DatePicker
          placeholder={"Select date of profit"}
          value={date && moment(date)}
          onChange={value => setDate(value ? value.toDate() : undefined)}
          format={dateFormat}
        />
      </p>
    </Modal >
  )
}

export default ProfitModal;