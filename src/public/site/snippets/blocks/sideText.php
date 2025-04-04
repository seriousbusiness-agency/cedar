<?php
	$extendContent = !$block->icon()->toFile() && $block->subtitle()->isEmpty();
?>
<section class="side-text <?= $block->position() ?>" id="side-text" data-component="side-text">
	<?php if($image = $block->image()->toFile()): ?>
  	<figure class="side-text__image" data-anim="fadein">
      <img src="<?= $image->url() ?>" alt="<?= $block->title() ?>">
		</figure>
	<?php endif ?>

  <div class="side-text__content">
		<?php if($block->icon()->toFile() || $block->subtitle()->isNotEmpty()): ?>
			<div class="side-text__top">
				<?php if($icon = $block->icon()->toFile()): ?>
					<figure class="side-text__icon">
						<img src="<?= $icon->url() ?>" alt="">
					</figure>
				<?php endif ?>
				<?php if($block->subtitle()->isNotEmpty()): ?>
					<p class="side-text__subtitle" data-anim="lines"><?= $block->subtitle() ?></p>
				<?php endif; ?>
			</div>
		<?php endif; ?>

    <div class="side-text__text <?= $extendContent ? 'extend' : '' ?>">
			<?php if( $block->title()->isNotEmpty()): ?>
				<h2 class="side-text__title" data-anim="lines"><?= $block->title() ?></h2>
			<?php endif; ?>
			<?php if( $block->description()->isNotEmpty() ): ?>
      	<p class="side-text__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
			<?php endif ?>
    </div>
  </div>
</section>
