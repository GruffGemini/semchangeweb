from sqlite3 import Cursor
from typing import Dict, List

EPOCH1_NAME_INTERNAL = 'Epoch1'
EPOCH2_NAME_INTERNAL = 'Epoch2'


def get_compare_change_data(database: Cursor) -> dict:
    database.execute('SELECT word, MIN(change) FROM wordDict JOIN wordChange USING(word_id)')
    min_result = database.fetchone()

    database.execute('SELECT word, MAX(change) FROM wordDict JOIN wordChange USING(word_id)')
    max_result = database.fetchone()

    database.execute('SELECT word, change FROM wordDict JOIN wordChange USING(word_id)')
    data = [{'label': row[0], 'value': row[1]} for row in database.fetchall()]

    return {'data': data, 'min_word': min_result[0], 'max_word': max_result[0], 'min': min_result[1],
            'max': max_result[1]}


def get_cluster_sizes(database: Cursor, word: str, epoch: str) -> Dict[str, List[int]]:
    if epoch == EPOCH1_NAME_INTERNAL:
        table = 'wordOccurrencesEpoch1'
    elif epoch == EPOCH2_NAME_INTERNAL:
        table = 'wordOccurrencesEpoch2'
    else:
        raise Exception('Unknown epoch name')

    query = database.execute(f'SELECT cluster_id, count(*) from {table} join wordDict using(word_id) '
                             f'where word = ? GROUP BY cluster_id', (word,))
    result = []
    for row in query.fetchall():
        result.append(row[1])

    return {"result": result}


def get_clusters_graph_data(database: Cursor) -> dict:
    compare_data = get_compare_change_data(database)
    max_word = compare_data['max_word']

    epoch1_clusters_count = get_cluster_sizes(database, max_word, EPOCH1_NAME_INTERNAL)['result']
    epoch2_clusters_count = get_cluster_sizes(database, max_word, EPOCH2_NAME_INTERNAL)['result']

    initial_data = [epoch1_clusters_count, epoch2_clusters_count]

    return {'word_metrics': compare_data['data'], 'initial_data': initial_data, 'max_word': max_word,
            'max': compare_data['max']}


def get_random_sentences(database: Cursor, word: str, epoch: str, cluster: int, n_sentences=5) -> Dict[str, List[str]]:
    if epoch == EPOCH1_NAME_INTERNAL:
        occur_table = 'wordOccurrencesEpoch1'
        corpus_table = 'corpusEpoch1'
    elif epoch == EPOCH2_NAME_INTERNAL:
        occur_table = 'wordOccurrencesEpoch2'
        corpus_table = 'corpusEpoch2'
    else:
        raise Exception('Unknown epoch name')

    query = f"""
            select text from {occur_table} 
            join wordDict ON {occur_table}.word_id = wordDict.word_id
            join {corpus_table} ON {corpus_table}.sentence_id = {occur_table}.sentence_id 
            where word = ? and cluster_id = ? ORDER BY RANDOM() limit ?
            """
    database.execute(query, (word, cluster, n_sentences))

    return {'result': list(database.fetchall())}


def get_change_between_clusters(database: Cursor, word: str, cluster1: int, cluster2: int):
    database.execute(
        """
        SELECT change from clusterDifference JOIN wordDict USING(word_id) where 
        word = ? AND epoch1_cluster = ? AND epoch2_cluster = ?
        """,
        (word, cluster1, cluster2)
    )
    return {'result': database.fetchone()[0]}
