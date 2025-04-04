<section class="products" id="products" data-component="products">
	<header class="products__heading">
		<h2 class="products__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="products__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<article class="products__items">
		<?php foreach ($block->items()->toStructure() as $item): ?>
		<div class="products__item">
			<?php if ($logo = $item->logo()->toFile()): ?>
			<figure class="products__item__logo">
				<img src="<?= $logo->url() ?>" alt="<?= $logo->alt() ?>">
			</figure>
			<?php endif ?>

			<div class="products__item__paragraph">
				<p data-anim="lines"><?= $item->description() ?></p>
			</div>

			<?php if ($link = $item->link()->toStructure()->first()): ?>
			<div class="products__item__read-more-wrapper">
				<a href="<?= $link->url() ?>" <?= $link->target() === '_self' ? 'data-router' : '' ?> class="products__item__read-more" target="<?= $link->target() ?>">
					<span class="products__item__read-more__arrow"></span>
					<span class="products__item__read-more__title"><?= $link->title() ?></span>
					<span class="products__item__read-more__arrow"></span>
				</a>
			</div>
			<?php endif ?>

			<?php if ($image = $item->image()->toFile()): ?>
			<figure class="products__item__image">
				<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
			</figure>
			<?php endif ?>
		</div>
		<?php endforeach ?>
	</article>
</section>
