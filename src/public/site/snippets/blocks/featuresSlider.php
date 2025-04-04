<section class="features-slider" id="features-slider" data-component="features-slider">
	<div class="features-slider__wrapper">
		<div class="features-slider__image">
			<img src="<?= loadAsset('/img/pc.png') ?>" alt="">
		</div>

		<article class="features-slider__slider">
			<div class="swiper-wrapper">
				<?php $x=0; foreach ($block->slides()->toStructure() as $slide): $x++ ?>
				<div class="features-slider__slide swiper-slide">
					<h3 class="features-slider__slide__title" <?= $x === 1 ? 'data-anim="lines"' : '' ?> data-anim-keep><?= $slide->title() ?></h3>
					<p class="features-slider__slide__paragraph" <?= $x === 1 ? 'data-anim="lines"' : '' ?> data-anim-delay="0.2" data-anim-keep><?= $slide->description() ?></p>
					<ul class="features-slider__slide__items">
						<?php foreach ($slide->benefits()->toStructure() as $benefit): ?>
							<li class="features-slider__slide__item">
								<?php if ($icon = $benefit->icon()->toFile()): ?>
								<figure class="features-slider__slide__item__image">
									<img src="<?= $icon->url() ?>" alt="<?= $icon->alt() ?>">
								</figure>
								<?php endif ?>
								<p class="features-slider__slide__item__paragraph" <?= $x === 1 ? 'data-anim="lines"' : '' ?> data-anim-delay="0.4" data-anim-keep><?= $benefit->description() ?></p>
							</li>
						<?php endforeach ?>
					</ul>
				</div>
				<?php endforeach ?>
			</div>

			<div class="features-slider__buttons">
				<div class="features-slider__button-wrapper">
					<div class="features-slider__button features-slider__button--prev">
						<span class="features-slider__button__arrow"></span>
						<span class="features-slider__button__title">Previous</span>
						<span class="features-slider__button__arrow"></span>
					</div>
				</div>

				<div class="features-slider__button-wrapper">
					<div class="features-slider__button features-slider__button--next">
						<span class="features-slider__button__arrow"></span>
						<span class="features-slider__button__title">Next</span>
						<span class="features-slider__button__arrow"></span>
					</div>
				</div>
			</div>
		</article>
	</div>
</section>
