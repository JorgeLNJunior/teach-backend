![Logo](https://i.imgur.com/SETjw08.png)

# Teach

## O que é

Teach é uma rede social com foco no incentivo ao ensino e educação, nela é possível compartilhar o que você sabe por meio de postagens em formato de artigos ou vídeo aulas.

Este projeto é desenvolvido por Jorge Junior e Thiago Victor para a matéria Projeto integrado II do 5º semestre de Análise e Desenvolvimento de Sistemas do UNASP-SP.


# Instalação e configuração

Instruções para a instalação e configuração do projeto

## Instalação

Para que seja possível realizar a execução do projeto alguns itens devem ser instalados. Realize a instalação do [NodeJs](https://nodejs.org/pt-br/download/) na sua versão 12.x, logo após, abra seu terminal e instale o [AdonisJs](https://adonisjs.com) globalmente por meio do comando `npm i -g @adonisjs/cli`. Agora realize a instalação do banco de dados [MySql](https://dev.mysql.com/downloads/), logo após crie uma nova base de dados. Então faça o clone do projeto por meio do comando `git clone https://github.com/JorgeLNJunior/teach-backend.git` e abra-o na sua IDE.


## Configuração

Dentro da raiz do projeto renomeie o arquivo `.env.example` para `.env`. Com o terminal aberto na raiz do projeto execute o comando `adonis key:generate` para gerar a `APP_KEY`, então altere os campos `DB_USER` e `DB_PASSWORD` de acordo com a configuração do seu banco de dados, altere `DB_CONNECTION` para `mysql` e `DB_DATABASE` para o nome da sua base de dados. Agora execute o comando `npm i` para instalar as dependências do projeto e `npm i mysql` para instalar a dependência do MySql. Mais iformações sobre a configuração podem ser encontradas na [Documentação do AdonisJs](https://adonisjs.com/docs/4.1/configuration-and-env).

## Vs Code, extensões recomendadas

DotEnv </br>
EditorConfig for Vs Code </br>
SQLTools - Database tools

