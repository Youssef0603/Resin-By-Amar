<?php

namespace App\Dtos\Media;

use App\DTOs\AbstractDto;

class StoreMediaDto extends AbstractDto
{
    private int $id;
    private mixed $media;
    private int|null $mediable_id;
    private string|null $mediable_type;

    final public function getMainModelId(){
        return $this->main_model_id;
    }

    final public function getId()
    {
        return $this->id;
    }

    final public function getMediableType()
    {
        return $this->mediable_type;
    }

    final public function getMediableId()
    {
        return $this->mediable_id;
    }

    final public function setMediableType($mediable_type)
    {
        $this->mediable_type = $mediable_type;
    }

    final public function setMediableId($mediable_id)
    {
        $this->mediable_id = $mediable_id;
    }

    final protected function map(array $data): bool
    {
        if (isset($data['id'])) {
            $this->id = $data['id'];
        }
        $this->media = $data['media'];
        $this->mediable_id = $data['mediable_id'] ?? null;
        $this->mediable_type = $data['mediable_type'] ?? null;
        return true;
    }

    final public function toArray(): array
    {
        $data = [
            'media' => $this->media,
            'mediable_id' => $this->mediable_id,
            'mediable_type' => $this->mediable_type,
        ];

        if (isset($this->id)) {
            $data['id'] = $this->id;
        }

        return $data;
    }
}
