import { BaseLayout } from './layouts/BaseLayout'

function App() {
  return (
    <BaseLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your React App
        </h1>
        <p className="text-gray-600">
          This template includes:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600">
          <li>TypeScript support</li>
          <li>Tailwind CSS for styling</li>
          <li>React Query for data fetching</li>
          <li>Error Boundaries for error handling</li>
          <li>ESLint & Prettier for code formatting</li>
        </ul>
      </div>
    </BaseLayout>
  );
}

export default App
