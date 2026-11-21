from flask import Flask, render_template, request, jsonify, session, render_template_string
from banco import salvar_respostas, consultar_respostas
import os

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")
SENHA_CONSULTA = os.environ.get("SENHA_CONSULTA")

@app.route("/consulta", methods=["GET", "POST"])
def consulta():
    if not app.secret_key or not SENHA_CONSULTA:
        return "Configuração de acesso não realizada.", 503

    if request.method == "POST":
        senha = request.form.get("senha")
        if senha == SENHA_CONSULTA:
            session.clear()
            session["autenticado"] = True
        else:
            return "Senha incorreta!"

    if not session.get("autenticado"):
        return render_template_string("""
           <h1>Consulta de respostas</h1>
            <form method="POST">
                <input type="password" name="senha" placeholder="Digite a senha">
                <button type="submit">Entrar</button>
            </form> 
        """)    

    respostas = consultar_respostas()
    return render_template_string("""
        <h1>Respostas recebidas</h1>
        <pre>{{ respostas }}</pre>
        <form method="POST" action="/sair">
            <button type="submit">Sair da consulta</button>
        </form>
    """, respostas=respostas)

@app.route("/sair", methods=["POST"])
def sair():
    session.clear()
    return "Sessão encerrada com sucesso!"


@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/salvar_resposta", methods=["POST"])
def receber_resposta():
    dados = request.get_json()

    if dados.get("modo_teste"):
        return jsonify({"mensagem": "Resposta de teste recebida!"})

    salvar_respostas(
        dados["resposta"],
        dados.get("data"),
        dados.get("horario"),
        dados.get("local")
    )
    return jsonify({"mensagem": "Resposta recebida!"})

if __name__ == "__main__":
    app.run(debug=True)
    