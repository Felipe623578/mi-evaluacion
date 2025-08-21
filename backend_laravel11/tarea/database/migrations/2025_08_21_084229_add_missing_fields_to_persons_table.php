<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            if (!Schema::hasColumn('persons', 'age')) {
                $table->string('age')->nullable()->after('fecha_nacimiento');
            }
            if (!Schema::hasColumn('persons', 'profession')) {
                $table->string('profession')->nullable()->after('age');
            }
            if (!Schema::hasColumn('persons', 'photo_url')) {
                $table->string('photo_url')->nullable()->after('profession');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            $table->dropColumn(['age', 'profession', 'photo_url']);
        });
    }
};
