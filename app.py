import sqlite3
from flask import Flask, render_template, request

from db import *

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')


@app.route('/compare/eng')
def compare_eng():
    eng_database = sqlite3.connect('static/data/eng.db').cursor()
    compare_data = get_compare_change_data(eng_database)
    return render_template('compare_change.html.j2', data=compare_data['data'], min_word=compare_data['min_word'],
                           max_word=compare_data['max_word'], min=compare_data['min'], max=compare_data['max'])


@app.route('/compare/rus')
def compare_rus():
    rus_database = sqlite3.connect('static/data/rus.db').cursor()
    compare_data = get_compare_change_data(rus_database)
    return render_template('compare_change.html.j2', data=compare_data['data'], min_word=compare_data['min_word'],
                           max_word=compare_data['max_word'], min=compare_data['min'], max=compare_data['max'])


@app.route('/clusters_graph/eng')
def clusters_graph_eng():
    return render_template('clusters_graph.html', epoch1='1810-1860', epoch2='1960-2010')

@app.route('/clusters_graph/rus')
def clusters_graph_rus():
    return render_template('clusters_graph.html', epoch1='1700-1916', epoch2='1902-2016')

@app.route('/clusters_graph/get_data/eng')
def get_clusters_graph_data_eng():
    eng_database = sqlite3.connect('static/data/eng.db').cursor()
    return get_clusters_graph_data(eng_database)


@app.route('/clusters_graph/get_data/rus')
def get_clusters_graph_data_rus():
    rus_database = sqlite3.connect('static/data/rus.db').cursor()
    return get_clusters_graph_data(rus_database)


@app.route("/api/between_clusters/eng", methods=["POST"])
def api_between_clusters_eng():
    eng_database = sqlite3.connect('static/data/eng.db').cursor()
    word = request.values.get('word')
    cluster1 = request.values.get('cluster1')
    cluster2 = request.values.get('cluster2')
    return get_change_between_clusters(eng_database, word, cluster1, cluster2)


@app.route("/api/between_clusters/rus", methods=["POST"])
def api_between_clusters_rus():
    rus_database = sqlite3.connect('static/data/rus.db').cursor()
    word = request.values.get('word')
    cluster1 = request.values.get('cluster1')
    cluster2 = request.values.get('cluster2')
    return get_change_between_clusters(rus_database, word, cluster1, cluster2)


@app.route("/api/cluster_sizes/eng", methods=["POST"])
def cluster_sizes_eng():
    eng_database = sqlite3.connect('static/data/eng.db').cursor()
    word = request.values.get('word')
    epoch = request.values.get('epoch')
    return get_cluster_sizes(eng_database, word, epoch)


@app.route("/api/cluster_sizes/rus", methods=["POST"])
def cluster_sizes_rus():
    rus_database = sqlite3.connect('static/data/rus.db').cursor()
    word = request.values.get('word')
    epoch = request.values.get('epoch')
    return get_cluster_sizes(rus_database, word, epoch)


@app.route("/api/sentences/eng", methods=["POST"])
def sentences_eng():
    eng_database = sqlite3.connect('static/data/eng.db').cursor()
    word = request.values.get('word')
    epoch = request.values.get('epoch')
    cluster = request.values.get('cluster')
    limit = request.values.get('limit')
    return get_random_sentences(eng_database, word, epoch, cluster, limit)


@app.route("/api/sentences/rus", methods=["POST"])
def sentences_rus():
    rus_database = sqlite3.connect('static/data/rus.db').cursor()
    word = request.values.get('word')
    epoch = request.values.get('epoch')
    cluster = request.values.get('cluster')
    limit = request.values.get('limit')
    return get_random_sentences(rus_database, word, epoch, cluster, limit)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
