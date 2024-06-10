<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $score = $data['score'];
    if (!file_exists('scores.txt')) {
        file_put_contents('scores.txt', '');
    }
    file_put_contents('scores.txt', $score . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'success']);
}
?>
