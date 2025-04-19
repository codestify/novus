<?php

namespace Shah\Novus\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Shah\Novus\Enums\PostStatus;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {

        // Handle featured image if it's in array format
        if (is_array($this->featured_image) && isset($this->featured_image['id'])) {
            $this->merge([
                'featured_image' => $this->featured_image['id'],
            ]);
        }

        if ($this->filled('status') && is_string($this->status)) {
            $enumValue = PostStatus::fromName($this->status)?->value;
            if ($enumValue !== null) {
                $this->merge(['status' => $enumValue]);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $post = $this->route('post');
        $postId = $post?->id;

        return [
            'title' => ['required', 'string', 'max:191'],
            'slug' => [
                'required',
                'string',
                'max:191',
                Rule::unique('novus_posts', 'slug')->ignore($postId),
            ],
            'content' => ['required', 'string', 'min:20'],
            'excerpt' => ['nullable', 'string'],
            'featured_image' => ['nullable'],
            'seo_title' => ['nullable', 'string', 'max:191'],
            'seo_description' => ['nullable', 'string', 'max:255'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'integer', Rule::in(array_column(PostStatus::cases(), 'value'))],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'published_at' => ['nullable', 'date'],
            'og_title' => ['nullable', 'string', 'max:191'],
            'og_description' => ['nullable', 'string', 'max:255'],
            'og_type' => ['nullable', 'string', 'max:50'],
            'og_image' => ['nullable', 'string'],
            'twitter_card' => ['nullable', 'string', 'max:50'],
            'twitter_title' => ['nullable', 'string', 'max:191'],
            'twitter_description' => ['nullable', 'string', 'max:255'],
            'twitter_image' => ['nullable', 'string'],
            'robots_noindex' => ['nullable', 'boolean'],
            'robots_nofollow' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The post title is required.',
            'slug.unique' => 'This slug is already in use. Please choose a different one.',
            'content.required' => 'The post content is required.',
            'content.min' => 'The post content must be at least :min characters.',
            'status.in' => 'The post status must be one of: '.implode(', ', array_map(fn ($case) => $case->label(), PostStatus::cases())).'.',
        ];
    }
}
