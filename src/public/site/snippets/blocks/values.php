<section class="values" id="values" data-component="values">
	<header class="values__heading">
		<h2 class="values__title" data-anim="lines"><?= $block->title()?></h2>
		<p class="values__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description()?></p>
	</header>

	<div class="values__items" data-cursor="active">
		<div class="swiper-wrapper">
			<?php $x = 0; foreach ($block->items()->toStructure() as $item): $x++ ?>
			<div class="values__item swiper-slide number">
				<header class="values__item__heading">
					<p class="values__item__number" data-anim="lines"><?= $x ?></p>
					<h3 class="values__item__text small" data-anim="lines"><?= $item->title() ?></h3>
				</header>

				<div class="values__item__content">
					<p class="values__item__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $item->description() ?></p>
				</div>
			</div>
			<?php endforeach ?>
		</div>
	</div>
</section>
