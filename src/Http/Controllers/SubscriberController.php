<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Shah\Novus\Http\Resources\SubscriberResource;
use Shah\Novus\Models\Subscriber;

class SubscriberController
{
    /**
     * Display a listing of the subscribers.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');

        $items_per_page = config('novus.items_per_page', 5);

        $query = Subscriber::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortDir);

        // Get paginated results
        $subscribers = $query->paginate($items_per_page)->withQueryString();

        return Inertia::render('Subscribers/Index', [
            'subscribers' => SubscriberResource::collection($subscribers),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
            ],
        ]);
    }

    /**
     * Store a newly created subscriber.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:novus_subscribers,email',
            'name' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,unsubscribed',
            'preferences' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        Subscriber::create([
            'email' => $request->email,
            'name' => $request->name,
            'status' => $request->status,
            'preferences' => $request->preferences,
            'subscribed_at' => now(),
        ]);

        return redirect()->route('novus.subscribers.index')
            ->with('success', 'Subscriber created successfully.');
    }

    /**
     * Update the specified subscriber.
     */
    public function update(Request $request, Subscriber $subscriber)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:novus_subscribers,email,'.$subscriber->id,
            'name' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,unsubscribed',
            'preferences' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $subscriber->update([
            'email' => $request->email,
            'name' => $request->name,
            'status' => $request->status,
            'preferences' => $request->preferences,
        ]);

        return redirect()->route('novus.subscribers.index')
            ->with('success', 'Subscriber updated successfully.');
    }

    /**
     * Remove the specified subscriber.
     */
    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();

        return redirect()->route('novus.subscribers.index')
            ->with('success', 'Subscriber deleted successfully.');
    }

    /**
     * Bulk delete multiple subscribers.
     */
    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subscriber_ids' => 'required|array',
            'subscriber_ids.*' => 'exists:novus_subscribers,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        Subscriber::whereIn('id', $request->subscriber_ids)->delete();

        return redirect()->route('novus.subscribers.index')
            ->with('success', count($request->subscriber_ids).' subscribers deleted successfully.');
    }
}
