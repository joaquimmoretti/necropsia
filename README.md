# Formulário de Necropsia

Sistema completo para coleta de dados de necropsia, geração de PDF e integração com Dropbox.

## Funcionalidades

- ✅ Formulário web responsivo para coleta de dados de necropsia
- ✅ Geração de PDF via PDFShift
- ✅ Integração com Dropbox para armazenamento automático
- ✅ Auto-save de dados no localStorage
- ✅ Suporte mobile (iOS/Android)

## Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript puro
- **Backend:** Node.js + Express
- **PDF:** PDFShift API
- **Storage:** Dropbox API

## Como usar

1. Acesse o formulário
2. Preencha os dados da necropsia
3. Clique em "Relatório" para visualizar
4. Clique em "PDF" para gerar e salvar no Dropbox

## Variáveis de Ambiente

```
PORT=3000
DROPBOX_TOKEN=seu_token_aqui
DROPBOX_FOLDER=/NECROPSIAS PDF
PDFSHIFT_API_KEY=sua_chave_aqui
```

## Deploy

O aplicativo está configurado para deploy no Render.
