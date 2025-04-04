<?php
if ($page->isHidden()->toBool()) {
    go('error');
    exit;
}
?>

<?php snippet('header') ?>

<section class="hero-full" id="hero-full" data-component="hero-full">
  <div class="hero-full__image">
		<?php if($video = $page->featuredVideo()->toFile()): ?>
			<div class="hero-full__cursor" data-cursor="hover-video">
				<div class="wrapper">
					<div class="base">
						<span>Play <span class="mobile-only">video</span></span>
					</div>
				</div>
			</div>
			<?php if($page->videoPoster()->toFile()): ?>
				<img class="hero-full__poster" src="<?= $page->videoPoster()->toFile()->url() ?>" alt="<?= $page->title() ?>">
			<?php endif; ?>
			<video
				preload="metadata"
				src="<?= $video->url() ?><?= $page->videoPoster()->toFile() ? '' : '#t=0.001' ?>"
			></video>
    <?php elseif($image = $page->featuredImage()->toFile()): ?>
      <img src="<?= $image->url() ?>" alt="<?= $page->title() ?>">
    <?php endif ?>

    <div class="hero-full__content">
      <?php if($logo = $page->logoWhite()->toFile()): ?>
        <figure class="hero-full__logo">
          <img src="<?= $logo->url() ?>" alt="<?= $page->title() ?>">
        </figure>
      <?php endif ?>

			<?php if(count($page->productTax()->split())): ?>
				<div class="hero-full__categories">
					<?php foreach ($page->productTax()->split() as $slug):?>
						<?php $product = site()->products()->toStructure()->findBy('slug', $slug);?>
						<?php if ($product):?>
							<p class="hero-full__category" data-anim="lines"><?= $product->name()?></p>
						<?php endif?>
					<?php endforeach ?>
				</div>
			<?php endif; ?>

      <h1 class="hero-full__title" data-anim-adjust data-anim="lines" data-anim-delay="0.2"><?= $page->title() ?></h1>
      <p class="hero-full__paragraph" data-anim="lines" data-anim-delay="0.4"><?= $page->excerpt() ?></p>
    </div>
  </div>
</section>

<?php foreach ($page->blocks()->toBlocks() as $block): ?>
  <?php snippet('blocks/' . $block->type(), ['block' => $block]) ?>
<?php endforeach ?>

<?php snippet('closing') ?>
