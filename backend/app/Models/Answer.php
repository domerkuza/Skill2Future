<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $guarded = [];

    public function attempt() { return $this->belongsTo(QuizAttempt::class, 'attempt_id'); }
    public function question() { return $this->belongsTo(Question::class); }
    public function choice() { return $this->belongsTo(Choice::class); }
}
