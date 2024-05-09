<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statuses = [
            ['name' => 'Published', 'slug' => 'published', 'tag' => 'product'],
            ['name' => 'Out of Stock', 'slug' => 'out-of-stock', 'tag' => 'product'],
            ['name' => 'On Sale', 'slug' => 'on-sale', 'tag' => 'product'],
        ];

        foreach ($statuses as $status) {
            $existingStatus = DB::table('statuses')
                ->where('slug', $status['slug'])
                ->where('tag', $status['tag'])
                ->first();

            if (!$existingStatus) {
                DB::table('statuses')->insert($status);
            }
        }
    }
}
