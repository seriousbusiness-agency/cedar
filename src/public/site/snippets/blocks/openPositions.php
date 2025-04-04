<?php
    function getPersonioJobs()
    {
        static $cached_jobs = null;

        if ($cached_jobs !== null) {
            return $cached_jobs;
        }

        $personio_company_id = 'partscloud';
        $xml_feed_url = "https://partscloud.jobs.personio.de/xml";

        // Set up secure XML parsing options
        $options = LIBXML_NONET | LIBXML_NOCDATA | LIBXML_NOBLANKS;

        // Add timeout and error handling
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 5
            ]
        ]);

        $xml_content = @file_get_contents($xml_feed_url, false, $ctx);
        if ($xml_content === false) {
            return [];
        }

        // Use the secure options when loading XML
        $xml = @simplexml_load_string($xml_content, 'SimpleXMLElement', $options);
        $jobs = [];

        if ($xml) {
            foreach ($xml->position as $position) {
                // Get the first job description
                $firstDescription = '';
                // Inside getPersonioJobs() function, where we process the description
                if (isset($position->jobDescriptions->jobDescription[0]->value)) {
                    $firstDescription = strip_tags((string)$position->jobDescriptions->jobDescription[0]->value);
                }

                // Collect all office locations
                $offices = [(string)$position->office];
                if (isset($position->additionalOffices->office)) {
                    foreach ($position->additionalOffices->office as $additionalOffice) {
                        $offices[] = (string)$additionalOffice;
                    }
                }

                // Construct the application URL
                $job_id = htmlspecialchars((string)$position->id);
                $apply_url = "https://partscloud.jobs.personio.de/job/" . $job_id;

                $jobs[] = [
                    'title' => htmlspecialchars((string)$position->name),
                    'locations' => array_map('htmlspecialchars', $offices),
                    'department' => htmlspecialchars((string)$position->recruitingCategory),
                    'employment_type' => htmlspecialchars((string)$position->employmentType),
                    'description' => htmlspecialchars($firstDescription),
                    'apply_url' => $apply_url
                ];
            }
        }

        $cached_jobs = $jobs;
        return $jobs;
    }
?>

<section class="careers" id="careers" data-component="careers">
    <header class="careers__heading">
        <div class="careers__content">
            <h2 class="careers__title" data-anim="lines"><?= $block->title() ?></h2>
            <p class="careers__paragraph" data-anim="lines" data-anim-delay="0.2"><?= $block->description() ?></p>
        </div>

        <div class="careers__filters-wrapper">
            <div class="careers__filters">
                <p class="careers__filters__title">Filters</p>
                <div class="careers__filters__items-wrapper">
                    <div class="careers__filters__items">
                        <p class="careers__filters__items__title">Location</p>
                        <?php
                        $jobs = getPersonioJobs();
                        $locations = [];
                        foreach ($jobs as $job) {
                            $locations = array_merge($locations, $job['locations']);
                        }
                        $locations = array_unique($locations);
                        foreach($locations as $location):
                            $location_id = strtolower(str_replace(' ', '-', $location));
                        ?>
                            <div class="careers__filters__item">
                                <label for="<?= $location_id ?>">
                                    <input type="checkbox" data-filter-location="<?= $location_id ?>" id="<?= $location_id ?>" name="<?= $location_id ?>" required>
                                    <span class="careers__filters__item__text"><?= $location ?></span>
                                </label>
                            </div>
                        <?php endforeach ?>
                    </div>
                </div>

                <div class="careers__filters__items-wrapper">
                    <div class="careers__filters__items">
                        <p class="careers__filters__items__title">Function</p>
                        <?php
                        $jobs = getPersonioJobs();
                        $departments = array_unique(array_column($jobs, 'department'));
                        foreach($departments as $department):
                            $department_id = strtolower(str_replace(' ', '-', $department));
                        ?>
                            <div class="careers__filters__item">
                                <label for="<?= $department_id ?>">
                                    <input type="checkbox" data-filter-function="<?= $department_id ?>" id="<?= $department_id ?>" name="<?= $department_id ?>" required>
                                    <span class="careers__filters__item__text"><?= $department ?></span>
                                </label>
                            </div>
                        <?php endforeach ?>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="careers__items">
    <?php
    $jobs = getPersonioJobs();
    foreach($jobs as $job):
        $location_ids = array_map(function($loc) {
            return strtolower(str_replace(' ', '-', $loc));
        }, $job['locations']);
        $location_id = implode(',', $location_ids); // Changed from space to comma
        $department_id = strtolower(str_replace(' ', '-', $job['department'])); ?>
        <div class="careers__item" data-filter-location="<?= $location_id ?>" data-filter-function="<?= $department_id ?>">
            <header class="careers__item__heading">
                <h3 class="careers__item__title" data-anim="lines"><?= $job['title'] ?><span></span></h3>
                <div class="careers__item__tags">
                    <?php foreach ($job['locations'] as $location): ?>
                        <p class="careers__item__tag" data-anim="lines"><?= $location ?></p>
                    <?php endforeach ?>
                </div>
            </header>

            <div class="careers__item__content">
                <p class="careers__item__paragraph"><?= $job['description'] ?></p>
                <div class="careers__item__button">
                    <?php snippet('button', [
                        'title' => 'Apply now',
                        'arrow' => true,
                        'href' => $job['apply_url'],
                        'target' => '_blank'
                    ]) ?>
                </div>
            </div>
        </div>
    <?php endforeach ?>
</div>

</section>
