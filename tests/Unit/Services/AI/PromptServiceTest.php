<?php

use Shah\Novus\Services\AI\PromptService;

it('generates improve writing prompt', function () {
    $service = new PromptService;
    $text = 'This is test text to improve.';

    $prompt = $service->improve($text);

    expect($prompt)->toContain('This is test text to improve.')
        ->and($prompt)->toContain('You are a professional editor')
        ->and($prompt)->toContain('FORMAT YOUR RESPONSE AS PROPER MARKDOWN');
});

it('generates shorten text prompt', function () {
    $service = new PromptService;
    $text = 'This is a long text that needs to be shortened for clarity and conciseness.';

    // Without target length
    $prompt = $service->shorten($text);
    expect($prompt)->toContain($text)
        ->and($prompt)->toContain('Make it about 40-50% shorter')
        ->and($prompt)->toContain('You are a skilled editor who specializes in condensing text');

    // With target length
    $targetLength = 10;
    $promptWithLength = $service->shorten($text, $targetLength);
    expect($promptWithLength)->toContain("Aim for approximately {$targetLength} words");
});

it('generates expand text prompt', function () {
    $service = new PromptService;
    $text = 'Short text to expand.';

    // Without target length
    $prompt = $service->expand($text);
    expect($prompt)->toContain($text)
        ->and($prompt)->toContain('Make it about twice as long')
        ->and($prompt)->toContain('You are a professional writer who excels at elaborating');

    // With target length
    $targetLength = 100;
    $promptWithLength = $service->expand($text, $targetLength);
    expect($promptWithLength)->toContain("Aim for approximately {$targetLength} words");
});

it('generates adjust tone prompt', function () {
    $service = new PromptService;
    $text = 'This is regular text that needs a tone adjustment.';
    $tone = 'professional';

    $prompt = $service->adjustTone($text, $tone);

    expect($prompt)->toContain($text)
        ->and($prompt)->toContain("to be more {$tone}")
        ->and($prompt)->toContain('You are an expert editor');
});

it('includes markdown formatting instructions in all prompts', function () {
    $service = new PromptService;
    $text = 'Sample text.';

    $improve = $service->improve($text);
    $shorten = $service->shorten($text);
    $expand = $service->expand($text);
    $adjustTone = $service->adjustTone($text, 'casual');

    $formatInstruction = 'FORMAT YOUR RESPONSE AS PROPER MARKDOWN';

    expect($improve)->toContain($formatInstruction)
        ->and($shorten)->toContain($formatInstruction)
        ->and($expand)->toContain($formatInstruction)
        ->and($adjustTone)->toContain($formatInstruction);
});

it('provides clear instructions in each prompt', function () {
    $service = new PromptService;
    $text = 'Test content.';

    expect($service->improve($text))->toContain('Improves grammar, word choice, and flow')
        ->and($service->shorten($text))->toContain('Make the following text more concise')
        ->and($service->expand($text))->toContain('Expand the following text with additional relevant details')
        ->and($service->adjustTone($text, 'formal'))->toContain('Rewrite the following text to adjust its tone');
});
