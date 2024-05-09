<?php

namespace App\Repositories\App\Media;

use App\Repositories\App\Media\MediaRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use App\Models\ShopRequest;
use App\Models\Category;
use App\Models\Service;
use App\Models\Worker;
use App\Models\Media;
use App\Models\Owner;
use App\Models\Product;

class MediaRepository extends BaseRepository implements MediaRepositoryInterface
{
    public $model = Media::class;
    const COMPRESSION_RATIO = 20;

    public function __construct()
    {
        //
    }

    public function storeMedia($data)
    {
        $path = null;
        $payload = [];
        $response = [];
        $collection = "";
        $disk = "azure";
        $mediaList = $data['media'];
        $mediable_id = $data['mediable_id'];
        $mediable_type = $data['mediable_type'];
        

        switch ($mediable_type) {
            case Product::class:
                $path = "product/{$mediable_id}";
                $collection = "products";
                break;
            case Category::class:
                $path = "category/{$mediable_id}";
                $collection = "categories";
                break;
            default:
                $path = "default/{$mediable_id}";
                $collection = "media";
                break;
        }

        if(isset($mediaList)){
            foreach ($mediaList as $media) {
                $imageCdn = $this->uploadImage($media,$path);

                $payload = [
                    "disk" => $disk,
                    'cdn' =>  $imageCdn,
                    'collection' => $collection,
                    'size' => $media->getSize(),
                    'name' => $media->hashName(),
                    "mediable_id" => $mediable_id,
                    "mediable_type" => $mediable_type,
                    'mime_type' => $media->getClientMimeType(),
                    'file_name' => $media->getClientOriginalName(),
                    'file_hash' => uniqid() . "_" . md5(file_get_contents($media->getPathname())),
                ];
    
                $response[] = $this->updateOrCreate($payload);
            }
        }

        return $response;
    }

    private function uploadImage($file,$path){
        $file = $this->compressImage($file);
        $fileName = uniqid() . Str::random(5) . time() . '.' . $file->getClientOriginalExtension();
        $contentType = $file->getClientMimeType();
        $options = ['Content-Type' => $contentType];

        Storage::disk('azure')->putFileAs($path, $file, $fileName, $options);

        return Storage::disk('azure')->url("$path/$fileName");
    }

    private function compressImage($file)
    {
        $originalImage = imagecreatefromstring(file_get_contents($file->path()));
        $compressionQuality = self::COMPRESSION_RATIO;

        ob_start();
        imagejpeg($originalImage, null, $compressionQuality);
        $compressedImageData = ob_get_contents();
        ob_end_clean();

        $tempFilePath = tempnam(sys_get_temp_dir(), 'compressed_image');
        file_put_contents($tempFilePath, $compressedImageData);

        $compressedFile = new UploadedFile(
            $tempFilePath,
            $file->getClientOriginalName(),
            $file->getClientMimeType()
        );
        imagedestroy($originalImage);
        return $compressedFile;
    }
}
