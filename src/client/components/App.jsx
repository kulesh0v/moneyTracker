import React, { useState, useEffect } from 'react';
import { Modal, Layout, Button } from 'antd';
import CostModal from '../components/modals/CostModal.jsx';
import ProfitModal from '../components/modals/ProfitModal.jsx';
import CostsList from './CostsList.jsx';
import ProfitsList from './ProfitsList.jsx';
import Filter from './filter/Filter.jsx'
const { ipcRenderer } = window.require('electron');
const { confirm } = Modal;
const { Content, Sider } = Layout;

const contentTypes = [
  {
    value: 'cost',
    label: 'Cost',
  },
  {
    value: 'profit',
    label: 'Profits',
  },
]

const App = () => {
  const [costs, setCosts] = useState(null);
  const [profits, setProfits] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState(null);
  const [contentType, setContentType] = useState('cost');

  const [costModalVisible, setCostModalVisible] = useState(false);
  const [profitModalVisible, setProfitModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalKey, setModalKey] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateTo, setDateTo] = useState();
  const [dateFrom, setDateFrom] = useState();
  const [searchText, setSearchText] = useState();
  const [sortType, setSortType] = useState();

  useEffect(() => {
    getCosts();
    getProfits();
  }, [selectedCategories, dateTo, dateFrom, searchText, sortType, contentType]);

  useEffect(() => {
    getCategories();
  }, []);

  const addCost = (cost) => {
    closeModal();
    ipcRenderer.invoke('addCost', cost)
      .then(res => setCosts(addActionsToCosts(res)));
  }

  const addProfit = (profit) => {
    closeModal();
    ipcRenderer.invoke('addProfit', profit)
      .then(res => setProfits(addActionsToProfits(res)));
  }

  const editCost = (cost) => {
    closeModal();
    ipcRenderer.invoke('editCost', cost)
      .then(res => setCosts(addActionsToCosts(res)));
  }

  const editProfit = (profit) => {
    closeModal();
    ipcRenderer.invoke('editProfit', profit)
      .then(res => setProfits(addActionsToProfits(res)));
  }

  const deleteCost = (cost) => {
    closeModal();
    ipcRenderer.invoke('deleteCost', cost)
      .then(res => setCosts(addActionsToCosts(res)));
  }

  const deleteProfit = (profit) => {
    closeModal();
    ipcRenderer.invoke('deleteProfit', profit)
      .then(res => setProfits(addActionsToProfits(res)));
  }

  const selectCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(oldCategories => oldCategories.filter(category => category !== categoryName))
    } else {
      setSelectedCategories(oldCategories => oldCategories.concat(categoryName));
    }
  };

  const addActionsToCosts = (costsList) => costsList.map(cost => {
    cost.actions = [];
    cost.actions.push(getEditCostAction(cost));
    cost.actions.push(getDeleteCostAction(cost));
    return cost;
  });

  const addActionsToProfits = (profitsList) => profitsList.map(profit => {
    profit.actions = [];
    profit.actions.push(getEditProfitAction(profit));
    profit.actions.push(getDeleteProfitAction(profit));
    return profit;
  });

  const getCosts = () => {
    ipcRenderer.invoke('getCosts', { searchText, dateFrom, dateTo, sortType, selectedCategories })
      .then(res => setCosts(addActionsToCosts(res)));
  }

  const getCategories = () =>
    ipcRenderer.invoke('getCategories')
      .then(res => setCategories(res));

  const getProfits = () =>
    ipcRenderer.invoke('getProfits', { searchText, dateFrom, dateTo, sortType })
      .then(res => setProfits(addActionsToProfits(res)));

  const closeModal = () => {
    setCostModalVisible(false);
    setProfitModalVisible(false);
    setModalKey(null);
    setModalType(null);
  }

  const getDeleteCostAction = (cost) => ({
    iconType: 'delete',
    onClick: () => {
      confirm({
        title: 'Are you sure delete this cost?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => deleteCost(cost)
      });
    },
  });

  const getDeleteProfitAction = (profit) => ({
    iconType: 'delete',
    onClick: () => {
      confirm({
        title: 'Are you sure delete this profit?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => deleteProfit(profit)
      });
    },
  });

  const getEditCostAction = (cost) => ({
    iconType: 'edit',
    onClick: () => {
      setCostModalVisible(true);
      setModalType('edit');
      setModalKey(cost.key);
    },
  });

  const getEditProfitAction = (profit) => ({
    iconType: 'edit',
    onClick: () => {
      setProfitModalVisible(true);
      setModalType('edit');
      setModalKey(profit.key);
    },
  });

  if (costs && categories) {
    return (
      <Layout>
        <Sider
          width={200}
          collapsedWidth="0"
          theme={'light'}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ zIndex: 10 }}
        >
          <Filter
            selectedCategories={selectedCategories}
            selectCategory={selectCategory}
            categories={categories}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            dateFrom={dateFrom}
            dateTo={dateTo}
            setSearchText={setSearchText}
            searchText={searchText}
            contentType={contentType}
            setContentType={setContentType}
            contentTypes={contentTypes}
          />
          <Button
            onClick={() => {
              setCostModalVisible(true);
              setModalType('add');
              setModalKey(-1);
            }}
            style={{ marginLeft: 12, width: 173 }}
          >
            Add cost
          </Button>
          <Button
            onClick={() => {
              setProfitModalVisible(true);
              setModalType('add');
              setModalKey(-1);
            }}
            style={{ marginLeft: 12, marginTop: 8, width: 173 }}
          >
            Add profit
          </Button>
        </Sider>
        <Content>
          {
            costModalVisible &&
            <CostModal
              cost={costs.find(cost => cost.key === modalKey)}
              costCategories={categories}
              visible={costModalVisible}
              onCancel={closeModal}
              type={modalType}
              onOk={modalType === 'edit' ? editCost : addCost}
            />
          }
          {
            profitModalVisible &&
            <ProfitModal
              profit={profits.find(profit => profit.key === modalKey)}
              visible={profitModalVisible}
              onCancel={closeModal}
              type={modalType}
              onOk={modalType === 'edit' ? editProfit : addProfit}
            />
          }
          {contentType === 'cost' ?
            <CostsList costs={costs || []} setSortType={setSortType} /> :
            <ProfitsList profits={profits || []} setSortType={setSortType} />
          }
        </Content>
      </Layout >
    )
  }

  return (
    'Loading'
  )

};

export default App;