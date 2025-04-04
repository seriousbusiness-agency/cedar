<section class="marquee" id="marquee" data-component="marquee">
	<div class="marquee__wrapper">
		<?php for($x = 0; $x < 3; $x++) { ?>
			<div class="marquee__items">
				<?php foreach ($block->logos()->toFiles() as $logo): ?>
					<img decoding="async" width="1" height="1" src="<?= $logo->url() ?>" alt="<?= $logo->alt() ?>">
				<?php endforeach ?>
			</div>
		<?php } ?>
	</div>
</section>
