<section class="success-story-slider  <?= $block->backgroundColor()->value() === 'white' ? 'success-story-slider--white' : '' ?>" id="success-story-slider" data-component="success-story-slider">
	<div class="success-story-slider__slider">
		<div class="success-story-slider__buttons">
			<div class="success-story-slider__button success-story-slider__button--prev"></div>
			<div class="success-story-slider__button success-story-slider__button--next"></div>
		</div>
		<div class="swiper-wrapper">
			<?php foreach ($block->slides()->toStructure() as $index => $slide): ?>
				<div class="success-story-slider__slide swiper-slide">
					<div class="success-story-slider__slide__content">
						<?php if ($logo = $slide->logo()->toFile()): ?>
							<figure class="success-story-slider__slide__logo">
								<img <?= $index == 0 ? 'data-anims="fadein"' : '' ?> <?= $index !== 0 ? 'data-anim-keeps' : '' ?> src="<?= $logo->url() ?>" alt="<?= $logo->alt() ?>">
							</figure>
						<?php endif ?>
						<p class="success-story-slider__slide__paragraph" <?= $index == 0 ? 'data-anims="lines"' : '' ?> data-anim-keep><?= $slide->quote() ?></p>
						<div class="success-story-slider__slide__progress-bar"></div>
						<div class="success-story-slider__slide__infos <?= $slide->link()->toStructure()->first() ? 'line' : 'no-line' ?>">
							<h4 class="success-story-slider__slide__name" <?= $index == 0 ? 'data-anims="lines" data-anim-delays="0.2"' : '' ?> data-anim-keep><?= $slide->name() ?></h4>
							<p class="success-story-slider__slide__position" <?= $index == 0 ? 'data-anims="lines" data-anim-delays="0.4"' : '' ?> data-anim-keep><?= $slide->position() ?></p>
							<?php if ($link = $slide->link()->toStructure()->first()): ?>
								<div class="success-story-slider__slide__link-wrapper" <?= $index == 0 ? 'data-anims="fadein" data-anim-staggers="0.2" data-anim-delays="0.6"' : '' ?> data-anim-keeps>
									<a href="<?= $link->url() ?>" class="success-story-slider__slide__link" <?= $link->target()->isNotEmpty() ? 'target="' . $link->target() . '"' : '' ?>>
										<span class="success-story-slider__slide__link__arrow"></span>
										<span class="success-story-slider__slide__link__title"><?= $link->title() ?></span>
										<span class="success-story-slider__slide__link__arrow"></span>
									</a>
								</div>
							<?php endif ?>
						</div>
					</div>

					<?php if ($image = $slide->image()->toFile()): ?>
						<figure class="success-story-slider__slide__image">
							<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
						</figure>
					<?php endif ?>
				</div>
			<?php endforeach ?>
		</div>
	</div>
</section>
