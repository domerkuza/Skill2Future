<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::post('/test', function () {
    return response()->json(['message' => 'Test route works']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
    });
});

// Learning & Quiz Routes (Outside auth for easier frontend testing during development, ideally should be inside auth:sanctum)
use App\Http\Controllers\LearningController;
use App\Http\Controllers\QuizController;

Route::get('/progression', [LearningController::class, 'getProgression']);
Route::get('/module/{id}', [LearningController::class, 'getModuleDetails']);

Route::get('/quiz/{id}', [QuizController::class, 'getQuiz']);
Route::post('/quiz/{id}/soumettre', [QuizController::class, 'submitQuiz']);
Route::get('/resultat/{idTentative}', [QuizController::class, 'getResult']);
