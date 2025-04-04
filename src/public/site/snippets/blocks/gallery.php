<section class="gallery" id="gallery" data-component="gallery">
  <header class="gallery__heading">
    <h2 class="gallery__title" data-anim="lines"><?= $block->title() ?></h2>
    <p class="gallery__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
  </header>

  <div class="gallery__cards-wrapper">
    <div class="gallery__cards">
      <?php foreach($block->images()->toStructure() as $card): ?>
				<?php if ($image = $card->image()->toFile()): ?>
					<div class="gallery__card swiper-slide">
						<figure class="gallery__card__image">
							<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
						</figure>
					</div>
				<?php endif ?>
      <?php endforeach ?>
    </div>

    <div class="gallery__cards__buttons mobile-only">
      <div class="gallery__cards__button gallery__cards__button--prev"></div>
      <div class="gallery__cards__button gallery__cards__button--next"></div>
    </div>
  </div>
</section>
