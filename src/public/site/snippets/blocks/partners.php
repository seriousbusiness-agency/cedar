<section class="partners" id="partners" data-component="partners">
	<header class="partners__heading">
		<h2 class="partners__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="partners__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>
	<div class="partners__items">
		<div class="swiper-wrapper">
			<?php foreach($block->items()->toStructure() as $item): ?>
				<div class="partners__item swiper-slide">
					<?php if($image = $item->logo()->toFile()): ?>
						<figure class="partners__item__logo">
							<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
						</figure>
					<?php endif;?>
					<div class="partners__item__content">
						<p class="partners__item__category" data-anim="lines"><?= $item->category() ?></p>
						<h3 class="partners__item__title" data-anim="lines" data-anim-delay="0.2"><?= $item->title() ?></h3>
						<p class="partners__item__paragraph" data-anim="lines" data-anim-delay="0.4"><?= $item->description() ?></p>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="partners__items__buttons mobile-only">
      <div class="partners__items__button partners__items__button--prev"></div>
      <div class="partners__items__button partners__items__button--next"></div>
    </div>
	</div>
</section>
