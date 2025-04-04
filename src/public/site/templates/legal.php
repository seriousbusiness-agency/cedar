<?php
if ($page->isHidden()->toBool()) {
    go('error');
    exit;
}
?>

<?php snippet('header') ?>

<div class="legal__content"><?= $page->text()->kt() ?></div>

<?php snippet('closing') ?>
