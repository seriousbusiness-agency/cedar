<section class="company" id="company" data-component="company">
	<?php if ($image = $block->image()->toFile()): ?>
	<figure class="company__image">
		<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
	</figure>
	<?php endif ?>

	<div class="company__content">
		<h2 class="company__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="company__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		<?php if ($button = $block->button()->toStructure()->first()): ?>
		<div class="company__button" data-anim="fadein" data-anim-delay="0.3">
			<?php snippet('button', [
				'title' => $button->title(),
				'arrow' => true,
				'href' => $button->url(),
				'target' => $button->target()
			]) ?>
		</div>
		<?php endif ?>
	</div>
</section>
