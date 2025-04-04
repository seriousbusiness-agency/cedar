<section class="tabs" id="tabs" data-component="tabs">
	<header class="tabs__heading">
		<h2 class="tabs__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="tabs__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<ul class="tabs__items" data-component="timed-accordion">
		<?php foreach ($block->items()->toStructure() as $item): ?>
			<li class="tabs__item">
				<div class="tabs__item-wrapper">
					<div class="tabs__item__top">
						<?php if ($logo = $item->logo()->toFile()): ?>
						<figure class="tabs__item__logo">
							<img src="<?= $logo->url() ?>" alt="<?= $logo->alt() ?>">
						</figure>
						<?php endif ?>
						<div class="tabs__item__icon desktop-only"></div>
					</div>
					<div class="tabs__item__paragraph">
						<header class="tabs__item__heading">
							<h3 class="tabs__item__title" data-anim="linesssss"><?= $item->title() ?></h3>
							<p data-anim="linesssss"><?= $item->description() ?></p>
							<?php if ($link = $item->link()->toStructure()->first()): ?>
							<a href="<?= $link->url() ?>" data-router class="tabs__item__link"><?= $link->title() ?></a>
							<?php endif ?>
						</header>
					</div>
				</div>

				<?php if ($image = $item->image()->toFile()): ?>
				<figure class="tabs__item__image">
					<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
				</figure>
				<?php endif ?>
			</li>
		<?php endforeach ?>
	</ul>
</section>
