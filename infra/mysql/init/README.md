# MySQL local

O banco é inicializado pelo serviço `mysql` em `compose.yaml`. O volume `veloce_mysql_data` preserva os dados entre reinícios; para uma base limpa de desenvolvimento, remova o volume explicitamente com `docker compose down -v`.
