var cluster1 = -1;
var cluster2 = -1;
var innerRadius1 = -1;
var outerRadius1 = -1;
var innerRadius2 = -1;
var outerRadius2 = -1;
var lastActivePoint1 = -1;
var lastActivePoint2 = -1;
var currentWord = '';
var clustersReport;
var clustersBetween;

const epoch1NameInternal = 'Epoch1'
const epoch2NameInternal = 'Epoch2'



function get_data(language) {
    $.ajax({
        type: 'GET',
        url: `/clusters_graph/get_data/${language}`,
        success: function(data) {
            $('#spinner').hide();
            currentWord = data.max_word;
            wordList = data.word_metrics;
            wordDict = Object.assign({}, ...wordList.map((x) => ({[x.label]: x.value})));
            chart1 = create_chart('chart1', data.initial_data[0], 'Epoch1');
            chart2 = create_chart('chart2', data.initial_data[1], 'Epoch2');

            const clusterChange = (wordDict[currentWord]).toFixed(3);
            let style = "<span style='color: orange;'>";
            if (clusterChange > 0.66) {
                style = "<span style='color: red;'>"
            } else if (clusterChange < 0.33) {
                style = "<span style='color: blue;'>"
            }
            document.getElementById("word_change").innerHTML = `${style} WORD CHANGE: <br> ${clusterChange}</span>`

            create_autocomplete('input', chart1, chart2, language);
            document.getElementById('chart1').onclick = function(evt) {
                const activePoints = chart1.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);

                if (activePoints.length < 1) {
                    return
                }
                if (innerRadius1 == -1) {
                    innerRadius1 = activePoints[0]['element'].innerRadius;
                }
                if (outerRadius1 == -1) {
                    outerRadius1 = activePoints[0]['element'].outerRadius;
                }
                if (lastActivePoint1 != -1) {
                    lastActivePoint1['element'].innerRadius = lastActivePoint1['element'].innerRadius - 7;
                }
                if (lastActivePoint1 != -1) {
                    lastActivePoint1['element'].outerRadius = lastActivePoint1['element'].outerRadius - 7;
                }

                if (activePoints[0]['element'].innerRadius == innerRadius1) {
                    activePoints[0]['element'].innerRadius = activePoints[0]['element'].innerRadius + 7;
                    lastActivePoint1 = activePoints[0]
                }
                if (activePoints[0]['element'].outerRadius == outerRadius1) {
                    activePoints[0]['element'].outerRadius = activePoints[0]['element'].outerRadius + 7;
                    lastActivePoint1 = activePoints[0]
                }

                cluster1 = activePoints[0].index;
                var selected = []
                $.ajax({
                    type: 'POST',
                    url: `/api/sentences/${language}`,
                    data: {"word": currentWord, "epoch": epoch1NameInternal, 'cluster': cluster1, 'limit': 5},
                    async: false,
                    success: function(data) {
                        selected = data['result'];
                    },
                    error: function(data) {
                        console.log(data);
                    }
                })
                let exampleText = "";
                for (i = 0; i < selected.length; i++) {
                    exampleText += `<b>Example ${i + 1}</b><br>`;
                    sentence_parts = selected[i]['sentence'].split(' ');
                    position = selected[i]['position']
                    for (j = 0; j < sentence_parts.length; j++) {
                        if (j == position) {
                            exampleText += `<b><span style='color: red;'>${sentence_parts[j]}</span></b>`;
                        } else {
                            exampleText += sentence_parts[j];
                        }
                        exampleText += " "
                    }
                    exampleText += "<br><br>";
                }
                document.getElementById('text1').innerHTML = exampleText;
                
                if (cluster1 != -1 && cluster2 != -1) {
                    var clusterChange = 0;
                    $.ajax({
                        type: 'POST',
                        url: `/api/between_clusters/${language}`,
                        data: {"word": currentWord, "cluster1": cluster1, 'cluster2': cluster2},
                        async: false,
                        success: function(data) {
                            clusterChange = data['result'].toFixed(3);
                        },
                        error: function(data) {
                            console.log(data);
                        }
                    })
                    let style = "<span style='color: orange;'>";
                    if (clusterChange > 0.66) {
                        style = "<span style='color: red;'>";
                    } else if (clusterChange < 0.33) {
                        style = "<span style='color: blue;'>";
                    }
                    document.getElementById("cluster_change").innerHTML = `${style}CLUSTER CHANGE:<br>${clusterChange}</span>`;
                }
            };

            document.getElementById('chart2').onclick = function(evt) {
                const activePoints = chart2.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);

                if (activePoints.length < 1) {
                    return
                }
                if (innerRadius2 == -1) {
                    innerRadius2 = activePoints[0]['element'].innerRadius;
                }
                if (outerRadius2 == -1) {
                    outerRadius2 = activePoints[0]['element'].outerRadius;
                }
                if (lastActivePoint2 != -1) {
                    lastActivePoint2['element'].innerRadius = lastActivePoint2['element'].innerRadius - 7;
                }
                if (lastActivePoint2 != -1) {
                    lastActivePoint2['element'].outerRadius = lastActivePoint2['element'].outerRadius - 7;
                }

                if (activePoints[0]['element'].innerRadius == innerRadius2) {
                    activePoints[0]['element'].innerRadius = activePoints[0]['element'].innerRadius + 7;
                    lastActivePoint2 = activePoints[0]
                }
                if (activePoints[0]['element'].outerRadius == outerRadius2) {
                    activePoints[0]['element'].outerRadius = activePoints[0]['element'].outerRadius + 7;
                    lastActivePoint2 = activePoints[0]
                }

                cluster2 = activePoints[0].index;
                var selected = []
                $.ajax({
                    type: 'POST',
                    url: `/api/sentences/${language}`,
                    data: {"word": currentWord, "epoch": epoch2NameInternal, 'cluster': cluster2, 'limit': 5},
                    async: false,
                    success: function(data) {
                        selected = data['result'];
                    },
                    error: function(data) {
                        console.log(data);
                    }
                })
                let exampleText = "";
                for (i = 0; i < selected.length; i++) {
                    exampleText += `<b>Example ${i + 1}</b><br>`;
                    sentence_parts = selected[i]['sentence'].split(' ');
                    position = selected[i]['position']
                    for (j = 0; j < sentence_parts.length; j++) {
                        if (j == position) {
                            exampleText += `<b><span style='color: red;'>${sentence_parts[j]}</span></b>`;
                        } else {
                            exampleText += sentence_parts[j];
                        }
                        exampleText += " "
                    }
                    exampleText += "<br><br>";
                }
                document.getElementById('text2').innerHTML = exampleText;
                if (cluster1 != -1 && cluster2 != -1) {
                    var clusterChange = 0;
                    $.ajax({
                        type: 'POST',
                        url: `/api/between_clusters/${language}`,
                        data: {"word": currentWord, "cluster1": cluster1, 'cluster2': cluster2},
                        async: false,
                        success: function(data) {
                            clusterChange = data['result'].toFixed(3);
                        },
                        error: function(data) {
                            console.log(data);
                        }
                    })
                    let style = "<span style='color: orange;'>";
                    if (clusterChange > 0.66) {
                        style = "<span style='color: red;'>";
                    } else if (clusterChange < 0.33) {
                        style = "<span style='color: blue;'>";
                    }
                    document.getElementById("cluster_change").innerHTML = `${style}CLUSTER CHANGE:<br>${clusterChange}</span>`;
                }
            };
        },
        error: function(data) {
            console.log(data);
        }
    })
};



