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

					<h2 class="form__title" data-anim="lines">Great to meet you.</h2>

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
								<input type="text" placeholder="Your company*" name="company" required>
							</div>
							<div class="form__input-wrapper">
								<input type="text" placeholder="Your role" name="role">
							</div>
						</div>
					</div>

					<div class="form__action">
						<div class="form__next" data-anim="fadein" data-anim-delay="0.3">
							<?php snippet('button', ['title' => 'Next step', 'arrow' => true, 'href' => '', 'target' => '']) ?>
						</div>

						<div class="form__status">&nbsp;</div>
					</div>
				</div>

				<div class="form__step">
					<div class="form__back">
						<svg viewBox="0 0 16 16">
							<use href="<?= loadAsset('/img/arrow.svg#path') ?>"></use>
						</svg>
						<span>Back</span>
					</div>


					<h2 class="form__title">When would be a good<br> time for you?</h2>

					<div class="form__inputs">
						<div class="form__line">
							<div class="form__input-wrapper no-underline">
								<input type="hidden" class="form__datepicker" name="date" required>
							</div>
						</div>
					</div>

					<div class="form__action">
						<div class="form__submit">
							<?php snippet('button', ['title' => 'Book consultation', 'arrow' => true, 'href' => '', 'target' => '']) ?>
						</div>

						<div class="form__status">&nbsp;</div>
					</div>
				</div>
			</div>
		</div>
	</form> -->

	<div class="form" data-anim="fadein">
		<!-- Start of Meetings Embed Script -->
		<?php if($kirby->language()->code() === 'de'): ?>
			<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/milan-rossack/discovery-call-team?embed=true"></div>
			<script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
		<?php endif; ?>
		<?php if($kirby->language()->code() === 'en'): ?>
			<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/milan-rossack/initial-consultation?embed=true"></div>
			<script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
		<?php endif; ?>
		<!-- End of Meetings Embed Script -->
	</div>

	<figure class="contact__figure" data-anim="fadein" data-anim-delay="0.3">
		<img src="<?= loadAsset('/img/consultation-placeholder.png') ?>" alt="">
	</figure>

</section>

<?php snippet('closing') ?>
