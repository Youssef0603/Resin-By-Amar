<?php

namespace App\Helpers;

class Response
{

    public static function success($message, $data = null)
    {
        if ($data != null) {
            $response = ["success" => true, "message" => $message, "data" => $data];
        } else {
            $response = ["success" => true, "message" => $message,];
        }

        return response()->json($response);
    }


    public static function successWithPaging($data)
    {
        if ($data != null) {
            $response["success"] = true;
            if (is_array($data)) {
                $response = array_merge($response, $data);
            } else {
                $response = array_merge($response, $data->toArray());
            }
        } else {
            $response = ["success" => true];
        }

        return response()->json($response);
    }

    public static function unauthorized($message)
    {
        return self::error(401, $message, "Unauthorized");
    }

    public static function duplicate($message)
    {
        return self::error(409, $message, "Duplicate unique field");
    }

    public static function notfound($message, $reason = null)
    {
        if ($reason == null) {
            $reason = "The requested item is not found";
        }

        return self::error(404, $message, $reason);
    }

    public static function error($code, $message, $reason = null)
    {
        $error = ["code" => $code, "message" => $message, "reason" => $reason];
        $data = ["success" => false, "error" => $error];

        return response()->json($data, $code);
    }

    public static function notAllowed($message, $reason = null)
    {
        return self::error(405, $message, $reason);
    }

}
