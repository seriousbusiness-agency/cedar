<?php

use Kirby\Http\Response;

Kirby::plugin('partscloud/api-endpoints', [
    'routes' => [
        [
            'pattern' => 'api/pages/(:any)',
            'method'  => 'GET',
            'action'  => function ($slug) {
                $page = page($slug);

                if (!$page) {
                    return Response::json([
                        'error' => 'Page not found'
                    ], 404);
                }

                return [
                    'title' => $page->title()->value(),
                    'content' => $page->content()->toArray(),
                ];
            }
        ]
    ]
]);
