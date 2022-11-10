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
