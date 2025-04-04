<section class="team" id="team" data-component="team">
	<header class="team__heading">
		<div class="team__content">
			<h2 class="team__title" data-anim="lines"><?= $block->title() ?></h2>
			<p class="team__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		</div>

		<div class="team__filters-wrapper">
			<div class="team__filters">
				<p class="team__filters__title">Filter</p>
				<div class="team__filters__items-wrapper">
					<div class="team__filters__items">
						<p class="team__filters__items__title">Product</p>
						<?php foreach($block->filters()->toStructure() as $filter): ?>
							<div class="team__filters__item">
								<label for="<?= $filter->id() ?>">
									<input type="checkbox" id="<?= $filter->id() ?>" name="<?= $filter->id() ?>" required>
									<span class="team__filters__item__text"><?= $filter->title() ?></span>
								</label>
							</div>
						<?php endforeach ?>
					</div>
				</div>
			</div>
		</div>
	</header>

	<div class="team__items">
		<?php foreach($block->members()->toStructure() as $member): ?>
			<div class="team__item" data-filter="<?= $member->department() ?>">
				<header class="team__item__heading">
					<h3 class="team__item__title" data-anim="lines"><?= $member->name() ?> <span></span></h3>
				</header>

				<div class="team__item__content">
					<div class="team__item__tags" data-anim="fadein" data-anim-stagger="0.2">
						<p class="team__item__tag"><?= $member->position() ?></p>
						<?php if($member->contact()->isNotEmpty()): ?>
							<a href="mailto:<?= $member->contact() ?>" class="team__item__tag">Contact</a>
						<?php endif ?>
					</div>
					<p class="team__item__paragraph"><?= $member->description() ?></p>
					<?php if($member->linkedin()->isNotEmpty()): ?>
						<div class="team__item__link-wrapper">
							<a href="<?= $member->linkedin() ?>" class="team__item__link" target="_blank">
								<span class="team__item__link__arrow"></span>
								<span class="team__item__link__title">Linkedin</span>
								<span class="team__item__link__arrow"></span>
							</a>
						</div>
					<?php endif ?>
				</div>

				<?php if($image = $member->image()->toFile()): ?>
					<figure class="team__item__image">
						<img src="<?= $image->url() ?>" alt="<?= $member->name() ?>">
					</figure>
				<?php endif ?>
			</div>
		<?php endforeach ?>
	</div>
</section>
