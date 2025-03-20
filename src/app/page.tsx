import { BookCheck, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-black p-4">
      <main className="max-w-2xl w-full bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 md:p-12 space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mental Health Diagnostic Screener
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Take the first step towards understanding your mental health with our
          comprehensive diagnostic screening tool.
        </p>

        <Link
          href="/screener/abcd-123"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
        >
          Start Screener
        </Link>

        <div className="mt-8 flex justify-center space-x-6 text-gray-500 dark:text-gray-400">
          <a
            href="https://www.blueprint.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <Brain size={20} />
            About Blueprint
          </a>
          <a
            href="https://github.com/blueprinthq/coding-exercise"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <BookCheck size={20} />
            Exercise Prompt
          </a>
        </div>
      </main>
    </div>
  );
}
