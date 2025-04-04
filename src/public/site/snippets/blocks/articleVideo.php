<section class="article-video" id="article-video" data-component="article-video">
	<div class="article-video__video">
		<div class="article-video__video__wrapper">
			<div class="article-video__video__container">
				<?php if ($video = $block->video()->toFile()): ?>
				<div class="article-video__video__thumb" data-component="lazy-video">
					<?php if ($thumbnail = $block->thumbnail()->toFile()): ?>
						<img class="poster "src="<?= $thumbnail->url() ?>" alt="<?= $thumbnail->alt() ?>">
					<video
						preload="metadata"
						src="<?= $video->url() ?>#t=0.001"
						playsinline
					></video>
					<?php endif ?>
				</div>
				<div class="article-video__video__cursor" data-cursor="hover-video">
					<div class="wrapper">
						<div class="base">
							<div>
								<span>PLAY</span>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect width="18" height="18" rx="9" fill="#A57CFF"/>
									<g clip-path="url(#clip0_7650_1298)">
									<path d="M6.5 5.66678V12.3335C6.49998 12.4076 6.51974 12.4804 6.55724 12.5443C6.59475 12.6083 6.64863 12.6611 6.71334 12.6973C6.77805 12.7334 6.85125 12.7517 6.92537 12.7501C6.99949 12.7486 7.07186 12.7273 7.135 12.6885L12.5517 9.35512C12.6123 9.31784 12.6624 9.26564 12.6972 9.20349C12.7319 9.14134 12.7502 9.07132 12.7502 9.00012C12.7502 8.92891 12.7319 8.8589 12.6972 8.79675C12.6624 8.7346 12.6123 8.6824 12.5517 8.64512L7.135 5.31178C7.07186 5.27294 6.99949 5.25164 6.92537 5.25009C6.85125 5.24854 6.77805 5.2668 6.71334 5.30298C6.64863 5.33915 6.59475 5.39194 6.55724 5.45589C6.51974 5.51985 6.49998 5.59265 6.5 5.66678Z" fill="#FDFDFD"/>
									</g>
									<defs>
									<clipPath id="clip0_7650_1298">
									<rect width="10" height="10" fill="white" transform="translate(4 4)"/>
									</clipPath>
									</defs>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<?php endif ?>
			</div>
		</div>
	</div>
</section>
