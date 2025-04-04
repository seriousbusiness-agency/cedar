<?php
	$productNames = [];
	$industryNames = [];
	$partnerNames = [];

	foreach ($page->children()->listed() as $useCase) {
			foreach($useCase->productTax()->split() as $slug) {
					$product = site()->products()->toStructure()->findBy('slug', $slug);
					if($product) {
							$productNames[] = $product->name()->value();
					}
			}

			foreach($useCase->industryTax()->split() as $slug) {
					$industry = site()->industries()->toStructure()->findBy('slug', $slug);
					if($industry) {
							$industryNames[] = $industry->name()->value();
					}
			}

			foreach($useCase->partnerTax()->split() as $slug) {
					$partner = site()->partners()->toStructure()->findBy('slug', $slug);
					if($partner) {
							$partnerNames[] = $partner->name()->value();
					}
			}
	}

$uniqueProductNames = array_unique($productNames);
$uniqueIndustryNames = array_unique($industryNames);
$uniquePartnerNames = array_unique($partnerNames);
?>

<section class="use-cases" id="use-cases" data-component="use-cases">
	<header class="use-cases__heading">

		<div class="use-cases__content">
			<h2 class="use-cases__title" data-anim="lines"><?= $block->title() ?></h2>
			<p class="use-cases__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
		</div>

		<div class="use-cases__filters-wrapper">
			<div class="use-cases__filters">
				<p class="use-cases__filters__title">Filters</p>

				<?php if(count($uniqueProductNames)): ?>
					<div class="use-cases__filters__items-wrapper">
						<div class="use-cases__filters__items">
							<p class="use-cases__filters__items__title">Product</p>
							<?php foreach ($uniqueProductNames as $name): ?>
								<?php $product = site()->products()->toStructure()->findBy('name', $name); ?>
								<?php if ($product): ?>
									<div class="use-cases__filters__item">
										<label for="<?= $product->slug() ?>">
											<input type="checkbox" data-filter-product="<?= $product->slug() ?>" id="<?= $product->slug() ?>" name="<?= $product->slug() ?>" required>
											<span class="use-cases__filters__item__text"><?= $name ?></span>
										</label>
									</div>
								<?php endif ?>
							<?php endforeach ?>
						</div>
					</div>
				<?php endif; ?>


				<?php if(false): ?>
					<?php if(count($uniqueIndustryNames)): ?>
						<div class="use-cases__filters__items-wrapper">
							<div class="use-cases__filters__items">
								<p class="use-cases__filters__items__title">Industry</p>
								<?php foreach ($uniqueIndustryNames as $name): ?>
									<?php $industry = site()->industries()->toStructure()->findBy('name', $name); ?>
									<?php if ($industry): ?>
										<div class="use-cases__filters__item">
											<label for="<?= $industry->slug() ?>">
												<input type="checkbox" data-filter-industry="<?= $industry->slug() ?>" id="<?= $industry->slug() ?>" name="<?= $industry->slug() ?>" required>
												<span class="use-cases__filters__item__text"><?= $name ?></span>
											</label>
										</div>
									<?php endif ?>
								<?php endforeach ?>
							</div>
						</div>
					<?php endif; ?>
				<?php endif; ?>

				<?php if(count($uniquePartnerNames)): ?>
					<div class="use-cases__filters__items-wrapper">
						<div class="use-cases__filters__items">
							<p class="use-cases__filters__items__title">Partner</p>
							<?php foreach ($uniquePartnerNames as $name): ?>
								<?php $partner = site()->partners()->toStructure()->findBy('name', $name); ?>
								<?php if ($partner): ?>
									<div class="use-cases__filters__item">
										<label for="<?= $partner->slug() ?>">
											<input type="checkbox" data-filter-partner="<?= $partner->slug() ?>" id="<?= $partner->slug() ?>" name="<?= $partner->slug() ?>" required>
											<span class="use-cases__filters__item__text"><?= $name ?></span>
										</label>
									</div>
								<?php endif ?>
							<?php endforeach ?>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</header>

	<div class="use-cases__items">
		<?php foreach ($page->children()->listed() as $useCase): ?>
			<a href="<?= $useCase->url() ?>"
				data-filter-product="<?= $useCase->productTax()->value() ?>"
				data-filter-partner="<?= $useCase->partnerTax()->value() ?>"
				data-filter-industry="<?= $useCase->industryTax()->value() ?>"
				data-router
				class="use-cases__item">
				<figure class="use-cases__item__image">
					<?php if($image = $useCase->featuredImage()->toFile()): ?>
						<img src="<?= $image->url() ?>" alt="<?= $useCase->title() ?>">
					<?php endif ?>
					<?php if(count($useCase->productTax()->split())): ?>
						<div class="use-cases__item__categories">
							<?php foreach ($useCase->productTax()->split() as $slug):?>
								<?php $product = site()->products()->toStructure()->findBy('slug', $slug);?>
								<?php if ($product):?>
									<p class="use-cases__item__category"><?= $product->name()?></p>
								<?php endif?>
							<?php endforeach ?>
						</div>
					<?php endif; ?>
				</figure>
				<div class="use-cases__item__content">
					<p class="use-cases__item__company"><?= $useCase->company() ?></p>
					<h3 class="use-cases__item__title" data-anim="lines"><?= $useCase->title() ?></h3>
					<?php if(false): ?>
						<p class="use-cases__item__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $useCase->excerpt() ?></p>
					<?php endif; ?>
					<div class="use-cases__item__link-wrapper">
						<div class="use-cases__item__link">
							<span class="use-cases__item__link__arrow"></span>
							<span class="use-cases__item__link__title"><?= $kirby->language()->code() === 'en' ? 'Learn more' : 'Mehr erfahren' ?></span>
							<span class="use-cases__item__link__arrow"></span>
						</div>
					</div>
				</div>
			</a>
		<?php endforeach ?>
	</div>
</section>
