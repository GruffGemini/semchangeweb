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



function get_data() {
    $.ajax({
        type: 'GET',
        url: '/clusters_graph/get_data',
        success: function(data) {
            $('#spinner').hide();
            currentWord = data.max_word;
            clustersReport = data.clusters_report;
            clustersBetween = data.clusters_between;
            const epochs = Object.keys(data.clusters_report[currentWord]);
            const epoch1Name = epochs[0];
            const epoch2Name = epochs[1];
            wordList = data.word_metrics;
            wordDict = Object.assign({}, ...wordList.map((x) => ({[x.label]: x.value})));
            chart1 = create_chart('chart1', data.initial_data[0]);
            chart2 = create_chart('chart2', data.initial_data[1]);
            create_autocomplete('input', epoch1Name, epoch2Name, chart1, chart2);
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
                    lastActivePoint1['element'].innerRadius = lastActivePoint1['element'].innerRadius - 20;
                }
                if (lastActivePoint1 != -1) {
                    lastActivePoint1['element'].outerRadius = lastActivePoint1['element'].outerRadius - 20;
                }

                if (activePoints[0]['element'].innerRadius == innerRadius1) {
                    activePoints[0]['element'].innerRadius = activePoints[0]['element'].innerRadius + 20;
                    lastActivePoint1 = activePoints[0]
                }
                if (activePoints[0]['element'].outerRadius == outerRadius1) {
                    activePoints[0]['element'].outerRadius = activePoints[0]['element'].outerRadius + 20;
                    lastActivePoint1 = activePoints[0]
                }

                cluster1 = activePoints[0].index;
                const possibleIndices = clustersReport[currentWord][epoch1Name][cluster1];
                const shuffled = possibleIndices.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, Math.min(5, possibleIndices.length));
                let exampleText = "";
                for (i = 0; i < selected.length; i++) {
                    exampleText += `<b>Example ${i + 1}</b><br>${corpus1[selected[i]]}<br><br>`;
                }
                document.getElementById('text1').innerHTML = exampleText;
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
                    lastActivePoint2['element'].innerRadius = lastActivePoint2['element'].innerRadius - 20;
                }
                if (lastActivePoint2 != -1) {
                    lastActivePoint2['element'].outerRadius = lastActivePoint2['element'].outerRadius - 20;
                }

                if (activePoints[0]['element'].innerRadius == innerRadius2) {
                    activePoints[0]['element'].innerRadius = activePoints[0]['element'].innerRadius + 20;
                    lastActivePoint2 = activePoints[0]
                }
                if (activePoints[0]['element'].outerRadius == outerRadius2) {
                    activePoints[0]['element'].outerRadius = activePoints[0]['element'].outerRadius + 20;
                    lastActivePoint2 = activePoints[0]
                }

                cluster2 = activePoints[0].index;
                const possibleIndices = clustersReport[currentWord][epoch2Name][cluster2];
                const shuffled = possibleIndices.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, Math.min(5, possibleIndices.length));
                let exampleText = "";
                for (i = 0; i < selected.length; i++) {
                    exampleText += `<b>Example ${i + 1}</b><br>${corpus2[selected[i]]}<br><br>`;
                }
                document.getElementById('text2').innerHTML = exampleText;
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
        },
        error: function(data) {
            console.log(data);
        }
    })
};



function create_chart(chart_id, chart_data) {
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
                        text: `${currentWord} (epoch 1)`,
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

function create_autocomplete(input_id, epoch1Name, epoch2Name, chart1, chart2) {
    const field = document.getElementById(input_id);
    const autocomplete = new Autocomplete(field, {
        data: wordList,
        maximumItems: 15,
        threshold: 1,
        onSelectItem: ({label, value}) => {
            currentWord = label;
            const data1 = [];
            for (let i = 0; i < clustersReport[currentWord][epoch1Name].length; i++) {
                data1.push(clustersReport[currentWord][epoch1Name][i].length);
            }
            const labels1 = [];
            for (let i = 0; i < data1.length; i++) {
                labels1.push('Cluster ' + (i + 1));
            }
            chart1.data.labels = labels1
            chart1.data.datasets[0].data = data1
            chart1.options.plugins.legend.title.text = currentWord + " (Epoch 1)"

            const data2 = []
            for (let i = 0; i < clustersReport[currentWord][epoch2Name].length; i++) {
                data2.push(clustersReport[currentWord][epoch2Name][i].length)
            }
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
        lastActivePoint['element'].innerRadius = lastActivePoint['element'].innerRadius - 20;
    }
    if (lastActivePoint != -1) {
        lastActivePoint['element'].outerRadius = lastActivePoint['element'].outerRadius - 20;
    }

    if (activePoints[0]['element'].innerRadius == innerRadius) {
        activePoints[0]['element'].innerRadius = activePoints[0]['element'].innerRadius + 20;
        lastActivePoint = activePoints[0]
    }
    if (activePoints[0]['element'].outerRadius == outerRadius) {
        activePoints[0]['element'].outerRadius = activePoints[0]['element'].outerRadius + 20;
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
