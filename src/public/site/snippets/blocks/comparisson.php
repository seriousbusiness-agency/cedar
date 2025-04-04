<section class="comparisson" id="comparisson" data-component="comparisson">
    <header class="comparisson__heading">
        <h2 class="comparisson__title" data-anim="lines"><?= $block->title() ?></h2>
				<?php if($block->description()->isNotEmpty()): ?>
					<p class="comparisson__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
				<?php endif; ?>
    </header>

    <div class="comparisson__items-wrapper">
        <div class="comparisson__items__titles">
            <p class="comparisson__items__other"><?= $kirby->language()->code() === 'en' ? 'Other services' : 'Andere Anbieter' ?></p>
            <p class="comparisson__items__partscloud desktop-only"><?php snippet('logo') ?></p>
            <p class="comparisson__items__partscloud mobile-only"><?php snippet('logo-small') ?></p>
        </div>

        <?php foreach($block->categories()->toStructure() as $category): ?>
            <div class="comparisson__items">
                <div class="comparisson__item comparisson__item--title">
                    <header class="comparisson__item__header">
                        <h3 class="comparisson__item__title" data-anim="lines"><?= $category->title() ?></h3>
                    </header>
                </div>

                <?php foreach($category->items()->toStructure() as $item): ?>
                    <div class="comparisson__item">
                        <header class="comparisson__item__header">
                            <h3 class="comparisson__item__title" data-anim="lines"><?= $item->title() ?></h3>
                            <span class="comparisson__item__marker comparisson__item__<?= $item->hasInOtherServices()->value() ?>" data-anim="fadein"></span>
                            <span class="comparisson__item__marker comparisson__item__<?= $item->hasInPartscloud()->value() ?>" data-anim="fadein"></span>
                        </header>
                    </div>
                <?php endforeach ?>
            </div>
        <?php endforeach ?>
    </div>
</section>
