<?php
    $categoryNames = [];
    $productNames = [];

    foreach ($page->children()->listed() as $post) {
        foreach($post->categoryTax()->split() as $slug) {
            $category = site()->categories()->toStructure()->findBy('slug', $slug);
            if($category) {
                $categoryNames[] = $category->name()->value();
            }
        }

        foreach($post->productTax()->split() as $slug) {
            $product = site()->blogProducts()->toStructure()->findBy('slug', $slug);
            if($product) {
                $productNames[] = $product->name()->value();
            }
        }
    }

    $uniqueCategoryNames = array_unique($categoryNames);
    $uniqueProductNames = array_unique($productNames);
?>

<section class="blog-listing" id="blog-listing " data-component="blog-listing">
    <header class="blog-listing__heading">
        <h2 class="blog-listing__title" data-anim="lines"><?= $block->title() ?></h2>
        <p class="blog-listing__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
    </header>
    <div class="blog-listing__posts-wrapper">
        <div class="blog-listing__filters">
            <p class="blog-listing__filters__title">Filters</p>
            <ul class="blog-listing__filters-section">
                <li class="blog-listing__filter active" data-filter="all">
                    All articles
                    <span class="blog-listing__filter__arrow">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.21204 12L10.212 8L6.21204 4" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </li>
            </ul>

            <?php if(count($uniqueCategoryNames)): ?>
            <ul class="blog-listing__filters-section">
                <?php foreach ($uniqueCategoryNames as $name): ?>
                    <?php $category = site()->categories()->toStructure()->findBy('name', $name); ?>
                    <?php if ($category): ?>
                        <li class="blog-listing__filter" data-filter="<?= $category->slug() ?>">
                            <?= $name ?>
                            <span class="blog-listing__filter__arrow">
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.21204 12L10.212 8L6.21204 4" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </li>
                    <?php endif ?>
                <?php endforeach ?>
            </ul>
            <?php endif ?>

            <?php if(count($uniqueProductNames)): ?>
            <ul class="blog-listing__filters-section">
                <p class="blog-listing__filters-section__title">Product</p>
                <?php foreach ($uniqueProductNames as $name): ?>
                    <?php $product = site()->blogProducts()->toStructure()->findBy('name', $name); ?>
                    <?php if ($product): ?>
                        <li class="blog-listing__filter" data-filter="<?= $product->slug() ?>">
                            <?= $name ?>
                            <span class="blog-listing__filter__arrow">
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.21204 12L10.212 8L6.21204 4" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </li>
                    <?php endif ?>
                <?php endforeach ?>
            </ul>
            <?php endif ?>

            <input class="blog-listing__search-bar" type="text" id="searchInput" placeholder="Search">
        </div>

        <div class="blog-listing__posts">
					<?php foreach ($page->children()->listed()->sortBy('date', 'desc') as $post): ?>
							<a href="<?= $post->url() ?>"
									data-router
									class="blog-listing__post"
									data-filter
									data-category="<?= $post->categoryTax()->value() ?>"
									data-product="<?= $post->productTax()->value() ?>">
									<figure class="blog-listing__post__image" data-anim="fadein">
											<?php if($image = $post->featuredImage()->toFile()): ?>
													<img src="<?= $image->url() ?>" alt="<?= $post->title()->escape() ?>">
											<?php endif ?>
									</figure>

									<div class="blog-listing__post__content">
											<div class="blog-listing__post__infos">
													<p class="blog-listing__post__date" data-anim="lines"><?= $post->date()->toDate('d.m.Y') ?></p>
													<p class="blog-listing__post__author" data-anim="lines" data-anim-delay="0.2"><?= $post->author()->escape() ?></p>
											</div>

											<h3 class="blog-listing__post__title" data-anim="lines" data-anim-delay="0.3"><?= $post->title()->escape() ?></h3>

											<div class="blog-listing__post__link-wrapper">
													<div class="blog-listing__post__link" data-anim="fadein" data-anim-delay="0.6" target="_self">
															<span class="blog-listing__post__link__arrow"></span>
															<span class="blog-listing__post__link__title"><?= $kirby->language()->code() === 'en' ? 'Learn more' : 'Mehr erfahren' ?></span>
															<span class="blog-listing__post__link__arrow"></span>
													</div>
											</div>
									</div>
							</a>
					<?php endforeach ?>
        </div>
    </div>
</section>
