<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LearningController extends Controller
{
    public function getProgression(Request $request)
    {
        $modules = \App\Models\Module::withCount('lessons')->get();
        // Pour simuler la progression
        $modulesData = $modules->map(function ($module) {
            // Logique fictive de progression pour l'exemple (Ticket 1)
            $progression = rand(0, 100);
            $statut = $progression == 100 ? 'Complété' : ($progression > 0 ? 'En cours' : 'Verrouillé');
            
            return [
                'id' => $module->id,
                'titre' => $module->titre,
                'lecons_count' => $module->lessons_count,
                'progression' => $progression,
                'statut' => $statut,
                'difficulte' => $module->difficulte,
            ];
        });

        return response()->json($modulesData);
    }

    public function getModuleDetails($id)
    {
        $module = \App\Models\Module::with(['lessons', 'exercises'])->findOrFail($id);
        
        return response()->json([
            'id' => $module->id,
            'titre' => $module->titre,
            'description' => $module->description,
            'lecons' => $module->lessons,
            'exercices' => $module->exercises
        ]);
    }
}
