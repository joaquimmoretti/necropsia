require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '.')));

// Variáveis de ambiente
const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN;
const DROPBOX_FOLDER = process.env.DROPBOX_FOLDER || '/NECROPSIAS PDF';
const PDFSHIFT_API_KEY = process.env.PDFSHIFT_API_KEY;

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor Necropsia está funcionando!' });
});

// Rota para gerar E salvar PDF (tudo em uma chamada)
app.post('/api/generate-and-save-pdf', async (req, res) => {
    try {
        const { htmlContent, fileName } = req.body;

        if (!htmlContent || !fileName) {
            return res.status(400).json({
                success: false,
                message: 'htmlContent e fileName são obrigatórios'
            });
        }

        // Gerar PDF via pdfshift.io
        const pdfResponse = await axios.post(
            'https://api.pdfshift.io/v3/convert/pdf',
            {
                source: htmlContent,
                landscape: false,
                use_print: true,
                margin: {
                    top: '20',
                    right: '20',
                    bottom: '20',
                    left: '20'
                }
            },
            {
                headers: {
                    'X-API-Key': PDFSHIFT_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        // Salvar no Dropbox
        const filePath = `${DROPBOX_FOLDER}/${fileName}`;
        const dropboxResponse = await axios.post(
            'https://content.dropboxapi.com/2/files/upload',
            pdfResponse.data,
            {
                headers: {
                    'Authorization': `Bearer ${DROPBOX_TOKEN}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        path: filePath,
                        mode: 'add',
                        autorename: true,
                        mute: false
                    }),
                    'Content-Type': 'application/octet-stream'
                }
            }
        );

        // Converter para base64 para retornar ao cliente
        const pdfBase64 = Buffer.from(pdfResponse.data).toString('base64');

        res.json({
            success: true,
            message: 'PDF gerado e salvo com sucesso!',
            pdfBlob: pdfBase64,
            dropboxData: dropboxResponse.data
        });

    } catch (error) {
        console.error('Erro ao gerar e salvar PDF:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao gerar e salvar PDF',
            error: error.message
        });
    }
});

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Necropsia rodando em http://localhost:${PORT}`);
    console.log(`📁 Pasta Dropbox: ${DROPBOX_FOLDER}`);
    console.log(`🔐 Token Dropbox configurado: ${DROPBOX_TOKEN ? DROPBOX_TOKEN.substring(0, 20) + '...' : 'NÃO CONFIGURADO'}`);
});
