<?php

namespace App\Http\Controllers;

use App\Models\TowingRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TowingRequestController extends Controller
{
    /**
     * API endpoint to list all towing requests
     */
    public function index(): JsonResponse
    {
        $requests = TowingRequest::latest()->get();
        return response()->json([
            'success' => true,
            'data'    => $requests,
        ]);
    }

    /**
     * API endpoint for posting request for towing service
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'location'      => 'required|string|max:500',
            'note'          => 'nullable|string',
        ]);

        $towingRequest = TowingRequest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Towing request submitted successfully!',
            'data'    => $towingRequest,
        ], 201);
    }

    /**
     * API endpoint for towing driver to accept a request
     */
    public function accept(int $id): JsonResponse
    {
        $towingRequest = TowingRequest::findOrFail($id);

        if ($towingRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Request is already assigned or completed.',
            ], 422);
        }

        $towingRequest->update(['status' => 'assigned']);

        return response()->json([
            'success' => true,
            'message' => 'Request accepted!',
            'data'    => $towingRequest->fresh(),
        ]);
    }
}