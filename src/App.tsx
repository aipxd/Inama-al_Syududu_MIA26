import { BalanceCard } from './components/liquid';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-md">

        <Dashboard />
      </div>
    </div>
  );
}

export default App;