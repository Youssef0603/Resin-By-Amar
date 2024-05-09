<?php


namespace App\Repositories\Base;


use Illuminate\Http\Request;

interface BaseRepositoryInterface
{
    public function list(Request $request);

    public function update($id, $data);

    public function updateOrCreate($input);

    public function destroy($id);
    
    public function toggleActive($id);

    public function createFromRequest(Request $request);

    public function insert($data);

    public function insertMultiple($model, $data);
}
