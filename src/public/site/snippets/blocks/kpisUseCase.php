<section class="kpis use-case" id="kpis" data-component="kpis">
	<div class="kpis__items" data-cursor="active">
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
			<?php foreach ($block->items()->toStructure() as $item): ?>
			<div class="kpis__item swiper-slide">
				<header class="kpis__item__heading">
					<h3 class="kpis__item__text" data-anim="lines"><?= $item->title() ?></h3>
				</header>

				<div class="kpis__item__content">
					<p class="kpis__item__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $item->description() ?></p>
				</div>
			</div>
			<?php endforeach ?>
		</div>
	</div>
</section>
