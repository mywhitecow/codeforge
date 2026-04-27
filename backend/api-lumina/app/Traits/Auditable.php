<?php
namespace App\Traits;

use App\Models\Logbook;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    protected static function bootAuditable()
    {
        static::created(fn($model) => static::logChange('create', $model));
        static::updated(fn($model) => static::logChange('update', $model));
        static::deleted(fn($model) => static::logChange('delete', $model));
    }

    protected static function logChange($action, $model)
    {
        Logbook::create([
            'action' => $action,
            'table_name' => $model->getTable(),
            'ip_address' => Request::ip() ?? '127.0.0.1',
            'created_at' => now()->format('Y-m-d H:i:s'), // Cabe en char(20)
        ]);
    }
}