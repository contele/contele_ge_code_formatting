# Configurações de Formatação - Contele Gestão de Equipes

Este repositório contém as configurações centralizadas de ESLint e Prettier usadas em todos os projetos relacionados ao Contele Gestão de Equipes, incluindo nosso aplicativo móvel (React Native), interface web (Next.js) e backend (Node.js). O objetivo é garantir a consistência e qualidade no código por meio de regras unificadas de linting e formatação.

## Sobre a Biblioteca

A biblioteca fornece uma base padronizada para a formatação de código e análise estática, facilitando a colaboração entre desenvolvedores e a manutenção dos padrões de codificação em múltiplos projetos da Contele.

### Funcionalidades

- Configurações compartilhadas de ESLint para análise estática do código.
- Configurações compartilhadas de Prettier para formatação automática do código.
- Suporte a projetos React Native, Next.js e Node.js.
- Fácil integração e atualização entre os projetos.

## Como Usar

Para utilizar estas configurações em seu projeto, siga os passos abaixo:

### Instalação

Adicione a biblioteca como uma dependência de desenvolvimento em seu projeto:

```bash
npm install eslint-config-contelege --save-dev

# ou
pnpm add eslint-config-contelege --dev

# ou
yarn add eslint-config-contelege --dev
```


### Configuração do ESLint

No arquivo .eslintrc.js do seu projeto, estenda as configurações da biblioteca:

```bash
module.exports = {
  extends: ['eslint-config-contelege/eslintrc'],
};

```


### Configuração do Prettier

No arquivo .prettierrc.js do seu projeto, importe as configurações da biblioteca:

```bash
module.exports = require('eslint-config-contelege/prettierrc')
```

### Contribuições

Contribuições para a biblioteca são bem-vindas, especialmente para expandir o suporte a mais regras e frameworks. Para contribuir, siga os passos abaixo:

Faça um fork do repositório.
Crie uma nova branch para a sua contribuição.
Faça suas alterações.
Envie um pull request para o repositório original.
Todas as contribuições serão revisadas antes da aceitação. Certifique-se de seguir as diretrizes de codificação estabelecidas.


### Licença

Este projeto é licenciado sob a Licença MIT. Isso significa que você está livre para modificar, distribuir e usar o trabalho, desde que forneça os devidos créditos e não o utilize para fins comerciais fechados. Para mais detalhes, veja o arquivo LICENSE neste repositório.
