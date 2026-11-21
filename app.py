from flask import Flask, render_template, request, jsonify
from banco import salvar_respostas

app = Flask(__name__)


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
    