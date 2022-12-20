import json
from flask import Flask
from flask import url_for
from flask import request
from flask import render_template, jsonify
import matplotlib.pyplot as plt
import numpy as np
import pickle



app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')


@app.route('/compare')
def compare():
    data = []
    min = 1.1
    max = -0.1
    min_word = ""
    max_word = ""

    with open('static/data/en/metrics_report.csv') as f:
        f.readline()
        for line in f:
            word, metric = line.split(';')
            metric = float(metric.strip())
            data.append({"label": word, "value": metric})
            if metric > max:
                max = metric
                max_word = word
            elif metric < min:
                min = metric
                min_word = word

    return render_template('compare_change.html.j2', data=data, min_word=min_word, max_word=max_word, min=min, max=max)


@app.route('/clusters_graph')
def clusters_graph():
    # word_metrics = []
    # max = -0.1
    # max_word = ""

    # with open('static/data/en/metrics_report.csv') as f:
    #     f.readline()
    #     for line in f:
    #         word, metric = line.split(';')
    #         metric = float(metric.strip())
    #         word_metrics.append({"label": word, "value": metric})
    #         if metric > max:
    #             max = metric
    #             max_word = word

    # with open('static/data/en/clusters_report.pickle', 'rb') as f:
    #     clusters_report = pickle.load(f)
    # with open('static/data/en/clusters_between.pickle', 'rb') as f:
    #     clusters_between = pickle.load(f)
    # clusters_between = {key: value.tolist() for (key, value) in clusters_between.items()}

    # epochs = list(clusters_report[max_word].keys())
    # initial_data = [[len(i) for i in clusters_report[max_word][epochs[0]]], [len(i) for i in clusters_report[max_word][epochs[1]]]]
    return render_template('clusters_graph.html')#, word_metrics=word_metrics, initial_data=initial_data, max_word=max_word,
                           # clusters_report=clusters_report, max=max, clusters_between=clusters_between)


@app.route('/clusters_graph/get_data')
def get_clusters_graph_data():
    word_metrics = []
    max = -0.1
    max_word = ""

    with open('static/data/en/metrics_report.csv') as f:
        f.readline()
        for line in f:
            word, metric = line.split(';')
            metric = float(metric.strip())
            word_metrics.append({"label": word, "value": metric})
            if metric > max:
                max = metric
                max_word = word

    with open('static/data/en/clusters_report.pickle', 'rb') as f:
        clusters_report = pickle.load(f)
    with open('static/data/en/clusters_between.pickle', 'rb') as f:
        clusters_between = pickle.load(f)
    clusters_between = {key: value.tolist() for (key, value) in clusters_between.items()}

    epochs = list(clusters_report[max_word].keys())
    initial_data = [[len(i) for i in clusters_report[max_word][epochs[0]]], [len(i) for i in clusters_report[max_word][epochs[1]]]]
    return {'word_metrics': word_metrics, 'initial_data': initial_data, 'max_word': max_word,
            'clusters_report': clusters_report, 'max': max, 'clusters_between': clusters_between}
