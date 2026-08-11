import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

export function BackButton() {
  const navigate = useNavigate();

  function handleBack() {
    const historyState = window.history.state as { idx?: number } | null;

    if ((historyState?.idx ?? 0) > 0) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.home, { replace: true });
  }

  return (
    <div className="sk-back-nav">
      <button className="sk-back-button" type="button" onClick={handleBack}>
        <ArrowBackIcon fontSize="small" />
        <span>Regresar</span>
      </button>
    </div>
  );
}
