## Configuração de envio de comentários (EmailJS)

1. Crie uma conta no EmailJS e um Service conectado ao seu provedor de e-mail.
2. Crie um Template com as variáveis: `from_name`, `from_email`, `message`.
   - Assunto sugerido: `Novo comentário – Raízes Negras`
   - Corpo (HTML) sugerido:
     ```html
     <h2>Novo comentário recebido</h2>
     <p><strong>Nome:</strong> {{from_name}}</p>
     <p><strong>E-mail:</strong> {{from_email}}</p>
     <p><strong>Mensagem:</strong></p>
     <p style="white-space: pre-wrap;">{{message}}</p>
     <hr />
     <p>Enviado via Raízes Negras – FAQ</p>
     ```
   - Defina o Reply-To do template como: `{{from_email}}`.
3. Copie `.env.example` para `.env` e preencha:
   ```bash
   VITE_EMAILJS_SERVICE_ID=seu_service_id
   VITE_EMAILJS_TEMPLATE_ID=seu_template_id
   VITE_EMAILJS_PUBLIC_KEY=sua_public_key
   ```
4. Reinicie o servidor de desenvolvimento e teste o envio pela página FAQ.

# RaizesNegras
falta ajustar as cores do mapa e desolvover a page das regioes
