<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search     = $request->query('search');
        $categoryId = $request->query('category_id');
        $perPage    = $request->query('per_page', 15);
        $page       = $request->query('page', 1);

        $cacheKey = "products:" . md5($search . ':' . $categoryId . ':' . $perPage . ':' . $page);

        return Cache::remember($cacheKey, 600, function () use ($search, $categoryId, $perPage, $page) {
            $query = Product::with(['category', 'variants']);

            if ($search) {
                $query->where('name', 'LIKE', "%{$search}%");
            }

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            // Current page
            $paginator = $query->paginate($perPage, ['*'], 'page', $page);

            // Pre‑cache adjacent pages
            foreach ([$page - 1, $page + 1] as $adjacent) {
                if ($adjacent > 0 && $adjacent <= $paginator->lastPage()) {
                    $adjKey = "products:" . md5($search . ':' . $categoryId . ':' . $perPage . ':' . $adjacent);
                    Cache::remember($adjKey, 600, function () use ($query, $perPage, $adjacent) {
                        return ProductResource::collection(
                            $query->paginate($perPage, ['*'], 'page', $adjacent)
                        );
                    });
                }
            }

            return ProductResource::collection($paginator);
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'price'       => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image'       => 'nullable|string',
            'sku'         => 'nullable|string',
        ]);

        $product = Product::create($validated);

        Cache::flush();

        return new ProductResource($product->load(['category', 'variants']));
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load(['category', 'variants']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric',
            'category_id' => 'sometimes|exists:categories,id',
            'image'       => 'nullable|string',
            'sku'         => 'nullable|string',
        ]);

        $product->update($validated);

        Cache::flush();

        return new ProductResource($product->load(['category', 'variants']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        Cache::flush();

        return response()->noContent();
    }
}
