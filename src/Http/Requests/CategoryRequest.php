<?php

namespace Shah\Novus\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $category = $this->route('category');
        $categoryId = $category ? $category->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'slug' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('novus_categories', 'slug')->ignore($categoryId),
            ],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:novus_categories,id'],
            'seo.meta_title' => ['nullable', 'string', 'max:191'],
            'seo.meta_description' => ['nullable', 'string'],
            'seo.canonical_url' => ['nullable', 'string', 'active_url'],
            'seo.meta_keywords' => ['nullable', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'seo.meta_title.max' => 'The meta title may not be greater than 191 characters.',
            'seo.canonical_url.active_url' => 'The canonical URL must be a valid URL.',
        ];
    }
}
