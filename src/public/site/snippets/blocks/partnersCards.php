<section class="partners-cards" id="partners-cards" data-component="partners-cards">
	<header class="partners-cards__heading">
		<div class="partners-cards__content">
			<h2 class="partners-cards__title" data-anim="lines"><?= $block->title() ?></h2>
			<p class="partners-cards__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		</div>

		<div class="partners-cards__filters-wrapper">
			<div class="partners-cards__filters">
				<p class="partners-cards__filters__title">Filter</p>
				<div class="partners-cards__filters__items-wrapper">
					<div class="partners-cards__filters__items">
						<p class="partners-cards__filters__items__title">Type</p>
						<?php foreach($block->types()->toStructure() as $filter): ?>
							<div class="partners-cards__filters__item">
								<label for="<?= $filter->id() ?>">
									<input type="checkbox" data-filter-type="<?= $filter->id() ?>" id="<?= $filter->id() ?>" name="<?= $filter->id() ?>" required>
									<span class="partners-cards__filters__item__text"><?= $filter->title() ?></span>
								</label>
							</div>
						<?php endforeach ?>
					</div>
				</div>
				<div class="partners-cards__filters__items-wrapper">
					<div class="partners-cards__filters__items">
						<p class="partners-cards__filters__items__title">Location</p>
						<?php foreach($block->locations()->toStructure() as $filter): ?>
							<div class="partners-cards__filters__item">
								<label for="<?= $filter->id() ?>">
									<input type="checkbox" data-filter-location="<?= $filter->id() ?>" id="<?= $filter->id() ?>" name="<?= $filter->id() ?>" required>
									<span class="partners-cards__filters__item__text"><?= $filter->title() ?></span>
								</label>
							</div>
						<?php endforeach ?>
					</div>
				</div>
			</div>
		</div>
	</header>

	<div class="partners-cards__items">
		<?php foreach($block->partners()->toStructure() as $partner): ?>
			<div class="partners-cards__item" data-filter-type="<?= $partner->type() ?>" data-filter-location="<?= $partner->location() ?>">
				<figure class="partners-cards__item__logo" data-anim="fadein" data-anim-stagger="0.2">
					<?php if($logo = $partner->logo()->toFile()): ?>
						<img src="<?= $logo->url() ?>" alt="<?= $partner->title() ?>">
					<?php endif ?>
				</figure>

				<div class="partners-cards__item__content">
					<header class="partners-cards__item__heading">
						<div class="partners-cards__item__title">
							<h3 data-anim="lines" data-anim-delay="0.2"><?= $partner->title() ?></h3>
							<span data-anim="fadein" class="icon" data-anim-delay="0.4"></span>
						</div>
						<p class="partners-cards__item__category" data-anim="lines" data-anim-delay="0.5"><?= $block->types()->toStructure()->findBy('id', $partner->type())->title() ?></p>
					</header>
					<div class="partners-cards__item__text-wrapper">
						<div class="partners-cards__item__text">
							<p class="partners-cards__item__paragraph"><?= $partner->description() ?></p>
							<div class="partners-cards__item__link-wrapper">
								<a href="<?= $partner->website() ?>" class="partners-cards__item__link" target="_blank">
									<span class="partners-cards__item__link__title">Go to website</span>
									<span class="partners-cards__item__link__icon">
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g clip-path="url(#clip0_5054_24668)">
											<path d="M9.16732 5.8335H5.00065C4.55862 5.8335 4.1347 6.00909 3.82214 6.32165C3.50958 6.63421 3.33398 7.05814 3.33398 7.50016V15.0002C3.33398 15.4422 3.50958 15.8661 3.82214 16.1787C4.1347 16.4912 4.55862 16.6668 5.00065 16.6668H12.5007C12.9427 16.6668 13.3666 16.4912 13.6792 16.1787C13.9917 15.8661 14.1673 15.4422 14.1673 15.0002V10.8335" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M8.33398 11.6668L16.6673 3.3335" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M12.5 3.3335H16.6667V7.50016" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
											</g>
											<defs>
											<clipPath id="clip0_5054_24668">
											<rect width="20" height="20" fill="white"/>
											</clipPath>
											</defs>
										</svg>
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		<?php endforeach ?>
	</div>
</section>
