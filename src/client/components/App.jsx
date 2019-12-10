import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Layout, Button } from 'antd';
import CostModal from '../components/modals/CostModal.jsx';
import ProfitModal from '../components/modals/ProfitModal.jsx';
import CategoryModal from '../components/modals/CategoryModal.jsx';
import CostsList from './CostsList.jsx';
import ProfitsList from './ProfitsList.jsx';
import Diagram from './diagram/Diagram.jsx';
import DiagramSider from './diagram/DiagramSider.jsx';
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
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalKey, setModalKey] = useState(null);
  const [diagramVisible, setDiagramVisible] = useState(false);
  const [balance, setBalance] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateTo, setDateTo] = useState();
  const [dateFrom, setDateFrom] = useState();
  const [searchText, setSearchText] = useState();
  const [sortType, setSortType] = useState();
  const [diagramDate, setDiagramDate] = useState(new Date());

  useEffect(() => {
    getCosts();
    getProfits();
  }, [selectedCategories, dateTo, dateFrom, searchText, sortType, contentType]);

  useEffect(() => { getCategories() }, []);

  useEffect(() => {
    ipcRenderer.invoke('getBalance')
      .then(res => setBalance(res));
  }, [costs, profits]);

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

  const addCategory = (category) => {
    closeModal();
    ipcRenderer.invoke('addCategory', category)
      .then(res => setCategories(addActionsToProfits(res)));
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

  const editCategory = (category) => {
    closeModal();
    ipcRenderer.invoke('editCategory', category)
      .then(res => setCategories(res));
  }

  const editCategoryAction = (category) => {
    setCategoryModalVisible(true);
    setModalType('edit');
    setModalKey(category.key);
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

  const deleteCategory = (category) => {
    closeModal();
    ipcRenderer.invoke('deleteCategory', category)
      .then(res => setCategories((res)));
  };

  const deleteCategoryAction = (category) => {
    confirm({
      title: 'Are you sure delete this category?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteCategory(category)
    });
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
    setCategoryModalVisible(false);
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

  const renderSider = () => (
    <Fragment>
      <Filter
        deleteCategory={deleteCategoryAction}
        editCategory={editCategoryAction}
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
      <Button
        onClick={() => {
          setCategoryModalVisible(true);
          setModalType('add');
          setModalKey(-1);
        }}
        style={{ marginLeft: 12, marginTop: 8, width: 173 }}
      >
        Add category
      </Button>
      <Button
        onClick={() => setDiagramVisible(true)}
        style={{ marginLeft: 12, marginTop: 8, width: 173 }}
      >
        Statisctic
      </Button>
    </Fragment>
  )

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
          {
            diagramVisible ?
              <DiagramSider
                date={diagramDate}
                setDate={setDiagramDate}
                closeDiagram={() => setDiagramVisible(false)}
              /> :
              renderSider()
          }
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
            categoryModalVisible &&
            <CategoryModal
              category={categories.find(category => category.key === modalKey)}
              visible={categoryModalVisible}
              onCancel={closeModal}
              type={modalType}
              onOk={modalType === 'edit' ? editCategory : addCategory}
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
          {
            diagramVisible ?
              <Diagram month={diagramDate ? diagramDate.getMonth() : (new Date()).getMonth()} /> :
              (contentType === 'cost') ?
                <CostsList costs={costs || []} setSortType={setSortType} balance={balance} /> :
                <ProfitsList profits={profits || []} setSortType={setSortType} balance={balance} />
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