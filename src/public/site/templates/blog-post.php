<?php
if ($page->isHidden()->toBool()) {
    go('error');
    exit;
}
?>

<?php
	$categoryNames = [];
	foreach($page->categoryTax()->split() as $slug) {
		$category = site()->categories()->toStructure()->findBy('slug', $slug);
		if($category) {
				$categoryNames[] = $category;
		}
	}
?>

<?php snippet('header') ?>

<section class="article-hero" id="article-hero" data-component="article-hero">
	<div class="article-hero__infos">
		<div class="article-hero__link-wrapper">
			<a href="<?= $page->parent()->url() ?>" data-router class="article-hero__link" data-anim="fadein">
				<span class="article-hero__link__arrow"></span>
				<span class="article-hero__link__title">Back to overview</span>
				<span class="article-hero__link__arrow"></span>
			</a>
		</div>

		<div class="article-hero__infos-wrapper">
			<div class="article-hero__info" data-anim="fadein">
				<p class="article-hero__info__title" data-anim="lines">Date</p>
				<p class="article-hero__info__content" data-anim="lines" data-anim-delay="0.2"><?= $page->date()->toDate('d.m.Y') ?></p>
			</div>

			<div class="article-hero__info">
				<p class="article-hero__info__title" data-anim="lines">Category</p>
				<p class="article-hero__info__content" data-anim="lines" data-anim-delay="0.2">News</p>
			</div>

			<div class="article-hero__info">
				<p class="article-hero__info__title" data-anim="lines">Author</p>
				<p class="article-hero__info__content" data-anim="lines" data-anim-delay="0.2"><?= $page->author()->escape() ?></p>
			</div>
		</div>

		<div class="article-hero__categories">
			<?php
				foreach($page->categoryTax()->split() as $slug) {
					$category = site()->categories()->toStructure()->findBy('slug', $slug);
					if($category) { ?>
						<div class="article-hero__category" data-anim="lines" data-anim-delay="0.4">#<?= $category->name()?></div>
						<?php }
				}
			?>
		</div>
	</div>

	<div class="article-hero__content">
		<p class="article-hero__subtitle" data-anim="lines"><?= $page->subtitle() ?></p>
		<h1 class="article-hero__title" data-anim-adjust data-anim="lines" data-anim-delay="0.2"><?= $page->title() ?></h1>
		<p class="article-hero__paragraph" data-anim="lines" data-anim-delay="0.4"><?= $page->excerpt() ?></p>
		<?php if($image = $page->featuredImage()->toFile()): ?>
			<figure class="article-hero__image" data-anim="fadein">
				<img src="<?= $image->url() ?>" alt="<?= $page->title() ?>">
				<figcaption data-anim="lines"><?= $page->imageDescription() ?></figcaption>
			</figure>
		<?php endif ?>
	</div>
</section>

<section class="article-content-wrapper">
	<div class="article-content">
		<?php foreach ($page->blocks()->toBlocks() as $block): ?>
			<?php snippet('blocks/' . $block->type(), ['block' => $block]) ?>
		<?php endforeach ?>
	</div>
</section>

<?php snippet('closing') ?>
