<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Judgment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JudgmentController extends Controller
{
    // Save a judgment
    public function store(Request $request)
    {
        $data = $request->validate([
            'soul_mask' => 'required|string',
            'evidence' => 'nullable|array',
            'decision' => 'required|in:purgatory,hell',
            'corruption_change' => 'nullable|integer'
        ]);

        $judgment = Judgment::create([
            'user_id' => Auth::id(),
            'soul_mask' => $data['soul_mask'],
            'evidence' => json_encode($data['evidence'] ?? []),
            'decision' => $data['decision'],
            'corruption_change' => $data['corruption_change'] ?? 0
        ]);

        return response()->json([
            'ok' => true,
            'judgment' => $judgment
        ]);
    }

    // Leaderboard: show most judgments
public function leaderboardPage()
{
    $data = DB::table('judgments')
        ->join('users', 'judgments.user_id', '=', 'users.id')
        ->select('users.name',
            DB::raw("SUM(decision='hell') as condemned"),
            DB::raw("SUM(decision='purgatory') as redeemed"),
            DB::raw("COUNT(*) as total"))
        ->groupBy('users.id', 'users.name')
        ->orderByDesc('condemned')
        ->limit(20)
        ->get();

    return view('game.leaderboard', ['leaders' => $data]);
}

}
