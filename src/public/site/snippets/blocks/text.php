<section class="text" id="text" data-component="text">
  <div class="text-wrapper">
		<?php if($block->title()->isNotEmpty()): ?>
			<h2 class="text__title" data-anim="lines"><?= $block->title() ?></h2>
		<?php endif; ?>
		<?php if($block->bigText()->isNotEmpty()): ?>
			<div class="text__paragraph--big" data-anim="fadein" data-anim-delay="0.2"><?= $block->bigText()->kt() ?></div>
		<?php endif; ?>
		<?php if($block->text()->isNotEmpty()): ?>
			<div class="text__paragraph" data-anim="fadein" data-anim-delay="0.2"><?= $block->text()->kt() ?></div>
		<?php endif; ?>
  </div>
</section>
