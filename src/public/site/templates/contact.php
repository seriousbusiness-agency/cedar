<?php
	if (@$_POST['action'] === 'fetch') {
		$email = $_POST['email'];

		$to = 'andreluisponce@gmail.com';
		$subject = 'Contact from Website';
		$headers = "Content-Type: text/plain; charset=UTF-8\r\n";
		$headers .= "From: $email\r\n";

		unset($_POST["action"]);

		$body = "";
		foreach ($_POST as $key => $value) :
			$body .= "$key: $value\r\n";
		endforeach;

		$result;

		try {
			$result = @mail($to, $subject, $body, $headers);
		} catch (Exception $e) {
		}

		$response = array(
			'result' => $result,
			// 'params' => $body,
			// 'to' => $to,
		);

		die(json_encode($response));
	}
	?>

	<?php
	if ($page->isHidden()->toBool()) {
			go('error');
			exit;
	}
?>

<?php snippet('header') ?>

<section class="contact">

	<!-- <form class="form" data-component="form">
		<div class="form__steps">
			<div class="form__steps-wrapper">
				<div class="form__step">
					<h2 class="form__title" data-anim="lines">How can we help?</h2>

					<div class="form__inputs" data-anim="fadein" data-anim-delay="0.15">
						<div class="form__line">
							<div class="form__input-wrapper">
								<input type="text" placeholder="Name*" name="name" required>
							</div>
							<div class="form__input-wrapper">
								<input type="email" placeholder="Email*" name="email" required>
							</div>
						</div>

						<div class="form__line">
							<div class="form__input-wrapper">
								<textarea placeholder="Write your message here..." name="message"></textarea>
							</div>
						</div>
					</div>

					<div class="form__action">
						<div class="form__submit" data-anim="fadein" data-anim-delay="0.3">
							<?php snippet('button', ['title' => 'Send message', 'arrow' => true, 'href' => '', 'target' => '']) ?>
						</div>

						<div class="form__status">&nbsp;</div>
					</div>
				</div>
			</div>
		</div>


	</form> -->

	<div class="form" data-anim="fadein">

	</div>

	<figure class="contact__figure" data-anim="fadein" data-anim-delay="0.3">
		<img src="<?= loadAsset('/img/placeholder-form.png') ?>" alt="">
	</figure>

</section>

<?php snippet('closing') ?>
