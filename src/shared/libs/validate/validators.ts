const cepRegex = /^[0-9]{5}[0-9]{3}$/;
function isCEP(cep: string): boolean {
  return cepRegex.test(cep);
}

// TODO: Implementar CNPJ validação
const cnpjRegex = /^\d{14,15}$/;
function isCNPJ(cnpj: string): boolean {
  return cnpjRegex.test(cnpj);
}

// TODO: Implementar CPF validação
const cpfRegex = /^\d{11}$/;
function isCPF(cpf: string): boolean {
  return cpfRegex.test(cpf);
}

const BRValidator = {
  isCEP,
  isCNPJ,
  isCPF,
};

// eslint-disable-next-line import/no-default-export
export default BRValidator;
