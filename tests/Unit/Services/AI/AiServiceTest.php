<?php

use Shah\Novus\Services\AI\AiService;
use Shah\Novus\Services\AI\PromptService;

it('can be instantiated', function () {
    // Create a mock for the PromptService
    $promptService = mock(PromptService::class);

    // Create an instance of AiService
    $aiService = new AiService($promptService);

    // Verify the service can be instantiated
    expect($aiService)->toBeInstanceOf(AiService::class);
});
