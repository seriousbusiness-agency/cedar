<footer class="footer">
    <div class="footer__top">
        <div class="footer__left">
            <a href="/" data-router class="footer__logo" data-anim="fadein"><?php snippet('logo') ?></a>

            <div class="footer__contact">
                <?php foreach($site->footer()->toStructure()->first()->contact()->toStructure() as $contact): ?>
                    <a href="mailto:<?= $contact->email() ?>"
                       class="footer__contact__item"
                       data-anim="lines">
                        <?= $contact->email() ?>
                    </a>
                    <a href="tel:<?= $contact->phone() ?>"
                       class="footer__contact__item"
                       data-anim="lines">
                        <?= $contact->phone() ?>
                    </a>
                <?php endforeach ?>
            </div>

						<?php if($site->footer()->toStructure()->first()->supporters()->isNotEmpty()): ?>
							<div class="footer__supporters">
									<p class="footer__supporters__title" data-anim="lines">Supported by</p>

									<div class="footer__supporters__items" data-anim="fadein" data-anim-stagger="0.2">
											<?php foreach($site->footer()->toStructure()->first()->supporters()->toStructure() as $supporter): ?>
													<figure class="footer__supporters__item">
															<img src="<?= $supporter->logo()->toFile()->url() ?>" alt="">
													</figure>
											<?php endforeach ?>
									</div>
							</div>
						<?php endif; ?>
        </div>

        <div class="footer__links">
            <?php foreach($site->footer()->toStructure()->first()->links()->toStructure() as $section): ?>
                <div class="footer__links__item">
                    <p class="footer__links__item__title"><?= $section->title() ?></p>
                    <ul class="footer__links__links">
                        <?php foreach($section->links()->toStructure() as $link): ?>
                            <li class="footer__links__link">
                                <a href="<?= $link->url() ?>" target="<?= $link->target() ?>" <?= $link->target()->value() === '_self' ? 'data-router' : '' ?> data-anim="lines"><?= $link->title() ?></a>
                            </li>
                        <?php endforeach ?>
                    </ul>
                </div>
            <?php endforeach ?>
        </div>
    </div>

    <div class="footer__bottom">
        <p data-anim="lines">Copyright &copy; <?= date('Y') ?> PARTSCLOUD GmbH. All rights reserved.</p>
    </div>
</footer>
