<?php

namespace Shah\Novus\Services\AI;

use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

class AiService
{
    /**
     * The AI provider to use.
     */
    protected string $provider;

    /**
     * The model to use with the provider.
     */
    protected string $model;

    /**
     * The timeout for AI requests in seconds.
     */
    protected int $timeout;

    /**
     * Create a new AI service instance.
     */
    public function __construct(
        protected PromptService $promptService
    ) {
        $this->provider = Config::get('novus.ai.provider', 'openai');
        $this->model = Config::get('novus.ai.model', 'gpt-4o');

        $this->timeout = Config::get('novus.ai.timeout', 30);
    }

    /**
     * Check if AI features are enabled.
     */
    public function isEnabled(): bool
    {
        $enabled = Config::get('novus.ai.enabled', true);
        $apiKey = Config::get('novus.ai.provider_details.api_key');

        return $enabled && ! empty($apiKey);
    }

    /**
     * Generate text based on a prompt.
     *
     * @param  string  $prompt  The prompt to generate text from
     * @param  array  $options  Additional options for the generation
     * @return string|null The generated text or null if there was an error
     */
    public function generateText(string $prompt, array $options = []): ?string
    {
        if (! $this->isEnabled()) {
            return null;
        }

        try {
            $maxTokens = $options['max_tokens'] ?? Config::get('novus.ai.max_tokens.content_generation', 1000);
            $temperature = $options['temperature'] ?? 0.7;

            $providerEnum = $this->getProviderEnum($this->provider);

            // Build and execute the request using the real API
            try {
                $response = Prism::text()
                    ->using($providerEnum, $this->model)
                    ->withSystemPrompt('You are a helpful assistant that provides high-quality responses.')
                    ->withPrompt($prompt)
                    ->withMaxTokens($maxTokens)
                    ->usingTemperature($temperature)
                    ->withClientOptions(['timeout' => $this->timeout])
                    ->asText();

                return $response->text;
            } catch (Exception $e) {
                Log::error('Prism error: '.$e->getMessage(), [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]);

                // Return null instead of fallback for real API
                return null;
            }
        } catch (Exception $e) {
            Log::error('AI generation error: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Convert string provider name to Prism Provider enum
     *
     * @param  string  $provider  Provider name (e.g. 'openai')
     * @return Provider The corresponding Provider enum
     */
    protected function getProviderEnum(string $provider): Provider
    {
        return match (strtolower($provider)) {
            'openai' => Provider::OpenAI,
            'anthropic' => Provider::Anthropic,
            'mistral' => Provider::Mistral,
            'gemini' => Provider::Gemini,
            'groq' => Provider::Groq,
            'ollama' => Provider::Ollama,
            'xai' => Provider::XAI,
            'deepseek' => Provider::DeepSeek,
            'voyageai' => Provider::VoyageAI,
            default => Provider::OpenAI,
        };
    }

    /**
     * Fallback method for text generation when Prism is unavailable
     *
     * @param  string  $prompt  The prompt to process
     * @return string|null The generated text or null on failure
     */
    protected function fallbackTextGeneration(string $prompt): ?string
    {
        if (app()->environment('local', 'testing')) {
            return 'AI Response: This is a simulated response for the prompt: '.substr($prompt, 0, 100).'...';
        }

        return null;
    }

    /**
     * Improve the writing quality of the selected text.
     *
     * @param  string  $selectedText  Text to improve
     * @return string|null Improved text or null on failure
     */
    public function improveWriting(string $selectedText): ?string
    {
        $prompt = $this->promptService->improve($selectedText);

        return $this->generateText($prompt);
    }

    /**
     * Make the selected text shorter/more concise.
     *
     * @param  string  $selectedText  Text to shorten
     * @param  int|null  $targetLength  Optional target length
     * @return string|null Shortened text or null on failure
     */
    public function shortenText(string $selectedText, ?int $targetLength = null): ?string
    {
        $prompt = $this->promptService->shorten($selectedText, $targetLength);

        return $this->generateText($prompt);
    }

    /**
     * Expand the selected text with more details and content.
     *
     * @param  string  $selectedText  Text to expand
     * @param  int|null  $targetLength  Optional target length
     * @return string|null Expanded text or null on failure
     */
    public function expandText(string $selectedText, ?int $targetLength = null): ?string
    {
        $prompt = $this->promptService->expand($selectedText, $targetLength);

        return $this->generateText($prompt);
    }

    /**
     * Adjust the tone of the selected text.
     *
     * @param  string  $selectedText  Text to adjust
     * @param  string  $targetTone  Desired tone (professional, casual, friendly, etc.)
     * @return string|null Tone-adjusted text or null on failure
     */
    public function adjustTone(string $selectedText, string $targetTone): ?string
    {
        $prompt = $this->promptService->adjustTone($selectedText, $targetTone);

        return $this->generateText($prompt);
    }

    public function generateSeoMetadata(string $title, ?string $excerpt = null): ?array
    {
        $prompt = $this->promptService->generateSeo($title, $excerpt);

        try {
            $schema = new ObjectSchema(
                name: 'seo_metadata',
                description: 'SEO metadata for a blog post',
                properties: [
                    new StringSchema('meta_title', 'Meta title (50-60 chars)'),
                    new StringSchema('meta_description', 'Meta description (150-160 chars)'),
                    new StringSchema('meta_keywords', 'Comma-separated keywords'),
                    new StringSchema('og_title', 'Open Graph title (60-70 chars)'),
                    new StringSchema('og_description', 'Open Graph description (150-200 chars)'),
                    new StringSchema('twitter_title', 'Twitter title (55-70 chars)'),
                    new StringSchema('twitter_description', 'Twitter description (150-200 chars)'),
                ],
                requiredFields: ['meta_title', 'meta_description', 'meta_keywords']
            );

            $providerEnum = $this->getProviderEnum($this->provider);

            $response = Prism::structured()
                ->using($providerEnum, $this->model)
                ->withSystemPrompt('You are an expert SEO analyst who creates optimized metadata.')
                ->withSchema($schema)
                ->withPrompt($prompt)
                ->withMaxTokens(Config::get('novus.ai.max_tokens.seo_generation', 800))
                ->usingTemperature(0.3)
                ->withClientOptions(['timeout' => $this->timeout])
                ->asStructured();

            return $response->structured;
        } catch (Exception $e) {
            Log::error('Failed to generate SEO metadata', [
                'error' => $e->getMessage(),
                'title' => $title,
            ]);

            // Fallback to JSON parsing method if structured approach fails
            try {
                $seoText = $this->generateText($prompt, [
                    'max_tokens' => Config::get('novus.ai.max_tokens.seo_generation', 800),
                    'temperature' => 0.3,
                ]);

                if (! $seoText) {
                    return null;
                }

                // Clean up potential markdown code blocks
                $cleanedText = preg_replace('/```(?:json)?\s*([\s\S]*?)```/m', '$1', $seoText);
                $seoData = json_decode(trim($cleanedText), true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('Failed to parse AI SEO response as JSON', [
                        'response' => $seoText,
                        'error' => json_last_error_msg(),
                    ]);

                    return null;
                }

                return $seoData;
            } catch (Exception $innerException) {
                Log::error('Exception in SEO fallback method', [
                    'message' => $innerException->getMessage(),
                ]);

                return null;
            }
        }
    }
}
