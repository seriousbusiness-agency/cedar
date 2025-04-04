<?php
	function loadManifest()
	{
			global $__MANIFEST_JSON__;
			global $__MANIFEST__;

			if (!isset($__MANIFEST_JSON__)) {
					$manifestPath = kirby()->root('index') . '/manifest.json'; // Load from root directory
					$__MANIFEST_JSON__ = file_get_contents($manifestPath);
					$__MANIFEST__ = json_decode($__MANIFEST_JSON__);
			}
	}

	function loadAsset($fileName, $path = "")
	{
			loadManifest();
			global $__MANIFEST__;

			$filePaths = explode('/', $fileName);
			$originalFileName = array_pop($filePaths);
			$fileNameParts = explode('#', $originalFileName);
			$fileName = $fileNameParts[0];
			$paths = $filePaths + explode('/', $path);
			$paths = array_filter($paths, function ($v, $k) {
					return $v && $v != ".";
			}, ARRAY_FILTER_USE_BOTH);
			$root = $__MANIFEST__;
			foreach ($paths as &$dir) {
					if (!$dir) continue;
					$root = @$root->{$dir};
			}
			$extension = pathinfo($fileName, PATHINFO_EXTENSION);
			$hash = @$root->{$fileName};
			return (count($paths) ? "/" : "") . join("/", $paths) . '/' . str_replace("." . $extension, ($hash ? ("." . $hash) : "") . "." . $extension, $originalFileName);
	}

	function getManifest()
	{
			loadManifest(); // Ensure the manifest is loaded
			global $__MANIFEST_JSON__; // Use the loaded JSON
			return $__MANIFEST_JSON__;
	}

	function getJsManifest()
	{
			loadManifest(); // Ensure the main manifest is loaded
			global $__MANIFEST__;
			global $__MANIFEST_JSON__;

			// Load the jsmanifest.json file
			$jsManifestRefPath = kirby()->root('index') . '/jsmanifest.json';
			$__JS_MANIFEST_REF_JSON__ = file_get_contents($jsManifestRefPath);
			$__JS_MANIFEST_JSON__ = $__MANIFEST_JSON__;

			if ($__JS_MANIFEST_REF_JSON__) {
					$__JS_MANIFEST_REF__ = json_decode($__JS_MANIFEST_REF_JSON__);
					$__JS_MANIFEST__ = (object)[];

					// Recursive function to merge manifests
					function createJsManifest(&$refArr, &$fromArr, &$toArr)
					{
							foreach ($refArr as $key => &$value) {
									$nextFrom = @$fromArr->{$key};
									if (isset($nextFrom)) {
											if ((is_array($value) || is_object($value))) {
													$nextTo = (object)[];
													$toArr->{$key} = $nextTo;
													createJsManifest($value, $nextFrom, $nextTo);
											} else if ($value) {
													$toArr->{$key} = $nextFrom;
											}
									}
							}
					}

					// Merge the manifests
					createJsManifest($__JS_MANIFEST_REF__, $__MANIFEST__, $__JS_MANIFEST__);
					$__JS_MANIFEST_JSON__ = json_encode($__JS_MANIFEST__);
			}

			return $__JS_MANIFEST_JSON__;
	}

	loadManifest();
?>

<!DOCTYPE html>
<html lang="en" data-parent="<?= $page->parent() ? $page->parent()->slug() : '' ?>" data-template="<?= $page->slug() ?>">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content" />
	<meta name="theme-color" content="currentColor">
	<link rel="apple-touch-icon" sizes="180x180" href="<?= loadAsset("/img/favicon.svg") ?>">
	<link rel="icon" type="image/svg+xml" sizes="32x32" href="<?= loadAsset("/img/favicon.svg") ?>">
	<link rel="icon" type="image/svg+xml" sizes="16x16" href="<?= loadAsset("/img/favicon.svg") ?>">
	<link rel='shortcut icon' type="image/svg+xml" href='<?= loadAsset("/img/favicon.svg") ?>' />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="<?= loadAsset("/img/opengraph.png") ?>" />
	<meta property="og:url" content="<?= $site->url() ?>" />

	<!-- twitter card -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:image" content="<?= loadAsset("/img/opengraph.png") ?>">
	<meta name="twitter:image:src" content="<?= loadAsset("/img/opengraph.png") ?>">
	<meta name="twitter:site" content="<?= $site->url() ?>">

	<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/9285973.js"></script>

	<title><?= $page->title()->html() ?></title>

	<% if(!ENV.production){ %>
		<script src="<?= loadAsset('/js/runtime.js') ?>"></script>
	<% } %>

	<% if(ENV.production){ %>
    <link rel="stylesheet" href="<?= loadAsset('/css/essential.css') ?>">
    <!-- <link rel="stylesheet" href="<?= loadAsset('/css/main.css') ?>"> -->
	<% } %>

	<script>
		window.baseURL = window.location.origin;
		window.manifest = <?= getJsManifest() ?>;
		window.otherManifest = <?= getManifest() ?>;
		<% if(ENV.debug){ %>
			window.debug = true;
		<% } %>
		<% if(!ENV.production){ %>
			window.dev = true;
		<% } %>
		<% if(ENV.extract){ %>
			window.extract = true;
		<% } %>
	</script>

	<script type="text/javascript" src="https://js.hsforms.net/forms/embed/v2.js"></script>

</head>
<body>
	<?php snippet('preloader') ?>
	<?php snippet('transition') ?>

	<div class="root hide">
	<?php snippet('cookie-consent') ?>
	<?php snippet('cursor') ?>

	<div class="wrapper">
		<main class="root-section">
			<?php snippet('navbar') ?>


