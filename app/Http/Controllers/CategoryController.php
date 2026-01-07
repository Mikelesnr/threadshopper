<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index()
    {
        return Cache::remember('categories.all', 3600, function () {
            return Category::all();
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:categories,slug',
            'status' => 'required|in:active,inactive',
        ]);

        $category = Category::create($validated);

        Cache::forget('categories.all'); // clear cached categories

        return $category;
    }

    public function show(Category $category)
    {
        return $category;
    }

    public function update(Request $request, Category $category)
    {
        $category->update($request->all());

        Cache::forget('categories.all'); // clear cached categories

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();

        Cache::forget('categories.all'); // clear cached categories

        return response()->noContent();
    }
}
