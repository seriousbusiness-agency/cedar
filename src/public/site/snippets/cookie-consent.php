<div class="cookie-consent-wrapper">
	<section class="cookieconsent once-inview" id="cookie-consent" data-nosnippet data-component="cookie-consent">
			<div class="cookieconsent__wrapper">
					<section class="cookieconsent__module cookieconsent__main">
							<header>
									<div>
											<h3><?= $site->cookies()->toStructure()->first()->cookiesTitle() ?></h3>
									</div>
									<div>
											<p><?= $site->cookies()->toStructure()->first()->cookiesDescription() ?></p>
									</div>
							</header>
							<section class="cookieconsent__actions" data-cursor="none">
									<button class="button button--no-arrow button--primary--small accept-all-bt">
											<span><?= $site->cookies()->toStructure()->first()->cookiesAcceptAllText() ?></span>
									</button>
									<button class="button button--no-arrow button--transparent button--primary--white border decline-bt">
											<span><?= $site->cookies()->toStructure()->first()->cookiesDeclineText() ?></span>
									</button>
									<button class="button button--no-arrow manage-prefs-bt full">
											<span><?= $site->cookies()->toStructure()->first()->cookiesManagePreferencesText() ?></span>
									</button>
									<?php foreach($site->cookies()->toStructure()->first()->cookiesLinks()->toStructure() as $link): ?>
											<a class="link" href="<?= $link->url() ?>" data-router><?= $link->title() ?></a>
									<?php endforeach ?>
							</section>
					</section>

					<section class="cookieconsent__module cookieconsent__prefs hide">
							<header>
									<div class="cookieconsent__title-wrapper">
											<h3><?= $site->cookies()->toStructure()->first()->cookiesPreferencesTitle() ?></h3>
											<div class="cookieconsent__close">
													<svg viewBox="0 0 25 26">
															<use href="<?= url('assets/img/x-thin-ic.svg#x') ?>"></use>
													</svg>
											</div>
									</div>
									<p><?= $site->cookies()->toStructure()->first()->cookiesPreferencesText() ?></p>
							</header>
							<section class="cookieconsent__scroll no-scrollbar">
									<ul>
											<?php foreach($site->cookies()->toStructure()->first()->cookiePreferencesItems()->toStructure() as $item): ?>
													<?php snippet('cookie-consent-item', ['item' => $item]) ?>
											<?php endforeach ?>
									</ul>
							</section>
							<section class="cookieconsent__actions" data-cursor="none">
									<div>
											<button class="button button--no-arrow button--primary--small accept-all-bt">
													<span><?= $site->cookies()->toStructure()->first()->cookiesAcceptAllText() ?></span>
											</button>
											<button class="button button--no-arrow button--primary--small decline-bt button--primary--white">
													<span><?= $site->cookies()->toStructure()->first()->cookiesDeclineText() ?></span>
											</button>
									</div>
									<button class="button button--no-arrow button--primary--small save-bt button--primary--white">
											<span><?= $site->cookies()->toStructure()->first()->cookiesSaveText() ?></span>
									</button>
							</section>
					</section>
			</div>
	</section>
</div>
