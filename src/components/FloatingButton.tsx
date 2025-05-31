import { useNavigate } from 'react-router-dom';

export function FloatingButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/record')}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:shadow-xl hover:scale-110"
    >
      <i className="fa-solid fa-plus text-xl"></i>
    </button>
  );
}