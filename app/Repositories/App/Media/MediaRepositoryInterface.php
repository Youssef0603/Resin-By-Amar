<?php
namespace App\Repositories\App\Media;

use App\Repositories\Base\BaseRepositoryInterface;

interface MediaRepositoryInterface extends BaseRepositoryInterface
{
    public function storeMedia($data);
}
