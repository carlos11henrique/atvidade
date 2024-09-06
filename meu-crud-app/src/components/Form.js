import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, InputAdornment, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Form = ({ onSubmit, initialData = {}, isEditing = false, onDelete }) => {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    confirmEmail: '',
    senha: '',
    confirmSenha: '',
  });

  const [errors, setErrors] = useState({
    cpf: false,
    telefone: false,
    emailInvalid: false,
    emailMismatch: false,
    senhaMismatch: false,
    nomeInvalid: false,
    confirmEmailTouched: false,
    confirmSenhaTouched: false,
    nomeTouched: false,
    emailTouched: false,
  });

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  useEffect(() => {
    if (isEditing && initialData) {
      setForm({
        nome: initialData.nome || '',
        telefone: initialData.telefone || '',
        cpf: initialData.cpf || '',
        email: initialData.email || '',
        confirmEmail: initialData.confirmEmail || '',
        senha: initialData.senha || '',
        confirmSenha: initialData.confirmSenha || '',
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Atualizar erros com base na mudança de valores
    if (name === 'cpf') {
      const cleanedCpf = value.replace(/[^\d]/g, '');
      setErrors({ ...errors, cpf: cleanedCpf.length !== 11 });
    }

    if (name === 'telefone') {
      const cleanedTelefone = value.replace(/[^\d]/g, '');
      setErrors({ ...errors, telefone: cleanedTelefone.length !== 11 });
    }

    if (name === 'email' && errors.emailTouched) {
      setErrors({
        ...errors,
        emailInvalid: !value.includes('@'),
      });
    }

    if (name === 'confirmEmail' && errors.confirmEmailTouched) {
      setErrors({
        ...errors,
        emailMismatch: form.email !== value,
      });
    }

    if (name === 'confirmSenha' && errors.confirmSenhaTouched) {
      setErrors({
        ...errors,
        senhaMismatch: form.senha !== value,
      });
    }
  };

  const handleBlurNome = () => {
    const hasNumbers = /\d/.test(form.nome);
    setErrors({ ...errors, nomeInvalid: hasNumbers, nomeTouched: true });
  };

  const handleBlurEmail = () => {
    setErrors({
      ...errors,
      emailInvalid: !form.email.includes('@'),
      emailTouched: true,
    });
  };

  const handleBlurConfirmEmail = () => {
    setErrors({
      ...errors,
      emailMismatch: form.email !== form.confirmEmail,
      confirmEmailTouched: true,
    });
  };

  const handleBlurConfirmSenha = () => {
    setErrors({
      ...errors,
      senhaMismatch: form.senha !== form.confirmSenha,
      confirmSenhaTouched: true,
    });
  };

  const handleBlurCpf = () => {
    const cleanedCpf = form.cpf.replace(/[^\d]/g, '');
    setErrors({
      ...errors,
      cpf: cleanedCpf.length !== 11,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, telefone, cpf, email, confirmEmail, senha, confirmSenha } = form;

    // Verificação de preenchimento
    if (!nome || !telefone || !cpf || !email || !confirmEmail || !senha || !confirmSenha) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Todos os campos devem ser preenchidos.' });
      return;
    }

    // Verificação de erros
    if (errors.cpf || errors.telefone || errors.emailInvalid || errors.emailMismatch || errors.senhaMismatch || errors.nomeInvalid) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Por favor, corrija os erros antes de enviar.' });
      return;
    }

    onSubmit(form);

    if (!isEditing) {
      setForm({
        nome: '',
        telefone: '',
        cpf: '',
        email: '',
        confirmEmail: '',
        senha: '',
        confirmSenha: '',
      });
      setErrors({
        cpf: false,
        telefone: false,
        emailInvalid: false,
        emailMismatch: false,
        senhaMismatch: false,
        nomeInvalid: false,
        confirmEmailTouched: false,
        confirmSenhaTouched: false,
        nomeTouched: false,
        emailTouched: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="nome"
            label="Nome"
            fullWidth
            required
            value={form.nome}
            onChange={handleChange}
            onBlur={handleBlurNome}
            error={errors.nomeInvalid && errors.nomeTouched}
            helperText={errors.nomeInvalid && errors.nomeTouched ? 'O nome não deve conter números' : ''}
          />
        </Grid>

        <Grid item xs={12}>
          <InputMask mask="(99) 99999-9999" value={form.telefone} onChange={handleChange} onBlur={() => {
            const cleanedTelefone = form.telefone.replace(/[^\d]/g, '');
            setErrors({ ...errors, telefone: cleanedTelefone.length !== 11 });
          }}>
            {() => (
              <TextField
                name="telefone"
                label="Telefone"
                fullWidth
                required
                error={errors.telefone}
                helperText={errors.telefone ? 'Telefone deve ter 11 dígitos' : ''}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12}>
          <InputMask mask="999.999.999-99" value={form.cpf} onChange={handleChange} onBlur={handleBlurCpf}>
            {() => (
              <TextField
                name="cpf"
                label="CPF"
                fullWidth
                required
                error={errors.cpf}
                helperText={errors.cpf ? 'CPF deve ter 11 dígitos' : ''}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlurEmail}
            error={errors.emailInvalid && errors.emailTouched}
            helperText={errors.emailInvalid && errors.emailTouched ? 'O email deve conter @' : ''}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="confirmEmail"
            label="Confirme o Email"
            fullWidth
            required
            value={form.confirmEmail}
            onChange={handleChange}
            onBlur={handleBlurConfirmEmail}
            error={errors.emailMismatch && errors.confirmEmailTouched}
            helperText={errors.emailMismatch && errors.confirmEmailTouched ? 'Os emails não são iguais' : ''}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="senha"
            label="Senha"
            fullWidth
            required
            type={showSenha ? 'text' : 'password'}
            value={form.senha}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSenha(!showSenha)}>
                    {showSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="confirmSenha"
            label="Confirme a Senha"
            fullWidth
            required
            type={showConfirmSenha ? 'text' : 'password'}
            value={form.confirmSenha}
            onChange={handleChange}
            onBlur={handleBlurConfirmSenha}
            error={errors.senhaMismatch && errors.confirmSenhaTouched}
            helperText={errors.senhaMismatch && errors.confirmSenhaTouched ? 'As senhas não são iguais' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmSenha(!showConfirmSenha)}>
                    {showConfirmSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
          {isEditing && (
            <Button variant="outlined" color="secondary" onClick={onDelete} style={{ marginLeft: '10px' }}>
              Excluir
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default Form;
