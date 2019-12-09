import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { Modal, Input, InputNumber, DatePicker, Select } from 'antd';

const { Option } = Select;

const CostModal = ({ visible, type, cost, costCategories, onOk, onCancel }) => {
  const dateFormat = 'DD.MM.YYYY';
  const [name, setName] = useState();
  const [category, setCategory] = useState();
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (cost) {
      setName(cost.name);
      setCategory(cost.category);
      setPrice(cost.price);
      setDate(new Date(cost.date));
    } else {
      setName();
      setCategory();
      setPrice(0);
      setDate(new Date());
    }
  }, [cost]);

  return (
    <Modal
      title={type === 'edit' ? 'Edit cost' : 'Add cost'}
      visible={visible}
      onOk={() => onOk({ name, date, category, price, key: cost && cost.key })}
      onCancel={onCancel}
      okButtonProps={{ disabled: !(date && date < new Date && price && name && name.length && category) }}
    >
      <p>
        <Select
          placeholder="Select category of cost"
          onChange={value => setCategory(value)}
          style={{ width: 200 }}
          value={category}
        >
          {
            costCategories.map(category => (
              <Option key={category.name} value={category.name}>{category.name}</Option>))
          }
        </Select>
      </p>
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
        />
      </p>
      <p>
        <DatePicker
          placeholder={"Select date of cost"}
          value={date && moment(date)}
          onChange={value => setDate(value ? value.toDate() : undefined)}
          format={dateFormat}
        />
      </p>
    </Modal>
  )
}

export default CostModal;