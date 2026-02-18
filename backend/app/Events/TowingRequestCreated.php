<?php

namespace App\Events;

use App\Models\TowingRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TowingRequestCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public TowingRequest $request)
    {
        $this->request->load(['customer', 'driver']);
    }

    public function broadcastOn(): Channel
    {
        return new Channel('towing-requests');
    }

    public function broadcastAs(): string
    {
        return 'request.created';
    }
}