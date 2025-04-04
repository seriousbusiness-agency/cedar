<section class="video" id="video" data-component="video">
	<header class="video__heading">
		<h2 class="video__title" data-anim="lines"><?= $block->title() ?></h2>
		<p class="video__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
	</header>

	<div class="video__video">
		<div class="video__video__wrapper">
			<div class="video__video__container">
				<?php if ($video = $block->video()->toFile()): ?>
				<div class="video__video__thumb" data-component="lazy-video">
					<?php if ($thumbnail = $block->thumbnail()->toFile()): ?>
						<img class="poster "src="<?= $thumbnail->url() ?>" alt="<?= $thumbnail->alt() ?>">
					<video
						preload="metadata"
						src="<?= $video->url() ?>#t=0.001"
					></video>
					<?php endif ?>
				</div>
				<div class="video__video__cursor" data-cursor="hover-video">
					<div class="wrapper">
						<div class="base">
							<span>Play</span>
						</div>
					</div>
				</div>
				<?php endif ?>
			</div>
		</div>
	</div>
</section>
