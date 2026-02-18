<?php

namespace App\Http\Controllers;

use App\Models\TowingRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TowingRequestController extends Controller
{
    /**
     * GET /api/requests
     * Drivers see all pending/assigned, Customers see only their own
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user && $user->role === 'customer') {
            $requests = TowingRequest::where('customer_id', $user->id)
                ->with('driver')
                ->latest()
                ->get();
        } else {
            // Driver or unauthenticated: see all
            $requests = TowingRequest::with(['customer', 'driver'])
                ->latest()
                ->get();
        }

        return response()->json([
            'success' => true,
            'data'    => $requests,
        ]);
    }

    /**
     * POST /api/requests
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'location'      => 'required|string|max:500',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'note'          => 'nullable|string',
        ]);

        // If authenticated customer, link to their account
        if ($request->user() && $request->user()->role === 'customer') {
            $validated['customer_id'] = $request->user()->id;
        }

        $towingRequest = TowingRequest::create($validated);

        // Broadcast event for real-time (see Step 6)
        broadcast(new \App\Events\TowingRequestCreated($towingRequest))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Towing request submitted successfully!',
            'data'    => $towingRequest->load(['customer', 'driver']),
        ], 201);
    }

    /**
     * PATCH /api/requests/{id}/accept
     * Driver accepts the request
     */
    public function accept(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role !== 'driver') {
            return response()->json([
                'success' => false,
                'message' => 'Only drivers can accept requests.',
            ], 403);
        }

        $towingRequest = TowingRequest::findOrFail($id);

        if ($towingRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Request is already assigned or completed.',
            ], 422);
        }

        $towingRequest->update([
            'status'    => 'assigned',
            'driver_id' => $user->id,
        ]);

        // Broadcast event for real-time
        broadcast(new \App\Events\TowingRequestUpdated($towingRequest))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Request accepted!',
            'data'    => $towingRequest->fresh(['customer', 'driver']),
        ]);
    }

    /**
     * PATCH /api/requests/{id}/complete
     * Driver marks as completed
     */
    public function complete(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role !== 'driver') {
            return response()->json([
                'success' => false,
                'message' => 'Only drivers can complete requests.',
            ], 403);
        }

        $towingRequest = TowingRequest::findOrFail($id);

        if ($towingRequest->driver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only complete your own requests.',
            ], 403);
        }

        $towingRequest->update(['status' => 'completed']);

        broadcast(new \App\Events\TowingRequestUpdated($towingRequest))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Request marked as completed!',
            'data'    => $towingRequest->fresh(['customer', 'driver']),
        ]);
    }
}