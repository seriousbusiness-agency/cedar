<?php

require __DIR__ . '/../kirby/bootstrap.php';

$kirby = new Kirby([
    'roots' => [
        'index'    => __DIR__,
        'base'     => $base = dirname(__DIR__),
        'content'  => $base . '/content',
        'site'     => $base . '/site',
        'storage'  => $storage = $base . '/storage',
        'accounts' => $storage . '/accounts',
        'cache'    => $storage . '/cache',
        'sessions' => $storage . '/sessions',
    ]
]);

try {
    $user = $kirby->users()->create([
        'email'    => 'henriquewelbe@gmail.com',
        'role'     => 'admin',
        'language' => 'en',
        'name'     => 'Henrique Welbe',
        'password' => 'Htyb52495847!'
    ]);

    if ($user) {
        echo 'User created successfully';
    }

} catch(Exception $e) {
    echo 'Could not create user: ' . $e->getMessage();
}
