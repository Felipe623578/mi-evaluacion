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
        Schema::table('personas', function (Blueprint $table) {
            // Renombrar campos existentes
            $table->renameColumn('nombre', 'first_name');
            $table->renameColumn('apellido', 'last_name');
            $table->renameColumn('fecha_nacimiento', 'birth_date');
            $table->renameColumn('direccion', 'address');
            $table->renameColumn('telefono', 'phone');
            
            // Agregar nuevos campos
            $table->integer('age')->nullable()->after('birth_date');
            $table->string('profession')->nullable()->after('age');
            $table->string('photo_url')->nullable()->after('profession');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personas', function (Blueprint $table) {
            // Revertir renombrado de campos
            $table->renameColumn('first_name', 'nombre');
            $table->renameColumn('last_name', 'apellido');
            $table->renameColumn('birth_date', 'fecha_nacimiento');
            $table->renameColumn('address', 'direccion');
            $table->renameColumn('phone', 'telefono');
            
            // Eliminar nuevos campos
            $table->dropColumn(['age', 'profession', 'photo_url']);
        });
    }
};
