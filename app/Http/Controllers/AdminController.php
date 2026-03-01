<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $currentYear = now()->year;
        $revenueData = [];

        for ($i = 1; $i <= now()->month; $i++) {
            $date = Carbon::create($currentYear, $i, 1);
            $monthKey = $date->format('Y-m');
            $revenueData[$monthKey] = [
                'month' => ucfirst($date->translatedFormat('F')),
                'total' => 0,
            ];
        }

        Order::where('status', 'paid')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($order) {
                return $order->created_at->format('Y-m');
            })
            ->each(function ($orders, $month) use (&$revenueData) {
                if (isset($revenueData[$month])) {
                    $revenueData[$month]['total'] += (float) $orders->sum('total_amount');
                }
            });

        Membership::with('plan')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($membership) {
                return $membership->created_at->format('Y-m');
            })
            ->each(function ($memberships, $month) use (&$revenueData) {
                if (isset($revenueData[$month])) {
                    $revenueData[$month]['total'] += (float) $memberships->sum(function ($m) {
                        return (float) ($m->plan->discount_price ?? $m->plan->price ?? 0);
                    });
                }
            });

        return Inertia::render('dashboard', [
            'revenueData' => array_values($revenueData),
        ]);
    }

    public function create() { }
    public function store(Request $request) { }
    public function show($id) { }
    public function edit($id) { }
    public function update(Request $request, $id) { }
    public function destroy($id) { }
}
