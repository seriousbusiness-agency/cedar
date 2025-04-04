<section class="image" id="image" data-component="image">
	<?php if($image = $block->image()->toFile()): ?>
  	<figure class="image__image" data-anim="fadein">
      <img src="<?= $image->url() ?>" alt="<?= $block->title() ?>">
			<?php if($block->description()->isNotEmpty()): ?>
			 <figcaption><?= $block->description() ?></figcaption>
			<?php endif; ?>
		</figure>
	<?php endif ?>
</section>
