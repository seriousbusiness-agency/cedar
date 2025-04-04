<section class="hero image-<?= $block->imageSize()->value() ?> <?= $block->mediaType()->value() ?> <?= $block->backgroundColor()->value() ?> <?= $block->extendImage()->value() === 'extend' ? 'extend-image' : 'contain-image' ?>" data-component="hero">
	<header class="hero__heading">
		<h1 class="hero__title" data-anim-adjust data-anim="lines" data-anim-keep><?= $block->title() ?></h1>
		<p class="hero__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		<?php if ($cta = $block->button()->toStructure()->first()): ?>
			<div class="hero__button" data-anim="fadein" data-anim-delay="0.3">
				<?php snippet('button', [
					'title' => $cta->title(),
					'arrow' => true,
					'href' => $cta->url(),
					'target' => $cta->target()
				]) ?>
			</div>
		<?php endif ?>
	</header>

	<?php if($block->mediaType()->value() === 'lottie'): ?>
		<figure class="hero__image" data-anim="fadein"></figure>
	<?php endif; ?>

	<?php if($block->mediaType()->value() === 'image' && $image = $block->image()->toFile()): ?>
		<figure class="hero__image" data-anim="fadein">
			<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
		</figure>
	<?php endif; ?>

	<div class="hero__see-more desktop-only" data-anim="fadein" data-anim-stagger="0.2" data-anim-delay="0.5">
		<div class="hero__see-more__arrow"></div>
	</div>
</section>
