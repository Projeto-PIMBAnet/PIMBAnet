CREATE DATABASE PIMBAnet;
USE PIMBAnet;

CREATE TABLE dispositivos (
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100),
endereco_ip INT,
data_criacao DATE,
tipo VARCHAR(100)
);

CREATE TABLE testes (
id INT PRIMARY KEY AUTO_INCREMENT,
id_dispositivo int,
estado VARCHAR(100),
latencia DOUBLE,
tempo TIME,
FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id)
)