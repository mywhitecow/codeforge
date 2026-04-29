<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Course extends Model
{
    use HasFactory;

    // 1. Agregamos esta lista de campos permitidos
    protected $fillable = [
        'title',
        'description',
        'duration',
        'level',
        'price',
        'category_id',
        'instructor_id',
        'min_subscription_id',
        'thumbnail_url',
        'is_active'
    ];

    // 2. Aquí abajo continúan tus relaciones intactas...
    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function instructor() {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function minSubscriptionPlan() {
        return $this->belongsTo(SubscriptionPlan::class, 'min_subscription_id');
    }   

    public function registrations() {
        return $this->belongsToMany(Registration::class, 'course_enrollments')
                    ->withPivot('progress', 'final_grade', 'enrollment_date');
    }
}