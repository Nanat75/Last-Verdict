<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JudgmentController;

Route::get('/', function () {
    return view('welcome');
})->name('menu');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Game & Judgment system (🔒 only for logged in users)
    Route::view('/game', 'game.index')->name('game');
    Route::post('/judgment', [JudgmentController::class, 'store'])->name('judgment.store');
    Route::get('/leaderboard-page', [JudgmentController::class, 'leaderboardPage'])->name('leaderboard.page');
});

require __DIR__.'/auth.php';
