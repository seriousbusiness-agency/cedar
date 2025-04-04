<section class="hero-variant lottie" id="hero-variant" data-component="hero-variant">
	<header class="hero-variant__heading">
		<h1 class="hero-variant__title" data-anim-adjust data-anim="lines"><?= $block->title() ?></h1>
		<p class="hero-variant__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		<?php if ($cta = $block->cta()->toStructure()->first()): ?>
		<div class="hero-variant__button" data-anim="fadein" data-anim-delay="0.3">
			<?php snippet('button', [
				'title' => $cta->title(),
				'arrow' => true,
				'href' => $cta->url(),
				'target' => $cta->target()
			]) ?>
		</div>
		<?php endif ?>
	</header>

	<div class="hero-variant__images-wrapper" data-anim="fadeins" data-anim-duration="0.75">
		<div class="hero__see-more mobile-only variant">
			<div class="hero__see-more__arrow"></div>
		</div>
		<div class="hero-variant__images-container">
			<?php foreach ($block->screens()->toStructure() as $screen): ?>
				<figure class="hero-variant__image">
				</figure>
			<?php endforeach ?>
		</div>

		<div class="hero-variant__cards">
			<?php foreach ($block->screens()->toStructure() as $screen): ?>
			<div class="hero-variant__card">
				<?php if ($icon = $screen->icon()->toFile()): ?>
				<figure class="hero-variant__card__icon">
					<img data-anim="fadein" src="<?= $icon->url() ?>" alt="<?= $icon->alt() ?>">
				</figure>
				<?php endif ?>

				<div class="hero-variant__card__content">
					<h3 class="hero-variant__card__title" data-anim="lines"><?= $screen->title() ?></h3>
					<p class="hero-variant__card__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $screen->paragraph() ?></p>
				</div>
			</div>
			<?php endforeach ?>
		</div>
	</div>

	<div class="hero__see-more desktop-only variant" data-anim="fadein" data-anim-stagger="0.2" data-anim-delay="0.5">
		<div class="hero__see-more__arrow"></div>
	</div>
</section>
