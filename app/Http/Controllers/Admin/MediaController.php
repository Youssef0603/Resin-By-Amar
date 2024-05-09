<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Helpers\Response;
use App\Repositories\App\Media\MediaRepositoryInterface;

class MediaController extends Controller
{
    public function __construct(private readonly MediaRepositoryInterface $mediaRepository)
    {
        
    }
  
    public function destroy($id){
        try{
            $this->mediaRepository->destroy($id);
            return Response::success("Media has been deleted");
        }catch(\Exception $e){
            return Response::error(500,$e->getMessage());
        }
    } 
}
