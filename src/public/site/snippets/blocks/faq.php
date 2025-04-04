<section class="faq <?= $block->backgroundColor() === 'white' ? 'faq--white' : '' ?>" id="faq" data-component="faq">
	<h2 class="faq__title" data-anim="lines"><?= $block->title() ?></h2>

	<div class="faq__items">
		<?php
		$items = $block->items()->toStructure();
		$itemsPerColumn = ceil($items->count() / 2);
		$columns = array_chunk($items->toArray(), $itemsPerColumn);
		?>

		<?php foreach ($columns as $column): ?>
			<ul class="faq__items-wrapper" data-anim="fadein" data-anim-stagger="0.2">
				<?php foreach ($column as $item): ?>
					<li class="faq__item">
						<h3 class="faq__item__title"><?= $item['question'] ?><span></span></h3>
						<div class="faq__item__content">
							<p><?= $item['answer'] ?></p>
						</div>
					</li>
				<?php endforeach ?>
			</ul>
		<?php endforeach ?>
	</div>
</section>
