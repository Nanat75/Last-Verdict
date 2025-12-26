<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>The Last Verdict — Leaderboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Simple styling with Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center py-10">

    <h1 class="text-3xl font-bold mb-6">⚖️ Leaderboard of Judges</h1>

    <div class="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table class="table-auto w-full text-left">
            <thead class="bg-gray-700">
                <tr>
                    <th class="px-4 py-3">#</th>
                    <th class="px-4 py-3">Judge</th>
                    <th class="px-4 py-3 text-red-400">Condemned</th>
                    <th class="px-4 py-3 text-green-400">Redeemed</th>
                    <th class="px-4 py-3">Total Judgments</th>
                </tr>
            </thead>
            <tbody>
                @forelse($leaders as $index => $leader)
                    <tr class="border-b border-gray-700 hover:bg-gray-600">
                        <td class="px-4 py-2">{{ $index + 1 }}</td>
                        <td class="px-4 py-2 font-semibold">{{ $leader->name }}</td>
                        <td class="px-4 py-2 text-red-400">{{ $leader->condemned }}</td>
                        <td class="px-4 py-2 text-green-400">{{ $leader->redeemed }}</td>
                        <td class="px-4 py-2">{{ $leader->total }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center py-6">No judgments yet...</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <a href="{{ route('game') }}" class="mt-6 inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg">
        ▶️ Back to Game
    </a>

</body>
</html>
