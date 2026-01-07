<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    // GET /product-variants
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);

        return ProductVariant::with('product')
            ->paginate($perPage);
    }

    // GET /product-variants/{id}
    public function show($id)
    {
        return ProductVariant::with('product')->findOrFail($id);
    }

    // POST /product-variants
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'size'       => 'nullable|string',
            'color'      => 'nullable|string',
            'image'      => 'nullable|string',
            'stock'      => 'required|integer|min:0',
        ]);

        $variant = ProductVariant::create($validated);

        return response()->json($variant->load('product'), 201);
    }

    // PUT /product-variants/{id}
    public function update(Request $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);

        $validated = $request->validate([
            'size'  => 'nullable|string',
            'color' => 'nullable|string',
            'image' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $variant->update($validated);

        return response()->json($variant->load('product'));
    }

    // DELETE /product-variants/{id}
    public function destroy($id)
    {
        ProductVariant::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
