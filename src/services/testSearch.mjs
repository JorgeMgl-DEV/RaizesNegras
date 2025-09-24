import googleDriveService from './googleDriveService.mjs';
import dotenv from 'dotenv';
dotenv.config();

async function testSearch() {
  try {
    console.log('Iniciando teste de conexão com Google Drive...');
    console.log('Pasta Raiz ID:', process.env.VITE_GOOGLE_DRIVE_FOLDER_ID);
    console.log('Subpasta ID:', process.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID);
    
    console.log('Inicializando o serviço...');
    const initialized = await googleDriveService.initialize();
    console.log('Serviço inicializado:', initialized);
    
    const subfolderId = process.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID;
    console.log('Iniciando busca de PDFs na subpasta:', subfolderId);
    
    // Busca por PDFs na subpasta
    const pdfs = await googleDriveService.searchFiles('', subfolderId);
    
    console.log('\nPDFs encontrados:');
    if (pdfs.length === 0) {
      console.log('Nenhum PDF encontrado.');
    } else {
      pdfs.forEach((pdf, index) => {
        console.log(`\n${index + 1}. ${pdf.name}`);
        console.log(`   Link: ${pdf.webViewLink}`);
        if (pdf.description) {
          console.log(`   Descrição: ${pdf.description}`);
        }
      });
    }
    
  } catch (error) {
    console.error('Erro durante a busca:', error);
  }
}

// Executar o teste
testSearch();