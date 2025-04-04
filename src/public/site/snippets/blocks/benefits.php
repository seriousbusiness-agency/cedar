<section class="benefits benefits--<?= $block->color() ?>" id="benefits" data-component="benefits">
  <header class="benefits__heading">
    <h2 class="benefits__title" data-anim="lines"><?= $block->title() ?></h2>
    <p class="benefits__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
  </header>

  <div class="benefits__cards-wrapper">
    <ul class="benefits__cards fit-<?= $block->cardsPerLine()->value() ?>">
      <?php foreach($block->cards()->toStructure() as $card): ?>
        <?php if($card->isCallToAction()->isTrue()): ?>
          <a href="<?= $card->link()->toStructure()->first()->url() ?>"
             target="<?= $card->link()->toStructure()->first()->target() ?>"
             <?= $card->link()->toStructure()->first()->target() === '_self' ? 'data-router' : '' ?>
             class="benefits__card swiper-slide benefits__card--cta"
             >
            <h3 class="benefits__card__title" data-anim="lines"><?= $card->title() ?></h3>
            <p class="benefits__card__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $card->description() ?></p>
          </a>
        <?php else: ?>
          <li class="benefits__card swiper-slide">
            <h3 class="benefits__card__title" data-anim="lines"><?= $card->title() ?></h3>
            <p class="benefits__card__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $card->description() ?></p>
          </li>
        <?php endif ?>
      <?php endforeach ?>
    </ul>

    <div class="benefits__cards__buttons mobile-only">
      <div class="benefits__cards__button benefits__cards__button--prev"></div>
      <div class="benefits__cards__button benefits__cards__button--next"></div>
    </div>
  </div>
</section>
