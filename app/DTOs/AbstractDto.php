<?php

namespace App\DTOs;

use InvalidArgumentException;

abstract class AbstractDto implements DtoInterface
{
    protected array|null $include;
    protected bool|null $paginated;
    protected int|null $limit;

    public function __construct(array $data)
    {
        if (!$this->map($data)) {
            throw new InvalidArgumentException('The mapping failed');
        }
//        $this->paginated = $data['paginated'] ?? true;
//        $this->limit = $data['limit'] ?? null;
//        $this->include = isset($data['include']) ? Helper::extractLazyLoadObjects($data['include']) : null;
    }

    abstract protected function map(array $data): bool;

//    public function getIsPaginated(): bool
//    {
//        return $this->paginated;
//    }
}
