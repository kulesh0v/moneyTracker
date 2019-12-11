import React, { useState, useEffect } from 'react';
import DonutChart from 'react-donut-chart';
const { ipcRenderer } = window.require('electron');

const Diagram = ({ month }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    ipcRenderer.invoke('getDiagramDatas', month)
      .then(res => setData(res))
      .catch(err => console.log(err));
  }, [month])

  if (data) {
    if (!data.length) {
      return 'No data';
    }
    return (
      <div style={{ display: 'flex', marginTop: 48 }}>
        <div style={{ margin: 'auto' }}>
          <DonutChart data={data} />
        </div>
      </div>
    );
  }
  return ('Loading')
};

export default Diagram;