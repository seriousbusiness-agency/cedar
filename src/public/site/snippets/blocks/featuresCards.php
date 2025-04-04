<section class="features-cards" id="features-cards" data-component="features-cards">
	<header class="features-cards__heading">
		<h2 class="features-cards__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="features-cards__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<ul class="features-cards__cards">
		<?php foreach($block->cards()->toStructure() as $card): ?>
			<li class="features-cards__card">
				<figure class="features-cards__card__icon">
					<?php if($image = $card->icon()->toFile()): ?>
						<img data-anim="fadein" src="<?= $image->url() ?>" alt="<?= $card->title() ?>">
					<?php endif ?>
				</figure>
				<div class="features-cards__card__content">
					<h3 class="features-cards__card__title" data-anim="lines"><?= $card->title() ?></h3>
					<p class="features-cards__card__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $card->description() ?></p>
				</div>
			</li>
		<?php endforeach ?>
	</ul>
</section>
