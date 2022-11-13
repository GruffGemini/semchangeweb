from flask import Flask
from flask import url_for
from flask import request
from flask import render_template
import matplotlib.pyplot as plt
import numpy as np



app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/clusters/')
def clusters():
    # тут можно прописать логику для кластеров
    data = [20, 19, 10]
    # список data передается как параметр в clusters.html
    return render_template('clusters.html', data=data)

@app.route('/graded/')
def graded():
    # тут просто пример графика с matplotlib
    t = np.arange(0.0, 2.0, 0.01)
    s = 1 + np.sin(2 * np.pi * t)

    fig, ax = plt.subplots()
    ax.plot(t, s)

    ax.set(xlabel='time (s)', ylabel='voltage (mV)',
    title='About as simple as it gets, folks')
    ax.grid()
    # график сохраняется в папку static
    fig.savefig("static/graph.png")

    return render_template('graded.html')

@app.route('/compare')
def compare():
    data = []
    min = 1.1
    max = -0.1
    min_word = ""
    max_word = ""

    with open('data/en/metrics_report.csv') as f:
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
