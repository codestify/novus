<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Shah\Novus\Services\AI\AiService;

class AIController extends Controller
{
    public function __construct(
        protected AiService $aiService
    ) {}

    /**
     * Handle various AI content actions
     */
    public function handleAction(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'action' => 'required|string',
                'content' => 'required|string',
                'tone' => 'sometimes|string',
                'keywords' => 'sometimes|string',
            ]);

            $action = $validated['action'];
            $content = $validated['content'];

            if (! $this->aiService->isEnabled()) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI features are disabled in this installation.',
                ], 403);
            }

            // Let the AiService handle everything
            $response = match ($action) {
                'improve' => $this->aiService->improveWriting($content),
                'shorten' => $this->aiService->shortenText($content),
                'expand' => $this->aiService->expandText($content),
                'adjust-tone' => $this->aiService->adjustTone($content, $validated['tone'] ?? 'professional'),
                default => throw new \InvalidArgumentException("Unsupported action: {$action}")
            };

            return response()->json([
                'success' => true,
                'result' => $response,
                'original' => $content,
            ]);
        } catch (\Exception $e) {
            Log::error('AI Action error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
