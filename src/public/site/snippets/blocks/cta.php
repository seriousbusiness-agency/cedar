<section class="cta" id="cta" data-component="cta">
	<header class="cta__heading">
		<h2 class="cta__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="cta__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<div class="cta__items">
		<?php foreach ($block->items()->toStructure() as $item): ?>
		<div class="cta__item">
			<?php if ($image = $item->image()->toFile()): ?>
			<figure class="cta__item__image">
				<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
			</figure>
			<?php endif ?>
			<div class="cta__item__content">
				<header class="cta__item__heading">
					<h3 class="cta__item__title" data-anim="lines"><?= $item->title() ?></h3>
					<p class="cta__item__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $item->description() ?></p>
				</header>
				<?php if ($button = $item->button()->toStructure()->first()): ?>
				<div class="cta__item__button" data-anim="fadein" data-anim-delay="0.3">
					<?php snippet('button', [
						'title' => $button->title(),
						'arrow' => true,
						'href' => $button->url(),
						'target' => $button->target()
					]) ?>
				</div>
				<?php endif ?>
			</div>
		</div>
		<?php endforeach ?>
	</div>
</section>
