import React, { useState } from 'react';
import Form from '../components/Form';
import RecordList from '../components/RecordList';
import './HomePage.css'; // Importando o CSS específico para a HomePage

const HomePage = () => {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAddOrUpdate = (data) => {
    if (editingRecord) {
      setRecords(records.map(record => record === editingRecord ? data : record));
      setEditingRecord(null);
    } else {
      setRecords([...records, data]);
    }
  };
 
  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleDelete = (record) => {
    setRecords(records.filter(r => r !== record));
  };

  return (
    <div>
      <h1>CRUD com Material-UI e React</h1>
      <Form onSubmit={handleAddOrUpdate} initialData={editingRecord || {}} />
      <RecordList records={records} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default HomePage;
