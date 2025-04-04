<section class="quote" id="quote" data-component="quote">
	<div class="quote__slider">
		<div class="quote__slide swiper-slide">
			<div class="quote__slide__content">
				<?php if ($logo = $block->logo()->toFile()): ?>
					<figure class="quote__slide__logo">
						<img data-anim="fadein" src="<?= $logo->url() ?>" alt="<?= $logo->alt() ?>">
					</figure>
				<?php endif ?>
				<p class="quote__slide__paragraph" data-anim="lines"><?= $block->quote() ?></p>
				<span class="quote__slide__line"></span>
				<div class="quote__slide__infos line">
					<?php if ($image = $block->image()->toFile()): ?>
						<figure class="quote__slide__image">
							<img data-anim="fadein" data-anim-delay="0.2" src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
						</figure>
					<?php endif ?>
					<h4 class="quote__slide__name" data-anim="lines" data-anim-delay="0.4"><?= $block->name() ?></h4>
					<p class="quote__slide__position" data-anim="lines" data-anim-delay="0.6"><?= $block->position() ?></p>
				</div>
			</div>
		</div>
	</div>
</section>
