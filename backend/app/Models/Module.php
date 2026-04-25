<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $guarded = [];

    public function lessons() { return $this->hasMany(Lesson::class)->orderBy('ordre'); }
    public function exercises() { return $this->hasMany(Exercise::class); }
    public function quizzes() { return $this->hasMany(Quiz::class); }
    public function language() { return $this->belongsTo(Language::class); }
}
