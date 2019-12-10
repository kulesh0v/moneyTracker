import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';

const CostModal = ({ visible, category, type, onOk, onCancel }) => {
  const [name, setName] = useState();

  useEffect(() => {
    console.log(category)
    if (category) {
      setName(category.name);
    } else {
      setName();
    }
  }, [category]);

  return (
    <Modal
      title={type === 'edit' ? 'Edit category' : 'Add category'}
      visible={visible}
      onOk={() => onOk({ name, key: category && category.key })}
      onCancel={onCancel}
      okButtonProps={{ disabled: !(name) }}
    >
      <p>
        <Input
          onChange={e => setName(e.target.value)}
          placeholder={'Name'}
          minLength={1}
          maxLength={10}
          value={name}
        />
      </p>
    </Modal>
  )
}

export default CostModal;
