<section class="career-benefits" id="career-benefits" data-component="career-benefits">
	<header class="career-benefits__heading">
		<h2 class="career-benefits__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="career-benefits__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<div class="career-benefits__items" data-cursor="active">
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
			<?php foreach ($block->benefits()->toStructure() as $benefit): ?>
			<div class="career-benefits__item swiper-slide">
				<header class="career-benefits__item__heading">
					<h3 class="career-benefits__item__title" data-anim="lines"><?= $benefit->title() ?></h3>
				</header>

				<div class="career-benefits__item__content">
					<p class="career-benefits__item__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $benefit->description() ?></p>
				</div>
			</div>
			<?php endforeach ?>
		</div>

		<div class="career-benefits__items__buttons mobile-only">
			<div class="career-benefits__items__button career-benefits__items__button--prev"></div>
			<div class="career-benefits__items__button career-benefits__items__button--next"></div>
		</div>
	</div>
</section>
