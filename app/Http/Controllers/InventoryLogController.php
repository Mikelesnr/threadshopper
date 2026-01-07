<?php

namespace App\Http\Controllers;

use App\Models\InventoryLog;
use Illuminate\Http\Request;

class InventoryLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return InventoryLog::with('product')->get();
    }

    /**
     * Show the form for creating a new resource (admin UI).
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'change_type' => 'required|in:order,admin_update,restock',
            'quantity_before' => 'required|integer',
            'quantity_after' => 'required|integer',
            'description' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        return InventoryLog::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryLog $inventoryLog)
    {
        return $inventoryLog->load('product');
    }

    /**
     * Show the form for editing the specified resource (admin UI).
     */
    public function edit(InventoryLog $inventoryLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InventoryLog $inventoryLog)
    {
        $validated = $request->validate([
            'change_type' => 'required|in:order,admin_update,restock',
            'quantity_before' => 'required|integer',
            'quantity_after' => 'required|integer',
            'description' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $inventoryLog->update($validated);

        return $inventoryLog;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryLog $inventoryLog)
    {
        $inventoryLog->delete();
        return response()->noContent();
    }
}
