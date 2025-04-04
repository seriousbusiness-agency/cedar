<section class="disproportional-cards" id="disproportional-cards" data-component="disproportional-cards">
	<header class="disproportional-cards__heading">
		<h2 class="disproportional-cards__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="disproportional-cards__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<div class="disproportional-cards__items">
		<?php foreach ($block->cards()->toStructure() as $card): ?>
		<div class="disproportional-cards__item">
			<header class="disproportional-cards__item__heading">
				<figure class="disproportional-cards__item__icon">
					<?php if ($icon = $card->icon()->toFile()): ?>
					<img src="<?= $icon->url() ?>" alt="<?= $icon->alt() ?>">
					<?php endif ?>
					<h3 class="disproportional-cards__item__title" data-anim="lines"><?= $card->title() ?></h3>
				</figure>
				<p class="disproportional-cards__item__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $card->description() ?></p>
			</header>

			<?php if ($image = $card->image()->toFile()): ?>
			<figure class="disproportional-cards__item__image">
				<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
			</figure>
			<?php endif ?>
		</div>
		<?php endforeach ?>
	</div>
</section>
