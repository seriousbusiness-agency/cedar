<li class="cookieconsent__item" data-component="cookie-consent-item" data-name="<?= $item->title() ?>" data-value="<?= $item->text() ?>">
    <header>
        <div class="cookieconsent__tab-title">
            <h3><?= $item->title() ?></h3>
        </div>
        <?php snippet('switch-button', ['class' => strtolower($item->title()) === 'essential' ? 'active' : '']) ?>
    </header>
    <div class="cookieconsent__tab-content">
        <p><?= $item->value() ?></p>
    </div>
</li>
