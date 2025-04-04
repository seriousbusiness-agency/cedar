<section class="how-it-works" id="how-it-works" data-component="how-it-works">
	<header class="how-it-works__heading">
		<h2 class="how-it-works__title" data-anim="lines"><?= $block->title() ?></h2>
		<?php if($block->description()->isNotEmpty()): ?>
			<p class="how-it-works__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		<?php endif; ?>
	</header>

	<div class="how-it-works__slider" data-cursor="active">
		<div class="wrapper">
			<div class="base">
				<div>
					<span>DRAG</span>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect width="18" height="18" rx="9" fill="#A57CFF"/>
						<g clip-path="url(#clip0_5522_44452)">
						<path d="M12.75 7.125L14.625 9L12.75 10.875" stroke="#FDFDFD" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M10.875 9H14.625" stroke="#FDFDFD" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M5.25 7.125L3.375 9L5.25 10.875" stroke="#FDFDFD" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M3.375 9H7.125" stroke="#FDFDFD" stroke-linecap="round" stroke-linejoin="round"/>
						</g>
						<defs>
						<clipPath id="clip0_5522_44452">
						<rect width="15" height="15" fill="white" transform="translate(1.5 1.5)"/>
						</clipPath>
						</defs>
					</svg>
				</div>
			</div>
		</div>
		<div class="swiper-wrapper">
			<?php foreach ($block->slides()->toStructure() as $index => $slide): ?>
			<div class="how-it-works__slide swiper-slide">
				<div class="how-it-works__slide__content">
					<p class="how-it-works__slide__number"><?= $index + 1 ?></p>
					<div class="how-it-works__slide__text">
						<h3 class="how-it-works__slide__title" data-anim="lines" data-anim-delay="0.2"><?= $slide->title() ?></h3>
						<p class="how-it-works__slide__paragraph" data-anim="lines" data-anim-delay="0.4"><?= $slide->description() ?></p>
						<?php if ($cta = $slide->cta()->toStructure()->first()): ?>
							<div class="how-it-works__slide__link-wrapper">
								<a href="<?= $cta->url() ?>" <?= $cta->target() === '_self' ? 'data-router' : '' ?> target="<?= $cta->target() ?>" class="how-it-works__slide__link">
									<span class="how-it-works__slide__link__arrow"></span>
									<span class="how-it-works__slide__link__title"><?= $cta->title() ?></span>
									<span class="how-it-works__slide__link__arrow"></span>
								</a>
							</div>
						<?php endif ?>
					</div>
				</div>
				<?php if ($image = $slide->image()->toFile()): ?>
				<figure class="how-it-works__slide__image">
					<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
				</figure>
				<?php endif ?>
			</div>
			<?php endforeach ?>
		</div>
	</div>
</section>
