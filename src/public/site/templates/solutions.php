<?php
if ($page->isHidden()->toBool()) {
    go('error');
    exit;
}
?>

<?php snippet('header') ?>

<?php // if(false): ?>
	<?php foreach($page->blocks()->toBlocks() as $block): ?>

		<?php snippet('blocks/' . $block->type(), ['block' => $block]) ?>
	<?php endforeach ?>
<?php // endif; ?>

<?php snippet('closing') ?>
