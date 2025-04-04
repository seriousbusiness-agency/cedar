<section class="cards" data-component="cards">
	<div class="cards__wrapper">
		<header class="cards__heading">
			<h2 class="cards__title" data-anim="lines"><?= $block->title() ?></h2>
			<p class="cards__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		</header>

		<ul class="cards__list">
			<?php foreach ($block->items()->toStructure() as $item): ?>
			<li class="cards__item" data-component="cards-item">
				<header class="cards__item__header">
					<?php if ($icon = $item->icon()->toFile()): ?>
					<figure class="cards__item__icon">
						<img src="<?= $icon->url() ?>" alt="<?= $icon->alt() ?>">
					</figure>
					<?php endif ?>
					<div>
						<h3 class="cards__item__title" data-anim="lines"><?= $item->title() ?></h3>
						<p class="cards__item__text desktop-only" data-anim="lines" data-anim-delay="0.2" data-anim-keep><span><?= $item->description() ?></span></p>
					</div>
				</header>

				<article class="cards__item__info">
					<div class="cards__item__wrapper">
						<div class="cards__item__texts">
							<p class="cards__item__text mobile" data-anim="lines" data-anim-delay="0.2"><span><?= $item->description() ?></span></p>
						</div>

						<?php if ($item->mediaType()->value() === 'image'): ?>
							<?php if ($image = $item->image()->toFile()): ?>
								<figure class="cards__item__figure" data-anim>
									<div class="cards__item__image">
										<img src="<?= $image->url() ?>" alt="<?= $image->alt() ?>">
									</div>
								</figure>
							<?php endif ?>
							<?php elseif ($item->mediaType()->value() === 'video'): ?>
								<?php if ($video = $item->video()->toFile()): ?>
									<figure class="cards__item__figure" data-anim>
										<div class="cards__item__image" data-component="lazy-video">
											<img class="poster" src="<?= $item->videoThumbnail()->toFile()->url() ?>" alt="<?= $item->videoThumbnail()->toFile()->alt() ?>">
											<video
												preload="none"
												data-src="<?= $video->url() ?>"
												playsinline
												muted
											></video>
										</div>
									</figure>
								<?php endif ?>
							<?php endif ?>
					</div>
				</article>
			</li>
			<?php endforeach ?>
		</ul>
	</div>
</section>
