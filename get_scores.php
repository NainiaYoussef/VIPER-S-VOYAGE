<?php
if (file_exists('scores.txt')) {
    $scores = file('scores.txt', FILE_IGNORE_NEW_LINES);
    echo json_encode($scores);
} else {
    echo json_encode([]);
}
?>
