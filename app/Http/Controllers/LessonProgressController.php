<?php

namespace App\Http\Controllers;

use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonProgressController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        $progress = LessonProgress::where('user_id', Auth::id())
            ->where('lesson_id', $request->lesson_id)
            ->first();

        if ($progress) {
            $progress->update([
                'completed' => !$progress->completed,
                'completed_at' => !$progress->completed ? now() : null,
            ]);
        } else {
            LessonProgress::create([
                'user_id' => Auth::id(),
                'lesson_id' => $request->lesson_id,
                'completed' => true,
                'completed_at' => now(),
            ]);
        }

        return redirect()->back();
    }
}