<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Shah\Novus\Services\AI\AiService;

class SeoController extends Controller
{
    /**
     * Generate SEO metadata using AI
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateSeo(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'excerpt' => 'nullable|string',
        ]);

        $excerpt = $validated['excerpt'] ?? '';
        $title = $validated['title'];

        $aiService = app(AiService::class);

        if (! $aiService->isEnabled()) {
            return response()->json([
                'success' => false,
                'message' => 'AI service is not enabled',
            ], 503);
        }

        $seoData = $aiService->generateSeoMetadata($title, $excerpt);

        if (! $seoData) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate SEO content',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $seoData,
        ]);
    }
}
