# **API de Prevenção de Desastres Naturais**

Uma API baseada em NestJS para gerenciar e notificar usuários sobre desastres naturais.
Esse projeto parte de um projeto que tem como proposta, auxiliar o estado e os moradores da
cidade a se previnirem contra desastres naturias, assim como auxiliar em como lidar da melhor
maneira possível com essas situações.

![image](https://github.com/user-attachments/assets/d5647454-8da8-4084-bd94-b5585e17bef0)


### **Tecnologias Utilizadas**

* **NestJS:** Um framework Node.js progressivo para construir aplicações back-end eficientes e escaláveis.
* **TypeScript:** Um superconjunto do JavaScript que adiciona tipagem estática.
* **Prisma ORM:** Um ORM para Node.js e TypeScript.
* **PostgreSQL:** Um poderoso sistema de gerenciamento de banco de dados relacional de código aberto.
* **Jest:** Um framework de testes JavaScript leve e divertido.

### **Funcionalidades**

* Criação de ocorrencias de desastres pelo administrador e os usuários da plataforma.
* Autenticação de usuários (administrador e cliente).
* Gerenciamento de categorias de desastres.
* Criação de campanhas de doações para ajudar em desastres.
* Notificações por e-mail para usuários próximos às áreas afetadas.
  
  ![image](https://github.com/user-attachments/assets/d298eb29-adff-425f-8b8b-c1266c42263c)


### **Endpoints**
 * **occurences**:
   1. /occurences:
       - methods: GET(public), POST(admin), PATCH(admin), DELETE(admin)
   2. /occurences:id:
      - methods: GET(public)
 * **categories**:
   1. /categories:
       - methods: GET(public), POST(admin), PATCH(admin), DELETE(admin)
   2. /categories:id:
       - methods: GET(public)
 * **users**:
   1. /users:
       - methods: GET(client), POST(public), PATCH(client), DELETE(client)
   2. /users:id:
       - methods: GET(client)
 * **addresses**:
   1. /addresses:
       - methods: POST(client), PATCH(client), DELETE(client)
   2. /addresses:id:
       - methods: GET(client)
 * **campaigns**:
   1. /campaigns:
       - methods: GET(client), POST(admin)), PATCH(client), DELETE(client)
   2. /campaigns:id:
       - methods: GET(client)
### **Começando**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Quarteto-Codastico/environmental-disaster-api.git
   cd environmental-disaster

2. **Instale as dependências:**
    ```bash
      npm install

3. **Execute o docker compose para instalar os container necessários:**
    ```bash
      docker-compose up -d
   
4. **Configure as variáveis de ambiente:**

    ```bash
      NODE_ENV="production"
      DATABASE_URL=
      PORT=3000
      JWT_SECRET=xxxxxxx
      APP_URL=
      FRONTEND_URL=
      #storage variables ('disk' or 'google-cloud')
      STORAGE_DRIVER="disk"
      #google cloud variables
      GOOGLE_CLOUD_PROJECT_ID="xxxxxxxx"
      GOOGLE_CLOUD_STORAGE_BUCKET_NAME="xxxxxxxx"
      GOOGLE_CLOUD_STORAGE_KEY="xxxxxxxxx"
      #mail variables
      MAIL_HOST="smtp.gmail.com"
      MAIL_SECURE="true"
      MAIL_PORT=465
      MAIL_NAME=
      MAIL_ADDRESS=
      MAIL_PASS=


5. **Execute a aplicação:**
   ```bash
     npm run start:dev

### Estrutura de Pastas

    ```plaintext
    ./src
    ├── @dts
    ├── core
    └── modules
        └── <modulo>
            ├── controller
            ├── services
            ├── dtos
            |__ repositories


### **Testes**
  A aplicação também conta com a implementação de testes de integração utilizando a biblioteca Jest.
  * para rodar os testes utilize o comando:
    ```bash
      npm run test:e2e
  * certique-se de não rodar os testes em banco de dados de produção e garanta que o banco de testes esteja vazio para obter resultados precisos.
    
![print-testes](https://github.com/user-attachments/assets/d8fd885e-32dd-4bba-98a2-b404fefe593a)

  




