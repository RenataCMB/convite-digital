import sqlite3

conexao = sqlite3.connect("convite.db", check_same_thread=False)
cursor = conexao.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resposta TEXT,
    data DATE,
    horario TEXT,
    local TEXT
     )
 """)
conexao.commit()

def salvar_respostas(resposta, data=None, horario=None, local=None):
    cursor.execute("""
        INSERT INTO respostas (resposta, data, horario, local)
        VALUES (?, ?, ?, ?)
    """, (resposta, data, horario, local))
    conexao.commit()
