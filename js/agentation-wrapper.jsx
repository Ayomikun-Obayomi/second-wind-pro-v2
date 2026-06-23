import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';

const rootEl = document.getElementById('agentation-root');

if (rootEl) {
  createRoot(rootEl).render(<Agentation />);
}
