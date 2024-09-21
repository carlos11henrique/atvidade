import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import InputMask from "react-input-mask";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Form = ({ onSubmit, initialData = {}, isEditing = false, onDelete }) => {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    confirmEmail: "",
    senha: "",
    confirmSenha: "",
  });

  const [errors, setErrors] = useState({
    nomeInvalid: false,
    telefoneInvalid: false,
    cpfInvalid: false,
    emailInvalid: false,
    emailMismatch: false,
    senhaInvalid: false,
    senhaMismatch: false,
  });

  const [touched, setTouched] = useState({
    nomeTouched: false,
    telefoneTouched: false,
    cpfTouched: false,
    emailTouched: false,
    confirmEmailTouched: false,
    senhaTouched: false,
    confirmSenhaTouched: false,
  });

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  // gerar senha
  const generateRandomPassword = (length = 8) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  };
  
  const handleRandomPassword = () => {
    const randomPassword = generateRandomPassword();
    setForm(prevForm => ({
      ...prevForm,
      senha: randomPassword,
      confirmSenha: randomPassword,
    }));
  };
  

  useEffect(() => {
    if (isEditing && initialData) {
      setForm({
        nome: initialData.nome || "",
        telefone: initialData.telefone || "",
        cpf: initialData.cpf || "",
        email: initialData.email || "",
        confirmEmail: initialData.confirmEmail || "",
        senha: initialData.senha || "",
        confirmSenha: initialData.confirmSenha || "",
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [`${field}Touched`]: true });
    validateField(field);
  };

  const validateField = (fieldName) => {
    const errorsCopy = { ...errors };

    switch (fieldName) {
      case "nome":
        errorsCopy.nomeInvalid = form.nome === "" || /\d/.test(form.nome);
        break;
      case "telefone":
        errorsCopy.telefoneInvalid =
          form.telefone.replace(/[^\d]/g, "").length !== 11;
        break;
      case "cpf":
        errorsCopy.cpfInvalid = form.cpf.replace(/[^\d]/g, "").length !== 11;
        break;
      case "email":
        errorsCopy.emailInvalid = !form.email.includes("@");
        break;
      case "confirmEmail":
        errorsCopy.emailMismatch = form.email !== form.confirmEmail;
        break;
      case "senha":
        errorsCopy.senhaInvalid = form.senha.length < 6;
        break;
      case "confirmSenha":
        errorsCopy.senhaMismatch = form.senha !== form.confirmSenha;
        break;
      default:
        break;
    }

    setErrors(errorsCopy);
  };

  const validateFormOnSubmit = () => {
    const fields = [
      "nome",
      "telefone",
      "cpf",
      "email",
      "confirmEmail",
      "senha",
      "confirmSenha",
    ];
    let hasError = false;

    fields.forEach((field) => {
      validateField(field);
      if (errors[`${field}Invalid`] || errors[`${field}Mismatch`]) {
        hasError = true;
      }
    });

    const touchedFields = fields.reduce(
      (acc, field) => ({ ...acc, [`${field}Touched`]: true }),
      {}
    );
    setTouched(touchedFields);

    return !hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFormOnSubmit()) {
      onSubmit(form);

      if (!isEditing) {
        setForm({
          nome: "",
          telefone: "",
          cpf: "",
          email: "",
          confirmEmail: "",
          senha: "",
          confirmSenha: "",
        });
        setErrors({
          nomeInvalid: false,
          telefoneInvalid: false,
          cpfInvalid: false,
          emailInvalid: false,
          emailMismatch: false,
          senhaInvalid: false,
          senhaMismatch: false,
        });
        setTouched({
          nomeTouched: false,
          telefoneTouched: false,
          cpfTouched: false,
          emailTouched: false,
          confirmEmailTouched: false,
          senhaTouched: false,
          confirmSenhaTouched: false,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Por favor, corrija os erros antes de enviar.",
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
            onBlur={() => handleBlur("nome")}
            error={errors.nomeInvalid && touched.nomeTouched}
            helperText={
              errors.nomeInvalid && touched.nomeTouched
                ? "O nome não deve conter números ou está vazio"
                : ""
            }
          />
        </Grid>

        <Grid item xs={12}>
          <InputMask
            mask="(99) 99999-9999"
            value={form.telefone}
            onChange={handleChange}
            onBlur={() => handleBlur("telefone")}
          >
            {() => (
              <TextField
                name="telefone"
                label="Telefone"
                fullWidth
                required
                error={errors.telefoneInvalid && touched.telefoneTouched}
                helperText={
                  errors.telefoneInvalid && touched.telefoneTouched
                    ? "Telefone deve ter 11 dígitos ou está vazio"
                    : ""
                }
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12}>
          <InputMask
            mask="999.999.999-99"
            value={form.cpf}
            onChange={handleChange}
            onBlur={() => handleBlur("cpf")}
          >
            {() => (
              <TextField
                name="cpf"
                label="CPF"
                fullWidth
                required
                error={errors.cpfInvalid && touched.cpfTouched}
                helperText={
                  errors.cpfInvalid && touched.cpfTouched
                    ? "CPF deve ter 11 dígitos ou está vazio"
                    : ""
                }
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
            onBlur={() => handleBlur("email")}
            error={errors.emailInvalid && touched.emailTouched}
            helperText={
              errors.emailInvalid && touched.emailTouched
                ? "O email deve conter @ ou está vazio"
                : ""
            }
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
            onBlur={() => handleBlur("confirmEmail")}
            error={errors.emailMismatch && touched.confirmEmailTouched}
            helperText={
              errors.emailMismatch && touched.confirmEmailTouched
                ? "Os emails não são iguais ou está vazio"
                : ""
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="senha"
            label="Senha"
            fullWidth
            required
            type={showSenha ? "text" : "password"}
            value={form.senha}
            onChange={handleChange}
            onBlur={() => handleBlur("senha")}
            error={errors.senhaInvalid && touched.senhaTouched}
            helperText={
              errors.senhaInvalid && touched.senhaTouched
                ? "Senha deve ter no mínimo 6 caracteres ou está vazio"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSenha(!showSenha)}>
                    {showSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleRandomPassword}
                    style={{ marginLeft: 10, borderColor: "#a9a9a9a9" }}
                  >
                    Gerar
                  </Button>
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
            type={showConfirmSenha ? "text" : "password"}
            value={form.confirmSenha}
            onChange={handleChange}
            onBlur={() => handleBlur("confirmSenha")}
            error={errors.senhaMismatch && touched.confirmSenhaTouched}
            helperText={
              errors.senhaMismatch && touched.confirmSenhaTouched
                ? "As senhas não são iguais ou está vazio"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmSenha(!showConfirmSenha)}
                  >
                    {showConfirmSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onDelete}
              style={{ marginLeft: "10px" }}
            >
              Excluir
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default Form;
