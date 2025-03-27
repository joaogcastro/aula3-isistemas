CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    fornecedor VARCHAR(255) NOT NULL,
    endereco_fornecedor VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    preco_unitario FLOAT NOT NULL
);

INSERT INTO produtos
(nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario) 
VALUES
('Produto A', 'Fornecedor X', 'Rua A, 123', 50, 'Rua B, 456', 10.5),
('Produto B', 'Fornecedor Y', 'Av. C, 789', 30, 'Rua D, 101', 20.75),
('Produto C', 'Fornecedor Z', 'Av. E, 112', 100, 'Rua F, 202', 15.0);
