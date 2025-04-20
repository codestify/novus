<?php

namespace Shah\Novus\Http\Controllers;

use Closure;
use Illuminate\Http\Request;
use Shah\Novus\Models\Subscriber;

class BulkActionSubscriberController
{
    public function __invoke(Request $request)
    {
        $action = $request->input('action');
        $subscriber_ids = $request->input('subscriber_ids');

        if (empty($subscriber_ids)) {
            return redirect()->back()
                ->with('error', 'No subscribers selected.');
        }

        $subscribers = Subscriber::whereIn('id', $subscriber_ids)->get();

        $result = $this->getRelevantAction($action);

        if (! $result) {
            return redirect()->back()
                ->with('error', 'Invalid action.');
        }

        $actionData = $result();
        $subscribers->each($actionData['callback']);

        return redirect()->back()
            ->with('success', $actionData['message']);
    }

    public function getRelevantAction(mixed $action): ?Closure
    {
        return match ($action) {
            'delete' => fn () => [
                'message' => 'Subscribers deleted successfully.',
                'callback' => fn ($subscriber) => $subscriber->delete(),
            ],
            'activate' => fn () => [
                'message' => 'Subscribers activated successfully.',
                'callback' => fn ($subscriber) => $subscriber->update(['status' => 'active']),
            ],
            'deactivate' => fn () => [
                'message' => 'Subscribers deactivated successfully.',
                'callback' => fn ($subscriber) => $subscriber->update(['status' => 'inactive']),
            ],
            default => null,
        };
    }
}
