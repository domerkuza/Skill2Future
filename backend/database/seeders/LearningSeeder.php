<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Language;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Exercise;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Choice;
use App\Models\User;

class LearningSeeder extends Seeder
{
    public function run(): void
    {
        // Langages
        $htmlLang = Language::create(['nom' => 'HTML5']);
        $cssLang = Language::create(['nom' => 'CSS3']);
        $jsLang = Language::create(['nom' => 'JavaScript']);
        $phpLang = Language::create(['nom' => 'PHP']);
        $pythonLang = Language::create(['nom' => 'Python']);
        $sqlLang = Language::create(['nom' => 'SQL']);

        // Modules
        $modules = [
            ['language_id' => $htmlLang->id, 'titre' => 'HTML5', 'description' => 'Maîtriser la structure du web', 'difficulte' => 'facile'],
            ['language_id' => $cssLang->id, 'titre' => 'CSS3', 'description' => 'Styliser vos pages web', 'difficulte' => 'moyen'],
            ['language_id' => $jsLang->id, 'titre' => 'JavaScript', 'description' => 'Rendre vos pages interactives', 'difficulte' => 'moyen'],
            ['language_id' => $phpLang->id, 'titre' => 'PHP', 'description' => 'Développement côté serveur', 'difficulte' => 'difficile'],
            ['language_id' => $pythonLang->id, 'titre' => 'Python', 'description' => 'Le langage universel', 'difficulte' => 'moyen'],
            ['language_id' => $sqlLang->id, 'titre' => 'SQL', 'description' => 'Gestion de base de données', 'difficulte' => 'moyen'],
        ];

        foreach ($modules as $moduleData) {
            $module = Module::create($moduleData);

            // Créer des leçons pour chaque module
            for ($i = 1; $i <= 5; $i++) {
                Lesson::create([
                    'module_id' => $module->id,
                    'titre' => 'Leçon ' . $i . ' - ' . $module->titre,
                    'contenu' => 'Contenu détaillé de la leçon ' . $i . ' sur ' . $module->titre . '...',
                    'ordre' => $i
                ]);
            }

            // Créer des exercices
            for ($i = 1; $i <= 3; $i++) {
                Exercise::create([
                    'module_id' => $module->id,
                    'titre' => 'Exercice Pratique ' . $i . ' - ' . $module->titre,
                    'difficulte' => 'moyen'
                ]);
            }

            // Créer un quiz pour chaque module
            $quiz = Quiz::create([
                'module_id' => $module->id,
                'titre' => 'Quiz - ' . $module->titre,
                'niveau' => 'Intermédiaire'
            ]);

            // Créer 5 questions par quiz
            for ($q = 1; $q <= 5; $q++) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'enonce' => "Question $q sur le module " . $module->titre . " ?",
                    'type' => 'multiple_choice',
                    'points' => 20
                ]);

                // 4 choix par question
                Choice::create(['question_id' => $question->id, 'label' => 'Choix A (Correct)', 'est_correct' => true]);
                Choice::create(['question_id' => $question->id, 'label' => 'Choix B', 'est_correct' => false]);
                Choice::create(['question_id' => $question->id, 'label' => 'Choix C', 'est_correct' => false]);
                Choice::create(['question_id' => $question->id, 'label' => 'Choix D', 'est_correct' => false]);
            }
        }
        
        // Example logic for progression
        // We will mock some completed lessons/quizzes in controllers or just let user attempt them
    }
}
