<section class="history" id="history" data-component="history">
	<header class="history__heading">
		<h2 class="history__title" data-anim="lines"><?= $block->title() ?></h2>
		<div class="history__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description()->kt() ?></div>
	</header>

	<div class="history__items">
		<?php $counter = 1; ?>
		<?php foreach($block->items()->toStructure() as $item): ?>
			<div class="history__item-wrapper" data-anim>
				<div class="history__item">
					<div class="history__item__top" data-anim="fadein" data-anim-stagger="0.2">
						<p class="history__item__number"><?= $counter ?></p>
						<div class="history__item__years" data-anim="fadein" data-anim-stagger="0.2">
							<?php if($item->startYear()->isNotEmpty()): ?>
								<p class="history__item__year"><?= $item->startYear() ?></p>
							<?php endif; ?>
							<!-- <span class="history__item__year__arrow"></span> -->
							 <?php if($item->endYear()->isNotEmpty()): ?>
								<p class="history__item__year"><?= $item->endYear() ?></p>
							 <?php endif; ?>
						</div>
					</div>

					<?php if($image = $item->image()->toFile()): ?>
						<figure class="history__item__image" data-anim="fadein" data-anim-duration="0.75">
							<img src="<?= $image->url() ?>" alt="<?= $item->title() ?>">
						</figure>
					<?php endif ?>

					<div class="history__item__content">
						<h3 class="history__item__title" data-anim="lines"><?= $item->title() ?></h3>
						<div class="history__item__paragraph" data-anim="fadein"><?= $item->description()->kt() ?></div>
					</div>
				</div>
			</div>
			<?php $counter++ ?>
		<?php endforeach ?>

		<div class="history__items__line"></div>
	</div>

	<?php if($button = $block->button()->toStructure()->first()): ?>
		<div class="history__button">
			<?php snippet('button', [
				'title' => $button->title(),
				'arrow' => true,
				'href' => $button->url(),
				'target' => $button->target()
			]) ?>
		</div>
	<?php endif ?>
</section>