function create_chart(chart_id, chart_data, epoch_label) {
    const ctx = document.getElementById(chart_id);
    ctx.height = window.innerHeight * 0.2;
    const labels = [];
    for (let i = 0; i < chart_data.length; i++) {
        labels.push(`Cluster ${i + 1}`)
    }

    const chart = new Chart(ctx, {
        type: 'pie',
        responsive: false,
        width:15,
        height:20,
        scaleShowGridLines: false,
        data: {
            labels: labels,
            datasets: [{
            data: chart_data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(0, 150, 50, 0.2)',
                'rgba(150, 0, 210, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(0, 150, 50, 1)',
                'rgba(150, 0, 210, 1)'
            ],
            borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    title: {
                        display: true,
                        text: `${currentWord} (${epoch_label})`,
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        font: {
                            size: 24
                        }
                    }
                }
            }
        }
    });
    return chart
};

function create_autocomplete(input_id, chart1, chart2, language) {
    const field = document.getElementById(input_id);
    const autocomplete = new Autocomplete(field, {
        data: wordList,
        maximumItems: 15,
        threshold: 1,
        onSelectItem: ({label, value}) => {
            currentWord = label;

            var data1 = [];
            $.ajax({
                type: 'POST',
                url: `/api/cluster_sizes/${language}`,
                data: {"word": currentWord, "epoch": epoch1NameInternal},
                async: false,
                success: function(data) {
                    data1 = data['result'];
                },
                error: function(data) {
                    console.log(data);
                }
            })
            const labels1 = [];
            for (let i = 0; i < data1.length; i++) {
                labels1.push('Cluster ' + (i + 1));
            }
            chart1.data.labels = labels1
            chart1.data.datasets[0].data = data1
            chart1.options.plugins.legend.title.text = currentWord + " (Epoch 1)"

            var data2 = []
            $.ajax({
                type: 'POST',
                url: `/api/cluster_sizes/${language}`,
                data: {"word": currentWord, "epoch": epoch2NameInternal},
                async: false,
                success: function(data) {
                    data2 = data['result'];
                },
                error: function(data) {
                    console.log(data);
                }
            })
            const labels2 = []
            for (let i = 0; i < data2.length; i++) {
                labels2.push('Cluster ' + (i + 1))
            }
            chart2.data.labels = labels2;
            chart2.data.datasets[0].data = data2;
            chart2.options.plugins.legend.title.text = currentWord + " (Epoch 2)";

            chart1.update();
            chart2.update();

            innerRadius1 = -1;
            outerRadius1 = -1;
            innerRadius2 = -1;
            outerRadius2 = -1;
            lastActivePoint1 = -1;
            lastActivePoint2 = -1;

            const clusterChange = (wordDict[currentWord]).toFixed(3);
            let style = "<span style='color: orange;'>";
            if (clusterChange > 0.66) {
                style = "<span style='color: red;'>"
            } else if (clusterChange < 0.33) {
                style = "<span style='color: blue;'>"
            }
            document.getElementById("word_change").innerHTML = `${style} WORD CHANGE: <br> ${clusterChange}</span>`
            document.getElementById("cluster_change").innerHTML = 'CLUSTER CHANGE: '
            document.getElementById("text1").innerHTML = "Click on a cluster to show sentence examples";
            document.getElementById("text2").innerHTML = "Click on a cluster to show sentence examples";
            cluster1 = -1;
            cluster2 = -1;
        }
    });
};

