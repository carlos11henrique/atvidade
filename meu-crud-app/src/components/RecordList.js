import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const RecordList = ({ records, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.nome}</TableCell>
              <TableCell>{record.telefone}</TableCell>
              <TableCell>{record.cpf}</TableCell>
              <TableCell>{record.email}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => onEdit(record)}>
                  Editar
                </Button>
                <Button color="secondary" onClick={() => onDelete(record)}>
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecordList;
