<section class="newsletter" id="newsletter" data-component="newsletter">
	<header class="newsletter__heading">
		<h2 class="newsletter__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="newsletter__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>
	<div class="newsletter__form" data-anim="fadein" data-anim-stagger="0.2">
		<input class="newsletter__form__input" type="text" placeholder="<?= $block->namePlaceholder() ?>">
		<input class="newsletter__form__input" type="email" placeholder="<?= $block->emailPlaceholder() ?>">
		<div class="newsletter__form__button">
			<?php snippet('button', ['title' => $block->button(), 'arrow' => true, 'href' => '#', 'target' => '_self']) ?>
		</div>
	</div>
</section>
