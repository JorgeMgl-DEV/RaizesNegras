import { google } from 'googleapis';
import path from 'path';

class GoogleDriveService {
  constructor() {
    this.SCOPES = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];
    this.auth = null;
  }

  async initialize() {
    try {
      const credentials = path.join(process.cwd(), 'acervoraizes-3c23c3b48afd.json');
      console.log('Usando credenciais da conta de serviço:', credentials);
      
      const auth = new google.auth.GoogleAuth({
        keyFile: credentials,
        scopes: this.SCOPES
      });


      this.auth = await auth.getClient();
      console.log('Cliente autenticado com sucesso');

      this.drive = google.drive({ 
        version: 'v3',
        auth: this.auth
      });
      
      console.log('Autenticação bem-sucedida');

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      return true;
    } catch (error) {
      console.error('Erro ao inicializar o serviço do Google Drive:', error);
      return false;
    }
  }

  async listFiles(folderId) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType, webViewLink)',
      });
      return response.data.files;
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      return [];
    }
  }

  async getFileById(fileId) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, webViewLink',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter arquivo:', error);
      return null;
    }
  }

  async searchFiles(query, folderId) {
    try {
      // Buscar por PDFs na pasta específica
      const searchQuery = `mimeType='application/pdf' and '${folderId}' in parents`;

      console.log('Executando busca com query:', searchQuery);

      const response = await this.drive.files.list({
        q: searchQuery,
        fields: 'files(id, name, mimeType, webViewLink, description)',
        orderBy: 'name asc',
        pageSize: 10,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true
      });

      return response.data.files;
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      return [];
    }
  }
}

export default new GoogleDriveService();