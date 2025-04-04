<a class='button <?= $arrow ? '' : 'button--no-arrow' ?>' data-component="button" <?= $target == '_self' ? 'data-router' : '' ?> href='<?= $href ?>' target='<?= $target ?>'>
	<div>
		<?php if($arrow): ?>
			<span class="button__arrow"></span>
		<?php endif; ?>
		<span class="button__title"><?= $title ?></span>
		<?php if($arrow): ?>
			<span class="button__arrow"></span>
		<?php endif; ?>
	</div>
</a>
