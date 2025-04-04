<section class="events" id="events" data-component="events">
	<header class="events__heading">
		<h2 class="events__title" data-anim="title"><?= $block->title() ?></h2>
	</header>

	<div class="events__items">
		<div class="swiper-wrapper">
			<?php 
			$events = site()->events()->toStructure();
			foreach($events as $event): ?>
				<div class="events__item swiper-slide">
					<figure class="events__item__image">
						<?php if($image = $event->image()->toFile()): ?>
							<img src="<?= $image->url() ?>" alt="<?= $event->title()->html() ?>">
						<?php else: ?>
							<img src="<?= loadAsset('/img/placeholder.png') ?>" alt="">
						<?php endif ?>
					</figure>
					<div class="events__item__content">
						<div class="events__item__infos">
							<p class="events__item__date" data-anim="lines"><?= $event->date()->toDate('d.m.Y') ?></p>
							<p class="events__item__author" data-anim="lines" data-anim-delay="0.2"><?= $event->author()->html() ?></p>
						</div>

						<h3 class="events__item__title" data-anim="lines" data-anim-delay="0.3"><?= $event->title()->html() ?></h3>

						<div class="events__item__button" data-anim="fadein">
							<?php 
							if($link = $event->link()->toStructure()->first()):
								snippet('button', [
									'title' => 'Read more',
									'arrow' => true,
									'href' => $link->url(),
									'target' => $link->target()
								]);
							endif
							?>
						</div>
					</div>
				</div>
			<?php endforeach ?>
		</div>
		<div class="events__buttons">
			<div class="events__button events__button--prev"></div>
			<div class="events__button events__button--next"></div>
		</div>
	</div>
</section>
