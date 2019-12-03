import React from 'react';
import moment from 'moment';
import { Table, Icon } from 'antd';

const dateFormat = 'DD.MM.YYYY';

const CostsList = ({ costs, setSortType }) => {
  const columns = [
    {
      title: () => (
        <div style={{ marginLeft: 36 }}>
          <span>Data</span>
          <span className="sort-buttons">
            <button className="clear-button" onClick={() => setSortType('dateUp')}>
              <Icon type="arrow-up" />
            </button>
            <button className="clear-button" onClick={() => setSortType('dateDown')}>
              <Icon type="arrow-down" />
            </button>
          </span>
        </div>
      ),
      dataIndex: 'date',
      key: 'date',
      render: date => (<span style={{ marginLeft: 36 }}>{moment(date).format(dateFormat)}</span>)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: () => (
        <div>
          <span>Price</span>
          <span className="sort-buttons">
            <button className="clear-button" onClick={() => setSortType('priceUp')}>
              <Icon type="arrow-up" />
            </button>
            <button className="clear-button" onClick={() => setSortType('priceDown')}>
              <Icon type="arrow-down" />
            </button>
          </span>
        </div>
      ),
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      render: actions => {
        return actions.map(action => (
          <button key={action.iconType} className="clear-button func-button" onClick={() => action.onClick()}>
            <Icon type={action.iconType} />
          </button>
        ))
      }
    }
  ];
  return (<Table dataSource={costs} pagination={false} columns={columns} />)
}

export default CostsList;