<?php


namespace App\Repositories\Base;

use App\Models\Shop;
use App\Models\User;
use App\Helpers\Response;
use Illuminate\Support\Arr;
use App\Constants\RoleTypes;
use App\Models\ListingModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Global\GlobalRepository;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class BaseRepository implements BaseRepositoryInterface
{
    public $model = null;

    public function list(Request $request)
    {
        $perPage = 10;
        $searchQuery = null;
        $filters = null;
        $sortingKey = 'id';
        $sortBy = 'DESC';
        $status = null;
        if ($request->has('per_page')) {
            $perPage = $request->per_page;
        }
        if ($request->has('search_query')) {
            $searchQuery = $request->search_query;
        }

        if ($request->has('filters')) {
            $filters = json_decode($request->filters);
        }

        if ($request->has('sorting_key')) {
            $sortingKey = $request->sorting_key;
        }

        if ($request->has('sort_by')) {
            $sortBy = $request->sort_by;
        }

        if ($request->has('status')) {
            $status = $request->status;
        }

        if (!is_subclass_of($this->model, ListingModel::class)) {
            return Response::error(
                ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
                "Model must extend ListingModel to be able to use with CrudRepository->paginate method",
                "$this->model should extend ListingModel and implement its methods"
            );
        }
        $platform = 'admin';

        return $this->model::listing($status)
            ->filter($filters, $platform)
            ->search($searchQuery, $platform)
            ->orderBy($sortingKey, $sortBy)
            ->when($request->has('paginated') && $request->paginated == false, function ($query) {
                return $query->get();
            }, function ($query) use ($perPage) {
                return $query->paginate($perPage);
            });
    }

    function insert($data)
    {
        $model = App::make($this->model);
        //check if multi dimensional array

        if (isset($data[0])) {
            return $this->insertMultiple($model, $data);
        } else {
            //remove any additional field that is not in the fillable array inside the model
            $data = $this->validate($model, $data);
            $item = $model->create($data);

            if ($item) {
                return $item;
            } else {
                return null;
            }
        }
    }

    function insertMultiple($model, $data)
    {
        foreach ($data as $key => $value) {
            $data[$key] = $this->validate($model, $value);
        }

        $items = $model->insert($data);

        if ($items) {
            return $items;
        } else {
            return null;
        }
    }

    private function validate($model, $data): array
    {
        return Arr::only($data, $model->getFillable());
    }

    public function createFromRequest(Request $request)
    {
        return $this->updateOrCreate($request->input());
    }

    public function updateOrCreate($input)
    {
        $model = App::make($this->model);

        //remove any additional field that is not in the fillable array inside the model
        $fields = $this->validate($model, $input);

        if (array_key_exists('id', $input)) {
            return $model->updateOrCreate(['id' => $input['id']], $fields);
        }

        return $model->create($fields);
    }

    public function update($id, $data)
    {
        $model = App::make($this->model);

        return $model->find($id)->update($data);
    }

    function destroy($id): bool
    {
        $model = App::make($this->model);
        $item = $model->find($id);

        if (!$item) {
            return false;
        } else if ($item->delete()) {
            return true;
        } else {
            return false;
        }
    }

    function toggleActive($id): bool
    {
        $model = App::make($this->model);
        $item = $model->find($id);

        $fillableFields = $model->getFillable();

        if (!$item) {
            return false;
        } else if (in_array('active', $fillableFields)) {
            $item->active = $item->active ? 0 : 1;
            if ($item->save()) {
                return true;
            }
        } else {
            return false;
        }
    }
}
