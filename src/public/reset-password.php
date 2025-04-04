<?php

require 'kirby/bootstrap.php';

$kirby = new Kirby\Cms\App([
    'options' => [
        'api.allowImpersonation' => true
    ]
]);

// Impersonate an admin user
$kirby->impersonate('kirby');

$email = 'henriquewelbe@gmail.com';
$newPassword = 'bakugans1';

// Check if user exists
$user = $kirby->user($email);

if (!$user) {
    die('User not found');
}

try {
    // Use the update method to directly set the password
    $user->update([
        'password' => $newPassword
    ]);

    echo 'Password changed successfully! You can now try to login through the Panel.';

} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
