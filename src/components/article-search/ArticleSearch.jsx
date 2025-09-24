import { useState, useEffect } from 'react';
import googleDriveService from '../../services/googleDriveService.mjs';

function ArticleSearch() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await googleDriveService.initialize();
      const files = await googleDriveService.searchFiles('artigo', import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID);
      
      setArticles(files);
    } catch (err) {
      setError('Erro ao buscar artigos: ' + err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchArticles();
  }, []);

  if (loading) return <div>Carregando artigos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Artigos encontrados:</h2>
      {articles.length === 0 ? (
        <p>Nenhum artigo encontrado.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <h3>{article.name}</h3>
              {article.description && <p>{article.description}</p>}
              <a href={article.webViewLink} target="_blank" rel="noopener noreferrer">
                Ver artigo
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArticleSearch;