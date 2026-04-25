<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function getQuiz($id)
    {
        $quiz = \App\Models\Quiz::with('questions.choices')->findOrFail($id);
        
        return response()->json([
            'id' => $quiz->id,
            'titre' => $quiz->titre,
            'niveau' => $quiz->niveau,
            'temps_limite' => 15, // 15 minutes en dur pour l'amélioration
            'questions' => $quiz->questions
        ]);
    }

    public function submitQuiz(Request $request, $id)
    {
        // On s'attend à recevoir { "user_id": 1, "reponses": { "question_id": "choice_id" } }
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'reponses' => 'required|array'
        ]);

        $quiz = \App\Models\Quiz::with('questions.choices')->findOrFail($id);
        $score = 0;
        $totalQuestions = $quiz->questions->count();
        $answersData = [];

        foreach ($quiz->questions as $question) {
            $userChoiceId = $validated['reponses'][$question->id] ?? null;
            $isCorrect = false;

            if ($userChoiceId) {
                $correctChoice = $question->choices->where('est_correct', true)->first();
                if ($correctChoice && $correctChoice->id == $userChoiceId) {
                    $isCorrect = true;
                    $score += 100 / $totalQuestions; // calcul simple en %
                }
            }

            $answersData[] = [
                'question_id' => $question->id,
                'choice_id' => $userChoiceId,
                'est_correct' => $isCorrect
            ];
        }

        // Créer la tentative
        $attempt = \App\Models\QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $validated['user_id'],
            'score' => $score
        ]);

        // Enregistrer les réponses
        foreach ($answersData as $ans) {
            \App\Models\Answer::create(array_merge($ans, ['attempt_id' => $attempt->id]));
        }

        // Amélioration : Créer des recommandations aléatoires si score < 80
        if ($score < 80) {
            \App\Models\Recommendation::create([
                'user_id' => $validated['user_id'],
                'type' => 'module',
                'target_id' => $quiz->module_id,
                'raison' => "Réviser les concepts abordés dans le quiz."
            ]);
        }

        return response()->json([
            'message' => 'Quiz soumis avec succès',
            'attempt_id' => $attempt->id,
            'score' => $score
        ]);
    }

    public function getResult($idTentative)
    {
        $attempt = \App\Models\QuizAttempt::with(['quiz.module', 'user', 'answers.question'])->findOrFail($idTentative);
        $recommandations = \App\Models\Recommendation::where('user_id', $attempt->user_id)->get();

        return response()->json([
            'score_total' => $attempt->score,
            'quiz_titre' => $attempt->quiz->titre,
            'analyse' => [
                'HTML5' => 100, // Hardcodé pour le radar chart et l'UI
                'CSS3' => 85,
                'JavaScript' => 60,
                'SQL' => 40,
                'PHP' => 20
            ],
            'recommandations' => $recommandations
        ]);
    }
}
