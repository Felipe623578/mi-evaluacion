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
        Schema::dropIfExists('persons');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date');
            $table->integer('age');
            $table->string('profession');
            $table->text('address');
            $table->string('phone');
            $table->string('photo_url')->nullable();
            $table->timestamps();
        });
    }
};
