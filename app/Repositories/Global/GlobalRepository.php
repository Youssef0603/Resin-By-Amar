<?php

namespace App\Repositories\Global;

use Exception;
use App\Models\User;
use App\Models\Status;
use App\Constants\StatusTags;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class GlobalRepository implements GlobalRepositoryInterface
{
    /**
     * @throws Exception
     */
    public function getStatus($slug): Model|Builder
    {
        try {
            $status = User::query()
                ->where('tag', '=', $slug)
                ->where('slug', '=', $slug)
                ->first();

            if (!$status) {
                throw new Exception("Can't find status");
            }

            return $status;
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}
