# E-Cycle — Modelo Conceitual (DER)

Diagrama Entidade-Relacionamento do E-Cycle. Renderiza direto no GitHub.

```mermaid
erDiagram
    USUARIOS ||--o{ ENTREGAS : "realiza"
    USUARIOS ||--|| PONTUACAO : "possui"
    EMPRESAS ||--o{ PONTOS_COLETA : "administra"
    PONTOS_COLETA ||--o{ ENTREGAS : "recebe"
    TIPOS_RESIDUO ||--o{ ENTREGAS : "classifica"

    USUARIOS {
        int id_usuario PK
        string nome
        string email
        string senha
        string telefone
        string tipo_usuario
    }
    EMPRESAS {
        int id_empresa PK
        string nome_empresa
        string cnpj
        string contato
    }
    TIPOS_RESIDUO {
        int id_tipo PK
        string nome
        string descricao
    }
    PONTOS_COLETA {
        int id_ponto PK
        string nome_local
        string endereco
        string cidade
        int id_empresa FK
    }
    ENTREGAS {
        int id_entrega PK
        int id_usuario FK
        int id_ponto FK
        int id_tipo FK
        decimal peso_residuo
        datetime data_entrega
    }
    PONTUACAO {
        int id_pontuacao PK
        int id_usuario FK
        int pontos
        int nivel
        datetime data_registro
    }
```

## Regras de negócio atendidas

- Um usuário pode realizar **várias entregas** (1:N).
- Uma empresa administra **vários pontos de coleta** (1:N).
- Um ponto de coleta recebe **vários resíduos** (várias entregas).
- Cada entrega gera **pontuação** (gamificação).
- O sistema guarda o **histórico** de todas as entregas.