function add_onclick_event(evt,
    text_elm_id, chart, innerRadius, outerRadius,
    lastActivePoint, epochName, clustersBetween) {
    const activePoints = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);

    if (activePoints.length < 1) {
        return
    }
    if (innerRadius == -1) {
        innerRadius = activePoints[0]['element'].innerRadius;
    }
    if (outerRadius == -1) {
        outerRadius = activePoints[0]['element'].outerRadius;
    }
    if (lastActivePoint != -1) {
        lastActivePoint['element'].innerRadius = lastActivePoint['element'].innerRadius - 7;
    }
    if (lastActivePoint != -1) {
        lastActivePoint['element'].outerRadius = lastActivePoint['element'].outerRadius - 7;
    }

    if (activePoints[0]['element'].innerRadius == innerRadius) {
        activePoints[0]['element'].innerRadius = activePoints[0]['element'].innerRadius + 7;
        lastActivePoint = activePoints[0]
    }
    if (activePoints[0]['element'].outerRadius == outerRadius) {
        activePoints[0]['element'].outerRadius = activePoints[0]['element'].outerRadius + 7;
        lastActivePoint = activePoints[0]
    }

    cluster1 = activePoints[0].index;
    const possibleIndices = clustersReport[currentWord][epochName][cluster1];
    const shuffled = possibleIndices.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(5, possibleIndices.length));
    let exampleText = "";
    for (i = 0; i < selected.length; i++) {
        exampleText += `<b>Example ${i + 1}</b><br>${corpus1[selected[i]]}<br><br>`;
    }
    document.getElementById(text_elm_id).innerHTML = exampleText;
    if (cluster1 != -1 && cluster2 != -1) {
        const clusterChange = (clustersBetween[currentWord][cluster1][cluster2]).toFixed(3);
        let style = "<span style='color: orange;'>";
        if (clusterChange > 0.66) {
            style = "<span style='color: red;'>";
        } else if (clusterChange < 0.33) {
            style = "<span style='color: blue;'>";
        }
        document.getElementById("cluster_change").innerHTML = `${style}CLUSTER CHANGE:<br>${clusterChange}</span>`;
    }
};
