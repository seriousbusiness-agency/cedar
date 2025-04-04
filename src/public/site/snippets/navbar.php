<nav class="navbar" id="navbar" data-component="navbar">
    <div class="navbar__wrapper">
        <a href="<?= $kirby->language()->code() === 'en' ? '/en' : '/' ?>" class="navbar__logo" data-router data-anim="fadein"><?php snippet('logo') ?></a>

        <div class="navbar__close"><span></span></div>

        <div class="navbar__items">
            <ul class="navbar__links" data-anim="fadeinkeep">
							<?php foreach ($site->navbar()->toStructure()->first()->mainLinks()->toStructure() as $link): ?>
                    <li class="navbar__link <?= $link->type()->value() === 'dropdown' ? 'navbar__link--dropdown' : '' ?>">
                        <?php if ($link->type()->value() === 'simple'): ?>
                            <a href="<?= $link->url() ?>" data-router><?= $link->title() ?></a>
                        <?php else: ?>
                            <div class="navbar__link--dropdown__title"><span><?= $link->title() ?></span></div>
                            <div class="navbar__link__sublinks-wrapper">
                                <ul class="navbar__link__sublinks">
                                    <?php foreach ($link->sublinks()->toStructure() as $sublink): ?>
                                        <a href="<?= $sublink->url() ?>" data-router class="navbar__link__sublink">
                                            <?php if ($sublink->icon()->isNotEmpty()): ?>
																							<?php if($sublink->icon()->toFile()): ?>
																								<figure class="navbar__link__sublink__icon">
																										<img src="<?= $sublink->icon()->toFile()->url() ?>" alt="">
																								</figure>
																							<?php endif; ?>
                                            <?php endif ?>
                                            <span><?= $sublink->title() ?></span>
                                            <span class="navbar__link__sublink__arrow">
                                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.21204 12L10.212 8L6.21204 4" stroke="#343331" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </span>
                                        </a>
                                    <?php endforeach ?>
                                </ul>
                            </div>
                        <?php endif ?>
                    </li>
                <?php endforeach ?>
            </ul>

						<?php
						$hideContainer = false;
						foreach($kirby->languages() as $lang) {
								if($page->content($lang->code())->isHidden()->toBool()) {
										$hideContainer = true;
										break;
								}
						}
						?>

            <div class="navbar__languages-container <?= $hideContainer ? 'hide' : '' ?>" data-anim="fadein">
                <div class="navbar__languages-wrapper">
                    <div class="navbar__languages">
                        <?php foreach($kirby->languages() as $language): ?>
                            <a href="<?= $page->url($language->code()) ?>" data-router class="navbar__language <?= $language->code() ?><?= $kirby->language() === $language ? ' active' : '' ?>">
                                <span><?= Str::upper($language->code()) ?></span>
                            </a>
                        <?php endforeach ?>
                    </div>
                    <svg class="navbar__languages__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>

            <a href="<?= $kirby->language()->code() === 'en' ? '/en/contact' : '/contact' ?>" data-anim="fadein" data-anim-delay="1" data-router class="navbar__contact-button mobile-only <?= $hideContainer ? 'full' : '' ?>" data-anim="fadein">Contact</a>

            <?php if ($site->navbar()->toStructure()->first()->contactButton()->isNotEmpty()): ?>
                <?php $button = $site->navbar()->toStructure()->first()->contactButton()->toStructure()->first() ?>
                <div class="navbar__button" data-anim="fadein">
                    <?php snippet('button', [
                        'title' => $button->title(),
                        'arrow' => false,
                        'href' => $button->url(),
                        'target' => '_self'
                    ]) ?>
                </div>
            <?php endif ?>
        </div>
    </div>
</nav>
