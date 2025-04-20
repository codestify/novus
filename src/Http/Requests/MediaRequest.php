<?php

namespace Shah\Novus\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Check if the user is authenticated with the novus guard
        return auth()->guard('novus')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'collection_name' => 'required|string|max:100',
            'custom_properties' => 'nullable|array',
        ];
    }
}
